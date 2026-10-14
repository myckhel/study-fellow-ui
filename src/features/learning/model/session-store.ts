import { create } from 'zustand'
import { scenario } from '../content/session-scenario'
import { assessGuided, type GuidedAssessment } from './assessment'

export type Origin = { origin: 'typed' | 'example' | 'authored'; pathId?: string; seedTurnId?: string; edited?: boolean }
type Draft = Origin & { text: string }
type Turn = Origin & { id: number; stepId: string; speaker: 'learner' | 'tutor'; text: string; attemptId?: string }
type Entry = { id: string; status: 'pending' | 'completed' | 'skipped'; reason?: string }
type Attempt = Draft & { id: string; stepId: string; assessment: GuidedAssessment; feedback: string; routeReason?: string }
type Session = {
  scenarioId: string; scenarioVersion: number; originalTopic: string; confusion: string;
  diagnostic: string; correction: string; interpretation: 'original' | 'energy';
  originalRoute: string[]; routeChanges: { id: string; triggerAttemptId: string; addedStepIds: string[]; skippedStepIds: string[]; reason: string }[]; route: Entry[]; currentStepId: string; drafts: Record<string, Draft>; answerDrafts: Record<string, Draft>;
  turns: Turn[]; attempts: Attempt[]; help: boolean; clarification: string | null; examplePath: string | null; usedSeeds: string[];
}
type Begin = { topic: string; confusion: string; diagnostic: string; correction: string; energy: boolean }
type State = {
  session: Session | null; begin: (input: Begin) => void; setDraft: (text: string) => void;
  send: () => void; check: (unresolved?: boolean) => void; help: (enabled: boolean) => void;
  keepWorking: () => void; move: (direction: -1 | 1) => void; reset: () => void;
  selectPath: (pathId: string) => void; useExample: () => void;
}
const isCheck = (id: string) => id === 'guided' || id === 'follow-up'
export const activeDraft = (session: Session): Draft | undefined => (isCheck(session.currentStepId) && !session.help ? session.answerDrafts : session.drafts)[session.currentStepId]
export const nextExample = (session: Session) => scenario.examplePaths.find(path => path.pathId === session.examplePath)?.inputs.find(input => input.stepId === session.currentStepId && !session.usedSeeds.includes(input.id))
const initial = ({ topic, confusion, diagnostic, correction, energy }: Begin): Session => {
  const ids = energy ? scenario.plan.supportedCorrection.route : scenario.plan.stepIds
  return { scenarioId: scenario.id, scenarioVersion: scenario.version, originalTopic: topic, confusion, diagnostic, correction, interpretation: energy ? 'energy' : 'original', originalRoute: [...ids], routeChanges: [], route: ids.map(id => ({ id, status: 'pending' })), currentStepId: ids[0], drafts: {}, answerDrafts: {}, turns: [], attempts: [], help: false, clarification: null, examplePath: null, usedSeeds: [] }
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
export const useSessionStore = create<State>((set) => ({
  session: null,
  begin: input => set({ session: initial(input) }),
  setDraft: text => set(({ session }) => {
    if (!session) return {}
    const key = isCheck(session.currentStepId) && !session.help ? 'answerDrafts' : 'drafts'
    const old = session[key][session.currentStepId]
    const draft: Draft = { ...(old ?? { origin: 'typed' as const }), text, ...(old?.origin === 'example' ? { edited: true } : {}) }
    return { session: { ...session, [key]: { ...session[key], [session.currentStepId]: draft }, clarification: null } }
  }),
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
    const quotedClaim = /(?:a learner (?:says|said)|they (?:say|said)|the statement (?:says|is))[^.!?]*[“"].+?[”"]/i
    const assessedText = session.currentStepId === 'follow-up' && quotedClaim.test(draft.text) ? draft.text.replace(quotedClaim, '') : draft.text
    let assessment = assessGuided(assessedText)
    const matterText = assessedText.toLowerCase().replace(/[’']/g, "'")
    const positiveMatter = /water (?:and |\+ )carbon dioxide (?:are |provide |supply |are both |supply the |provide the )(?:matter|materials|material inputs|matter inputs)|(?:matter|materials|matter inputs|material inputs) (?:are |come from |include )water and carbon dioxide/.test(matterText)
    const deniedMatter = /not true|not correct|false/.test(matterText) || /(?:water|carbon dioxide).{0,50}(?:not |never |aren't|isn't|don't|doesn't|cannot|can't).{0,35}(?:matter|material|provide|supply)|(?:matter|materials).{0,35}(?:not|isn't|aren't).{0,35}(?:water|carbon dioxide)|(?:water|carbon dioxide).{0,25}(?:are|is|provide|supply) (?:only )?energy|(?:not true|not correct|false).{0,35}water|(?:light|sunlight) (?:supplies|provides|is) (?:the )?(?:matter|materials)/.test(matterText)
    if (session.currentStepId === 'follow-up' && assessment.category === 'sound' && (!positiveMatter || deniedMatter)) {
      assessment = { category: 'unsure', uncertain: true, evidence: 'The energy-to-sugar connection is present, but the matter-input distinction remains unclear.' }
    }
    if (assessment.uncertain && !unresolved) return { session: { ...session, clarification: session.currentStepId } }
    let feedback = assessment.category === 'sound' ? 'You connected light energy to sugar building.' : assessment.category === 'material' ? 'You described light as food. Light supplies energy; water and carbon dioxide supply matter.' : assessment.category === 'energy' ? 'You named energy. Add how captured light energy supports sugar building.' : 'This answer remains unclear. We’ll keep that uncertainty and offer more help.'
    let reason: string | undefined
    let route = session.route.map(entry => ({ ...entry }))
    if (session.currentStepId === 'guided') {
      if (assessment.category === 'sound') {
        const branch = scenario.branches.find(branch => branch.category === 'sound')!
        feedback = branch.feedback; reason = 'Your answer connects light energy with sugar building. The repeated example is skipped.'
        route = route.map(entry => entry.id === 'example' ? { ...entry, status: 'skipped', reason } : entry)
      } else {
        const support = assessment.category === 'energy' ? 'energy-bridge' : 'matter-energy'
        reason = assessment.category === 'energy' ? 'Connect energy to sugar building before another check.' : assessment.category === 'material' ? 'Separate energy from materials before another check.' : 'The answer is still unclear. Review energy and materials, then try a different check.'
        const additions = [support, 'follow-up'].filter(id => !route.some(entry => entry.id === id)).map(id => ({ id, status: 'pending' as const, reason }))
        route.splice(route.findIndex(entry => entry.id === 'guided') + 1, 0, ...additions)
      }
    }
    const attempt: Attempt = Object.freeze({ ...draft, id: `${session.currentStepId}-first`, stepId: session.currentStepId, assessment: Object.freeze(assessment), feedback, routeReason: reason })
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
    return { session: { ...session, route: direction === 1 ? session.route.map(entry => entry.id === session.currentStepId ? { ...entry, status: 'completed' } : entry) : session.route, currentStepId: active[index].id, help: session.attempts.some(attempt => attempt.stepId === active[index].id), clarification: null } }
  }),
  reset: () => set({ session: null }),
  selectPath: pathId => set(({ session }) => session && scenario.examplePaths.some(path => path.pathId === pathId) ? { session: { ...initial({ topic: session.originalTopic, confusion: session.confusion, diagnostic: session.diagnostic, correction: '', energy: false }), examplePath: pathId } } : {}),
  useExample: () => set(({ session }) => {
    if (!session) return {}
    const seed = nextExample(session)
    if (!seed || session.attempts.some(attempt => attempt.stepId === session.currentStepId)) return {}
    const key = isCheck(seed.stepId) && seed.kind === 'answer' ? 'answerDrafts' : 'drafts'
    return { session: { ...session, [key]: { ...session[key], [seed.stepId]: { text: seed.text, origin: 'example', pathId: session.examplePath!, seedTurnId: seed.id, edited: false } }, help: isCheck(seed.stepId) && seed.kind === 'conversation', usedSeeds: seed.event === 'save-answer-draft' ? [...session.usedSeeds, seed.id] : session.usedSeeds, clarification: null } }
  }),
}))
