import { scenario } from '../content/session-scenario'
import { focusedOutcome } from '../content/learner-copy'
import { assessAnswer } from './session-assessment'
import type { Attempt, Draft, Session } from './session-store'

export const SESSION_KEY = 'studyfellow.session.v2'
const OLD_KEY = 'studyfellow.session.v1'
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
const text = (value: unknown): value is string => typeof value === 'string' && value.length <= 5000
const known = (id: unknown): id is string => typeof id === 'string' && scenario.steps.some(step => step.id === id)
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
function origin(value: unknown, stepId: string, authored = false): value is Draft & Record<string, unknown> {
  if (!object(value) || !text(value.text)) return false
  if (value.origin === 'authored') return authored && value.pathId === undefined && value.seedTurnId === undefined && value.edited === undefined
  if (value.origin === 'typed') return value.pathId === undefined && value.seedTurnId === undefined && value.edited === undefined
  if (value.origin !== 'example' || typeof value.edited !== 'boolean') return false
  const seed = scenario.examplePaths.find(path => path.pathId === value.pathId)?.inputs.find(input => input.id === value.seedTurnId && input.stepId === stepId)
  return !!seed && (value.edited || value.text === seed.text)
}
/** The snapshot is an untrusted boundary. Rebuild evidence, then require a reachable route. */
export function validateSession(value: unknown): Session | null {
  if (!object(value) || value.schemaVersion !== 2 || value.scenarioId !== scenario.id || value.scenarioVersion !== scenario.version || !text(value.id) || !value.id || !text(value.originalTopic) || !text(value.confusion) || !text(value.correction) || !scenario.diagnosis.choices.some(choice => choice.id === value.diagnostic) || !['original', 'energy'].includes(value.interpretation as string) || typeof value.completed !== 'boolean' || typeof value.help !== 'boolean' || !known(value.currentStepId)) return null
  const base = value.interpretation === 'energy' ? scenario.plan.supportedCorrection.route : scenario.plan.stepIds
  if (value.outcome !== (value.interpretation === 'energy' ? focusedOutcome : scenario.inferredOutcome) || !same(value.originalRoute, base) || !Array.isArray(value.route) || !Array.isArray(value.routeChanges) || !Array.isArray(value.attempts) || value.attempts.length > 4 || !Array.isArray(value.turns) || value.turns.length > 2000 || !Array.isArray(value.usedSeeds) || value.usedSeeds.length > 30 || new Set(value.usedSeeds).size !== value.usedSeeds.length || (value.examplePath !== null && !scenario.examplePaths.some(path => path.pathId === value.examplePath))) return null
  const seedIds = scenario.examplePaths.find(path => path.pathId === value.examplePath)?.inputs.map(input => input.id) ?? []
  if (!value.usedSeeds.every(id => seedIds.includes(id as string))) return null
  for (const drafts of [value.drafts, value.answerDrafts]) {
    if (!object(drafts) || !Object.entries(drafts).every(([id, draft]) => known(id) && origin(draft, id) && (draft.origin !== 'example' || draft.pathId === value.examplePath))) return null
  }
  const route: Session['route'] = base.map(id => ({ id, status: 'pending' }))
  const changes: Session['routeChanges'] = []
  const attempts: Attempt[] = []
  let lastPosition = -1
  for (const raw of value.attempts) {
    if (!object(raw) || !known(raw.stepId) || !['guided', 'follow-up', 'transfer', 'retry'].includes(raw.stepId) || raw.id !== `${raw.stepId}-first` || !text(raw.at) || !Number.isFinite(Date.parse(raw.at)) || !origin(raw, raw.stepId) || !raw.text.trim() || (raw.origin === 'example' && raw.pathId !== value.examplePath)) return null
    if (attempts.length && Date.parse(raw.at as string) < Date.parse(attempts[attempts.length - 1].at)) return null
    const position = route.findIndex(entry => entry.id === raw.stepId)
    if (position <= lastPosition || position < 0 || (raw.stepId !== 'guided' && !attempts.some(attempt => attempt.stepId === 'guided'))) return null
    const assessment = assessAnswer(raw.text, raw.stepId)
    const kind = 'score' in assessment ? 'transfer' : 'guided'
    if (raw.kind !== kind) return null
    const feedback = 'score' in assessment ? `Prediction: ${assessment.prediction ? 'shown' : 'not yet clear'}. Energy reasoning: ${assessment.reasoning ? 'shown' : 'not yet clear'}. ${assessment.uncertain ? 'Some wording remains unclear.' : ''}` : raw.stepId === 'guided' && assessment.category === 'sound' ? scenario.branches.find(branch => branch.category === 'sound')!.feedback : assessment.category === 'sound' ? 'You connected light energy to sugar building.' : assessment.category === 'material' ? 'You described light as food. Light supplies energy; water and carbon dioxide supply matter.' : assessment.category === 'energy' ? 'You named energy. Add how captured light energy supports sugar building.' : 'This answer remains unclear. We’ll keep that uncertainty and offer more help.'
    if (raw.feedback !== feedback) return null
    const attempt = { ...raw, assessment: Object.freeze(assessment), feedback } as Attempt
    attempts.push(Object.freeze(attempt)); lastPosition = position
    let reason: string | undefined
    let addedStepIds: string[] = [], skippedStepIds: string[] = []
    if (raw.stepId === 'guided' && 'category' in assessment) {
      if (assessment.category === 'sound') {
        reason = 'Your answer connects light energy with sugar building. The repeated example is skipped.'
        skippedStepIds = route.some(entry => entry.id === 'example') ? ['example'] : []
      } else {
        const support = assessment.category === 'energy' ? 'energy-bridge' : 'matter-energy'
        reason = assessment.category === 'energy' ? 'Connect energy to sugar building before another check.' : assessment.category === 'material' ? 'Separate energy from materials before another check.' : 'The answer is still unclear. Review energy and materials, then try a different check.'
        addedStepIds = [support, 'follow-up'].filter(id => !route.some(entry => entry.id === id))
      }
    }
    if (raw.stepId === 'transfer' && 'score' in assessment && assessment.score < 2) {
      reason = assessment.prediction ? 'Your prediction is clear. Connect captured light energy to sugar building in a different situation.' : 'Compare the light each plant receives, then connect captured energy to sugar building.'
      addedStepIds = ['retry']
    }
    if (reason) {
      changes.push({ id: `${raw.id}-route`, triggerAttemptId: raw.id as string, addedStepIds, skippedStepIds, reason })
      route.splice(position + 1, 0, ...addedStepIds.map(id => ({ id, status: 'pending' as const, reason })))
      skippedStepIds.forEach(id => { const entry = route.find(entry => entry.id === id)!; entry.status = 'skipped'; entry.reason = reason })
    }
    if (raw.routeReason !== reason) return null
  }
  if (!same(value.routeChanges, changes) || route.length !== value.route.length) return null
  let pendingSeen = false
  for (let i = 0; i < route.length; i++) {
    const stored = value.route[i]
    if (!object(stored) || stored.id !== route[i].id || stored.reason !== route[i].reason || !['pending', 'completed', 'skipped'].includes(stored.status as string) || (stored.status === 'skipped') !== (route[i].status === 'skipped')) return null
    if (stored.status === 'skipped') continue
    if (stored.status === 'pending') pendingSeen = true
    if (stored.status === 'completed' && (pendingSeen || (['guided', 'follow-up', 'transfer', 'retry'].includes(route[i].id) && !attempts.some(attempt => attempt.stepId === route[i].id)))) return null
    route[i].status = stored.status as 'pending' | 'completed'
  }
  const active = route.filter(entry => entry.status !== 'skipped')
  const current = active.findIndex(entry => entry.id === value.currentStepId)
  const frontier = active.findIndex(entry => entry.status === 'pending')
  if (attempts.some(attempt => active.findIndex(entry => entry.id === attempt.stepId) > frontier)) return null
  if (current < 0 || current > (frontier < 0 ? active.length - 1 : frontier)) return null
  const transfer = attempts.find(attempt => attempt.stepId === 'transfer')
  const canFinish = transfer?.kind === 'transfer' && (transfer.assessment.score === 2 || attempts.some(attempt => attempt.stepId === 'retry'))
  if ((value.currentStepId === 'recap' || value.completed) && !canFinish) return null
  if (value.completed !== (active.slice(0, -1).every(entry => entry.status === 'completed'))) return null
  if (value.clarification !== null && (value.clarification !== value.currentStepId || !['guided', 'follow-up', 'transfer', 'retry'].includes(value.currentStepId) || attempts.some(attempt => attempt.stepId === value.currentStepId) || !object(value.answerDrafts) || !object(value.answerDrafts[value.currentStepId]) || !assessAnswer((value.answerDrafts[value.currentStepId] as Record<string, unknown>).text as string, value.currentStepId).uncertain)) return null
  const turns: Session['turns'] = []
  const attemptOrder: string[] = []
  const linked = new Map<string, number>()
  for (const [index, raw] of value.turns.entries()) {
    if (!object(raw) || raw.id !== index + 1 || !known(raw.stepId) || !route.some(entry => entry.id === raw.stepId) || !['learner', 'tutor'].includes(raw.speaker as string) || !origin(raw, raw.stepId, raw.speaker === 'tutor') || (raw.speaker === 'tutor') !== (raw.origin === 'authored') || (raw.origin === 'example' && raw.pathId !== value.examplePath)) return null
    if (raw.attemptId !== undefined) {
      const attempt = attempts.find(attempt => attempt.id === raw.attemptId && attempt.stepId === raw.stepId)
      if (!attempt || (raw.speaker === 'learner' && (!same({ text: raw.text, origin: raw.origin, pathId: raw.pathId, seedTurnId: raw.seedTurnId, edited: raw.edited }, { text: attempt.text, origin: attempt.origin, pathId: attempt.pathId, seedTurnId: attempt.seedTurnId, edited: attempt.edited }))) || (raw.speaker === 'tutor' && raw.text !== attempt.feedback)) return null
      if (raw.speaker === 'learner') attemptOrder.push(attempt.id)
      linked.set(attempt.id, (linked.get(attempt.id) ?? 0) + 1)
    }
    if (index % 2 === 0 && raw.speaker !== 'learner' || index % 2 === 1 && (raw.speaker !== 'tutor' || raw.stepId !== turns[index - 1]?.stepId || raw.attemptId !== turns[index - 1]?.attemptId)) return null
    turns.push(raw as Session['turns'][number])
  }
  if (!same(attemptOrder, attempts.map(attempt => attempt.id))) return null
  if (turns.length % 2 || attempts.some(attempt => linked.get(attempt.id) !== 2)) return null
  return { ...value, route, routeChanges: changes, attempts, turns } as Session
}
export function restoreSession(): { session: Session | null; storage: 'saved' | 'unavailable' | 'invalid' | 'old' } {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return { session: null, storage: localStorage.getItem(OLD_KEY) ? 'old' : 'saved' }
    const session = validateSession(JSON.parse(raw))
    return { session, storage: session ? 'saved' : 'invalid' }
  } catch (error) { return { session: null, storage: error instanceof SyntaxError ? 'invalid' : 'unavailable' } }
}
export function saveSession(session: Session | null): boolean {
  try { if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session)); else localStorage.removeItem(SESSION_KEY); return true } catch { return false }
}
export function clearSession(): boolean {
  let old: string | null = null, current: string | null = null
  try { old = localStorage.getItem(OLD_KEY); current = localStorage.getItem(SESSION_KEY); if (old !== null) localStorage.removeItem(OLD_KEY); if (current !== null) localStorage.removeItem(SESSION_KEY); return true } catch {
    try { if (old !== null) localStorage.setItem(OLD_KEY, old); if (current !== null) localStorage.setItem(SESSION_KEY, current) } catch { /* Storage remains unavailable; never report reset success. */ }
    return false
  }
}
