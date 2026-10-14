// Run with Bun: validate authored evidence against production's conservative assessors.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { assessGuided, assessTransfer } from '../../src/features/learning/model/assessment.ts'

const filename = process.argv[2] || 'photosynthesis.v2.json'
const pkg = JSON.parse(readFileSync(new URL(`./${filename}`, import.meta.url), 'utf8'))
if (pkg.version >= 2) assert.equal(pkg.interactionContract.visibleComposerCount, 1)
const steps = new Set(pkg.steps.map(s => s.id))
const sources = new Set(pkg.sourceMaterials.map(s => s.id))
assert.equal(steps.size, pkg.steps.length, 'Unique stable step identities')
assert.deepEqual(pkg.simulationPaths.map(p => p.pathId), ['ready', 'misconception', 'clarification'])
assert.equal(pkg.transferCheck.rubric.reduce((n, c) => n + c.points, 0), 2)
assert.equal(pkg.transferCheck.firstAndRetrySeparate, true)
let assessed = 0
const ids = new Set()
function checkReferences(value) {
  if (!value || typeof value !== 'object') return
  if (Array.isArray(value.sourceRefs)) for (const id of value.sourceRefs) assert(sources.has(id), `Unknown source ${id}`)
  for (const child of Object.values(value)) if (child && typeof child === 'object') checkReferences(child)
}
checkReferences(pkg)
for (const step of pkg.steps) assert(step.contentBlocks.length, `${step.id} needs content`)
for (const path of pkg.simulationPaths) {
  assert.equal(path.immutable, true)
  let route = [...path.initialRoute]
  assert.equal(new Set(route).size, route.length)
  let current = null
  let draft = null
  let clarificationStep = null
  let teachingFeedback = false
  let preservedCheckDraft = false
  const attempts = new Map()
  const skipped = new Set()
  for (const [i, turn] of path.turnSequence.entries()) {
    assert(!ids.has(turn.id), `Duplicate turn ${turn.id}`); ids.add(turn.id)
    assert.equal(turn.sequence, i + 1)
    assert.equal(turn.provenance.origin, turn.speaker === 'learner' ? 'seeded' : 'authored')
    if (turn.speaker === 'learner') assert.equal(turn.provenance.seedTurnId, turn.id)
    if (turn.stepId) assert(steps.has(turn.stepId), `Unknown step ${turn.stepId}`)
    if (turn.event === 'show-step' || turn.event === 'show-recap') {
      assert(route.includes(turn.stepId), `Step ${turn.stepId} must be planned`)
      assert(!skipped.has(turn.stepId), 'Skipped step cannot be shown')
      current = turn.stepId
    }
    if (turn.event === 'save-answer-draft') draft = turn.content
    if (turn.event === 'ask-clarification') {
      assert.equal(turn.stepId, current); clarificationStep = current
      if (pkg.steps.find(s => s.id === current).kind === 'learner-prompt') {
        assert(draft, 'Check clarification preserves an existing answer draft')
        preservedCheckDraft = true
      } else {
        teachingFeedback = true
        assert(!turn.assessment && !turn.attemptId, 'Teaching conversation is not an assessed attempt')
      }
    }
    if (turn.event === 'answer-clarification' || turn.event === 'continue-after-clarification') {
      assert.equal(turn.stepId, clarificationStep)
      assert.equal(current, clarificationStep)
      assert.equal(turn.advance, false)
      if (pkg.steps.find(s => s.id === current).kind === 'learner-prompt') assert(draft, 'Answer draft preserved')
    }
    if (turn.event === 'submit-answer') {
      assert.equal(turn.stepId, current)
      assert(!attempts.has(turn.stepId), 'Submitted prompt is immutable')
      assert(turn.attemptId && turn.attemptKind)
      attempts.set(turn.stepId, turn)
    }
    if (turn.assessment) {
      const submitted = attempts.get(turn.stepId)
      assert(submitted, 'Assessment requires prior submission')
      if (['transfer', 'retry'].includes(turn.stepId)) {
        const result = assessTransfer(submitted.content, turn.stepId === 'retry')
        for (const key of ['score', 'prediction', 'reasoning', 'uncertain']) assert.equal(result[key], turn.assessment[key], `${turn.id} ${key}`)
      } else {
        assert.equal(assessGuided(submitted.content).category, turn.assessment.legacyCategory, turn.id)
      }
      assessed++
    }
    if (turn.routeChange) {
      const change = turn.routeChange
      assert([...attempts.values()].some(a => a.attemptId === change.triggerAttemptId))
      for (const id of change.stepIds) assert(steps.has(id))
      if (change.kind === 'skip') for (const id of change.stepIds) { assert(route.includes(id)); skipped.add(id) }
      else {
        assert(route.includes(change.afterStepId))
        for (const id of change.stepIds) assert(!route.includes(id), 'No duplicate insertion')
        route.splice(route.indexOf(change.afterStepId) + 1, 0, ...change.stepIds)
      }
    }
  }
  assert(attempts.has('transfer'))
  assert.equal(path.turnSequence.at(-1).event, 'finish')
  if (path.pathId === 'ready') assert(skipped.has('example'))
  if (path.pathId === 'misconception') assert(attempts.has('retry') && route.includes('matter-energy') && route.includes('follow-up'))
  if (path.pathId === 'clarification') {
    assert(clarificationStep && draft)
    if (pkg.version >= 2) assert(teachingFeedback && preservedCheckDraft, 'Teaching feedback and separate-check clarification both demonstrated')
  }
  const copy = structuredClone(path)
  copy.turnSequence[0].content = 'Edited session copy'
  assert.notEqual(path.turnSequence[0].content, copy.turnSequence[0].content)
}
for (const example of pkg.fallbackExamples) if (example.legacyCategory) assert.equal(assessGuided(example.input).category, example.legacyCategory)
console.log(`PASS ${filename}: ${steps.size} stable steps, ${ids.size} ordered/provenanced turns, ${assessed} assessments match production rules; references, route changes, contextual conversation, check drafts and copy isolation verified.`)
