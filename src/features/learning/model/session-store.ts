import { create } from 'zustand'
import { scenario } from '../content/session-scenario'

type Turn = { id: number; stepId: string; speaker: 'learner' | 'tutor'; text: string; origin: 'typed' | 'authored' }
type Session = {
  scenarioId: string; scenarioVersion: number; originalTopic: string; confusion: string;
  diagnostic: string; correction: string; interpretation: 'original' | 'energy';
  route: string[]; currentStepId: string; drafts: Record<string, string>; turns: Turn[];
}
type State = {
  session: Session | null;
  begin: (input: { topic: string; confusion: string; diagnostic: string; correction: string; energy: boolean }) => void;
  setDraft: (text: string) => void; send: () => void; move: (direction: -1 | 1) => void; reset: () => void;
}
export const useSessionStore = create<State>((set) => ({
  session: null,
  begin: ({ topic, confusion, diagnostic, correction, energy }) => set({ session: {
    scenarioId: scenario.id, scenarioVersion: scenario.version,
    originalTopic: topic, confusion, diagnostic, correction,
    interpretation: energy ? 'energy' : 'original',
    route: [...(energy ? scenario.plan.supportedCorrection.route : scenario.plan.stepIds)],
    currentStepId: energy ? scenario.plan.supportedCorrection.route[0] : scenario.plan.stepIds[0],
    drafts: {}, turns: [],
  } }),
  setDraft: (text) => set(({ session }) => session ? { session: { ...session, drafts: { ...session.drafts, [session.currentStepId]: text } } } : {}),
  send: () => set(({ session }) => {
    if (!session) return {}
    const text = session.drafts[session.currentStepId]?.trim()
    if (!text) return {}
    const acknowledgment = 'Your message is here. I can’t reply to questions or check answers yet. You can keep reading.'
    return { session: { ...session, drafts: { ...session.drafts, [session.currentStepId]: '' }, turns: [
      ...session.turns,
      { id: session.turns.length + 1, stepId: session.currentStepId, speaker: 'learner', text, origin: 'typed' },
      { id: session.turns.length + 2, stepId: session.currentStepId, speaker: 'tutor', text: acknowledgment, origin: 'authored' },
    ] } }
  }),
  move: (direction) => set(({ session }) => {
    if (!session) return {}
    const index = session.route.indexOf(session.currentStepId) + direction
    return index >= 0 && index < session.route.length ? { session: { ...session, currentStepId: session.route[index] } } : {}
  }),
  reset: () => set({ session: null }),
}))
