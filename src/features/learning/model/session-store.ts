import { create } from 'zustand'
import { focusedOutcome } from '../content/learner-copy'
import { assessAnswer } from './session-assessment'
import { restoreSession, saveSession, clearSession } from './session-storage'
import { scenario } from '../content/session-scenario'
import { type GuidedAssessment, type TransferAssessment } from './assessment'

export type Origin = { origin: 'typed' | 'example' | 'authored'; pathId?: string; seedTurnId?: string; edited?: boolean }
export type Draft = Origin & { text: string }
export type Turn = Origin & { id: number; stepId: string; speaker: 'learner' | 'tutor'; text: string; attemptId?: string }
export type Entry = { id: string; status: 'pending' | 'completed' | 'skipped'; reason?: string }
export type Attempt = Draft & { id: string; stepId: string; at: string; feedback: string; routeReason?: string } & ({ kind: 'guided'; assessment: GuidedAssessment } | { kind: 'transfer'; assessment: TransferAssessment })
export type Session = {
  schemaVersion: 2; id: string; outcome: string; completed: boolean;
  scenarioId: string; scenarioVersion: number; originalTopic: string; confusion: string;
  diagnostic: string; correction: string; interpretation: 'original' | 'energy';
  originalRoute: string[]; routeChanges: { id: string; triggerAttemptId: string; addedStepIds: string[]; skippedStepIds: string[]; reason: string }[]; route: Entry[]; currentStepId: string; drafts: Record<string, Draft>; answerDrafts: Record<string, Draft>;
  turns: Turn[]; attempts: Attempt[]; help: boolean; clarification: string | null; examplePath: string | null; usedSeeds: string[];
}
type Begin = { topic: string; confusion: string; diagnostic: string; correction: string; energy: boolean }
type State = {
  session: Session | null; storage: 'saved' | 'pending' | 'unavailable' | 'invalid' | 'old'; flush: () => void; review: (stepId: string) => void; begin: (input: Begin) => boolean; setDraft: (text: string) => void;
  send: () => void; check: (unresolved?: boolean) => void; help: (enabled: boolean) => void;
  keepWorking: () => void; move: (direction: -1 | 1) => void; reset: () => boolean;
  selectPath: (pathId: string) => void; useExample: (pathId?: string, seedId?: string) => void;
}
export const isCheck = (id: string) => ['guided', 'follow-up', 'transfer', 'retry'].includes(id)
export const activeDraft = (session: Session): Draft | undefined => (isCheck(session.currentStepId) && !session.help ? session.answerDrafts : session.drafts)[session.currentStepId]
export const nextExample = (session: Session) => scenario.examplePaths.find(path => path.pathId === session.examplePath)?.inputs.find(input => input.stepId === session.currentStepId && !session.usedSeeds.includes(input.id))
const initial = ({ topic, confusion, diagnostic, correction, energy }: Begin): Session => {
  const ids = energy ? scenario.plan.supportedCorrection.route : scenario.plan.stepIds
  return { schemaVersion: 2, id: crypto.randomUUID(), outcome: energy ? focusedOutcome : scenario.inferredOutcome, completed: false, scenarioId: scenario.id, scenarioVersion: scenario.version, originalTopic: topic, confusion, diagnostic, correction, interpretation: energy ? 'energy' : 'original', originalRoute: [...ids], routeChanges: [], route: ids.map(id => ({ id, status: 'pending' })), currentStepId: ids[0], drafts: {}, answerDrafts: {}, turns: [], attempts: [], help: false, clarification: null, examplePath: null, usedSeeds: [] }
}
function reply(text: string, id: string): string {
  const normalized = text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 ]/g, '').trim()
  if (/another example|show.*example|give.*example/.test(normalized)) return scenario.steps.find(step => step.id === 'example')!.contentBlocks[0].text
  if (/not sure|unsure|dont understand|do not understand|dont know|confus/.test(normalized)) return isCheck(id) ? 'Let’s take one part at a time: what does light provide, and how does that help sugar building? Your answer is kept. Return to it when ready.' : scenario.fallbackExamples.find(item => item.id === 'teaching-still-unclear')!.response!
  if (/^(does |can |how does |why does |is |why is |what does )?(light|sunlight) (turn into sugar|sounds like food|is food|becomes food|is a material|provide energy|provides energy|help|helps|help plants|help the plant|help.*build sugar|help.*make sugar)[ ?.!]*$/.test(normalized) || /^(light|sunlight) (is |supplies |provides )?(not |isnt )?(food|matter|materials)$/.test(normalized)) return scenario.clarifications[0].answer
  if (/^(what is chlorophyll|how does chlorophyll capture light|what does chlorophyll do)$/.test(normalized)) return 'Chlorophyll captures light. That energy is stored in chemical carriers that support building carbohydrates from carbon dioxide.'
  if (/^(what does light provide|how does light help plants make sugar|how does light help build sugar|what supplies materials|what are the matter inputs)$/.test(normalized)) return 'Light supplies energy that helps the plant build sugar. Water and carbon dioxide supply matter.'
  return 'I don’t have a prepared reply for that message. Try asking how light helps build sugar, whether light becomes food, or for another example.'
}
let pending: ReturnType<typeof setTimeout> | undefined
let debounce = false
export const useSessionStore = create<State>((set, get) => ({
  ...restoreSession(),
  flush: () => { clearTimeout(pending); const state = get(); if (state.storage === 'invalid' || state.storage === 'old') return; set({ storage: saveSession(state.session) ? 'saved' : 'unavailable' }) },
  review: stepId => set(({ session }) => session?.completed && session.route.some(entry => entry.id === stepId && entry.status !== 'skipped') ? { session: { ...session, currentStepId: stepId, help: false, clarification: null } } : {}),
  begin: input => { if (get().storage !== 'unavailable' && !clearSession()) { set({ storage: 'unavailable' }); return false }; set({ session: initial(input), storage: 'pending' }); return true },
  setDraft: text => { debounce = true; set(({ session }) => {
    if (!session) return {}
    const key = isCheck(session.currentStepId) && !session.help ? 'answerDrafts' : 'drafts'
    const old = session[key][session.currentStepId]
    const draft: Draft = { ...(old ?? { origin: 'typed' as const }), text, ...(old?.origin === 'example' ? { edited: true } : {}) }
    return { session: { ...session, [key]: { ...session[key], [session.currentStepId]: draft }, clarification: null } }
  }); debounce = false },
  send: () => set(({ session }) => {
    if (!session) return {}
    const draft = activeDraft(session)
    if (!draft?.text.trim()) return {}
    const turns: Turn[] = [...session.turns, { ...draft, id: session.turns.length + 1, stepId: session.currentStepId, speaker: 'learner', text: draft.text }, { id: session.turns.length + 2, stepId: session.currentStepId, speaker: 'tutor', text: reply(draft.text, session.currentStepId), origin: 'authored' }]
    const preserve = isCheck(session.currentStepId) && !session.help
    return { session: { ...session, turns, usedSeeds: draft.origin === 'example' && draft.seedTurnId && !preserve ? [...new Set([...session.usedSeeds, draft.seedTurnId])] : session.usedSeeds, drafts: preserve ? session.drafts : { ...session.drafts, [session.currentStepId]: { text: '', origin: 'typed' } } } }
  }),
  check: (unresolved = false) => set(({ session }) => {
    if (!session || !isCheck(session.currentStepId) || session.help || session.attempts.some(attempt => attempt.stepId === session.currentStepId)) return {}
    const draft = session.answerDrafts[session.currentStepId]
    if (!draft?.text.trim()) return {}
    const assessment = assessAnswer(draft.text, session.currentStepId)
    if (assessment.uncertain && !unresolved) return { session: { ...session, clarification: session.currentStepId } }
    let feedback = 'category' in assessment && assessment.category === 'sound' ? 'You connected light energy to sugar building.' : 'category' in assessment && assessment.category === 'material' ? 'You described light as food. Light supplies energy; water and carbon dioxide supply matter.' : 'category' in assessment && assessment.category === 'energy' ? 'You named energy. Add how captured light energy supports sugar building.' : 'This answer remains unclear. We’ll keep that uncertainty and offer more help.'
    let reason: string | undefined
    let route = session.route.map(entry => ({ ...entry }))
    if (session.currentStepId === 'guided') {
      if ('category' in assessment && assessment.category === 'sound') {
        const branch = scenario.branches.find(branch => branch.category === 'sound')!
        feedback = branch.feedback; reason = 'Your answer connects light energy with sugar building. The repeated example is skipped.'
        route = route.map(entry => entry.id === 'example' ? { ...entry, status: 'skipped', reason } : entry)
      } else {
        const support = 'category' in assessment && assessment.category === 'energy' ? 'energy-bridge' : 'matter-energy'
        reason = 'category' in assessment && assessment.category === 'energy' ? 'Connect energy to sugar building before another check.' : 'category' in assessment && assessment.category === 'material' ? 'Separate energy from materials before another check.' : 'The answer is still unclear. Review energy and materials, then try a different check.'
        const additions = [support, 'follow-up'].filter(id => !route.some(entry => entry.id === id)).map(id => ({ id, status: 'pending' as const, reason }))
        route.splice(route.findIndex(entry => entry.id === 'guided') + 1, 0, ...additions)
      }
    }
    if ('score' in assessment) {
      feedback = `Prediction: ${assessment.prediction ? 'shown' : 'not yet clear'}. Energy reasoning: ${assessment.reasoning ? 'shown' : 'not yet clear'}. ${assessment.uncertain ? 'Some wording remains unclear.' : ''}`
      if (session.currentStepId === 'transfer' && assessment.score < 2) {
        reason = assessment.prediction ? 'Your prediction is clear. Connect captured light energy to sugar building in a different situation.' : 'Compare the light each plant receives, then connect captured energy to sugar building.'
        if (!route.some(entry => entry.id === 'retry')) route.splice(route.findIndex(entry => entry.id === 'transfer') + 1, 0, { id: 'retry', status: 'pending', reason })
      }
    }
    const attempt = Object.freeze({ ...draft, kind: 'score' in assessment ? 'transfer' : 'guided', at: new Date().toISOString(), id: `${session.currentStepId}-first`, stepId: session.currentStepId, assessment: Object.freeze(assessment), feedback, routeReason: reason }) as Attempt
    const addedStepIds = route.filter(entry => !session.route.some(old => old.id === entry.id)).map(entry => entry.id)
    const skippedStepIds = route.filter(entry => entry.status === 'skipped' && session.route.find(old => old.id === entry.id)?.status !== 'skipped').map(entry => entry.id)
    const change = reason ? { id: `${attempt.id}-route`, triggerAttemptId: attempt.id, addedStepIds, skippedStepIds, reason } : null
    const turns: Turn[] = [...session.turns, { ...draft, id: session.turns.length + 1, stepId: session.currentStepId, speaker: 'learner', attemptId: attempt.id }, { id: session.turns.length + 2, stepId: session.currentStepId, speaker: 'tutor', text: feedback, origin: 'authored', attemptId: attempt.id }]
    return { session: { ...session, route, usedSeeds: draft.seedTurnId ? [...new Set([...session.usedSeeds, draft.seedTurnId])] : session.usedSeeds, routeChanges: change ? [...session.routeChanges, change] : session.routeChanges, turns, attempts: [...session.attempts, attempt], help: true, clarification: null } }
  }),
  help: enabled => set(({ session }) => session ? { session: { ...session, help: enabled } } : {}),
  keepWorking: () => set(({ session }) => session ? { session: { ...session, clarification: null } } : {}),
  move: direction => set(({ session }) => {
    if (!session) return {}
    if (direction === 1 && isCheck(session.currentStepId) && !session.attempts.some(attempt => attempt.stepId === session.currentStepId)) return {}
    const active = session.route.filter(entry => entry.status !== 'skipped')
    const index = active.findIndex(entry => entry.id === session.currentStepId) + direction
    if (index < 0 || index >= active.length) return {}
    return { session: { ...session, route: direction === 1 ? session.route.map(entry => entry.id === session.currentStepId ? { ...entry, status: 'completed' } : entry) : session.route, currentStepId: active[index].id, completed: session.completed || active[index].id === 'recap', help: session.attempts.some(attempt => attempt.stepId === active[index].id), clarification: null } }
  }),
  reset: () => { if (clearSession()) { set({ session: null, storage: 'saved' }); return true }; set({ storage: 'unavailable' }); return false },
  selectPath: pathId => set(({ session }) => session && scenario.examplePaths.some(path => path.pathId === pathId) ? { session: { ...initial({ topic: session.originalTopic, confusion: session.confusion, diagnostic: session.diagnostic, correction: '', energy: false }), examplePath: pathId } } : {}),
  useExample: (pathId, seedId) => set(({ session }) => {
    if (!session) return {}
    const path = scenario.examplePaths.find(path => path.pathId === (pathId ?? session.examplePath))
    const seed = seedId ? path?.inputs.find(input => input.id === seedId && input.stepId === session.currentStepId) : nextExample(session)
    if (!path || !seed || (seed.kind === 'answer' && session.attempts.some(attempt => attempt.stepId === session.currentStepId))) return {}
    const key = isCheck(seed.stepId) && seed.kind === 'answer' ? 'answerDrafts' : 'drafts'
    return { session: { ...session, [key]: { ...session[key], [seed.stepId]: { text: seed.text, origin: 'example', pathId: path.pathId, seedTurnId: seed.id, edited: false } }, help: isCheck(seed.stepId) && seed.kind === 'conversation', usedSeeds: seed.event === 'save-answer-draft' ? [...new Set([...session.usedSeeds, seed.id])] : session.usedSeeds, clarification: null } }
  }),
}))

// Only successful writes can announce a saved session. Drafts wait; transitions do not.
useSessionStore.subscribe((state, previous) => {
  if (state.session === previous.session) return
  clearTimeout(pending)
  if (debounce) {
    if (state.storage !== 'invalid' && state.storage !== 'old') useSessionStore.setState({ storage: 'pending' })
    pending = setTimeout(() => useSessionStore.getState().flush(), 250)
  } else useSessionStore.getState().flush()
})
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => useSessionStore.getState().flush())
  window.addEventListener('beforeunload', () => useSessionStore.getState().flush())
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') useSessionStore.getState().flush() })
}
export function nextAction(session: Session): string {
  if (session.currentStepId === 'recap') return recapAction(session).label
  if (session.clarification) return 'Clarify your answer or continue with help'
  if (session.help && !session.attempts.some(attempt => attempt.stepId === session.currentStepId)) return 'Return to your answer when ready'
  return isCheck(session.currentStepId) ? session.attempts.some(attempt => attempt.stepId === session.currentStepId) ? 'Read your feedback, then continue' : 'Apply the idea and check your answer' : 'Read this step, then continue'
}
export function unresolvedExplanation(session: Session) {
  const latest = [...session.attempts].reverse().find(attempt => attempt.kind === 'guided')
  if (!latest || latest.kind !== 'guided' || latest.assessment.category === 'sound') return null
  const matter = latest.assessment.category === 'material' || (latest.stepId === 'follow-up' && latest.assessment.category === 'unsure')
  const stepId = matter && session.route.some(entry => entry.id === 'matter-energy') ? 'matter-energy' : latest.assessment.category === 'energy' && session.route.some(entry => entry.id === 'energy-bridge') ? 'energy-bridge' : 'core'
  return { attempt: latest, stepId, text: matter ? 'The difference between light energy and materials is still unclear in this answer.' : 'How captured light energy supports sugar building is still unclear in this answer.' }
}
export function recapAction(session: Session): { label: string; stepId?: string } {
  const unresolved = unresolvedExplanation(session)
  if (unresolved) return { label: unresolved.stepId === 'matter-energy' ? 'Review energy and materials' : unresolved.stepId === 'energy-bridge' ? 'Review the energy connection' : 'Review how light helps', stepId: unresolved.stepId }
  const result = [...session.attempts].reverse().find(attempt => attempt.kind === 'transfer')
  return result?.kind === 'transfer' && result.assessment.score === 2 ? { label: 'Read the sources' } : { label: 'Review how light helps', stepId: 'core' }
}
