import { readFileSync, writeFileSync } from 'node:fs'
const source = JSON.parse(readFileSync(new URL('../plans/phase-0/photosynthesis.v2.json', import.meta.url), 'utf8'))
const fields = ['id', 'version', 'title', 'sourceMaterials', 'initialLearnerInput', 'diagnosis', 'inferredOutcome', 'plan', 'steps', 'assets', 'teachingNotes', 'review', 'clarifications', 'fallbackExamples']
const projection = Object.fromEntries(fields.map(key => [key, source[key]]))
projection.examplePaths = source.simulationPaths.map(path => ({
  pathId: path.pathId,
  inputs: path.turnSequence.filter(turn => turn.speaker === 'learner' && ['ask-clarification', 'save-answer-draft', 'submit-answer'].includes(turn.event) && ['core', 'guided', 'follow-up', 'transfer'].includes(turn.stepId)).map(turn => ({ id: turn.id, stepId: turn.stepId, text: turn.content, event: turn.event, kind: turn.event === 'ask-clarification' ? 'conversation' : 'answer' })),
}))
projection.branches = source.simulationPaths.flatMap(path => path.turnSequence.filter(turn => turn.event === 'assess-answer' && turn.stepId === 'guided').map(turn => ({ category: turn.assessment.legacyCategory, feedback: turn.content, change: turn.routeChange }))).filter((branch, index, branches) => branches.findIndex(item => item.category === branch.category) === index)
const output = JSON.stringify(projection, null, 2) + '\n'
const target = new URL('../src/features/learning/content/phase1-scenario.json', import.meta.url)
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== output) throw new Error('Phase 1 scenario projection is stale. Run bun scripts/derive-phase1-scenario.mjs')
} else writeFileSync(target, output)
