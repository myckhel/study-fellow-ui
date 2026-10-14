import { create } from 'zustand'
import { photosynthesis } from '../content/photosynthesis'
import {
  assessGuided,
  assessTransfer,
  type GuidedAssessment,
  type TransferAssessment,
} from './assessment'

export const STORAGE_KEY = 'studyfellow.session.v1'
export const stages = [
  'setup',
  'diagnostic',
  'explanation',
  'guided',
  'feedback',
  'practice',
  'transfer',
  'retry',
  'recap',
] as const
export type Stage = (typeof stages)[number]
export type AnswerStage = 'guided' | 'practice' | 'transfer' | 'retry'
export type Diagnostic = 'matter' | 'light' | 'unsure' | 'skipped' | null
export type Draft = { text: string; demo: boolean }
export type Attempt = {
  stage: AnswerStage
  text: string
  demo: boolean
  assessment: GuidedAssessment | TransferAssessment
  at: string
}
export type Session = {
  version: 1
  contentVersion: number
  id: string
  stage: Stage
  completed: boolean
  setup: {
    tab: 'topic' | 'resource' | 'sample'
    topic: string
    filename: string
    sample: boolean
    customGoal: string
    minutes: 3 | 5
  }
  goal: string
  diagnostic: Diagnostic
  drafts: Record<AnswerStage, Draft>
  attempts: Attempt[]
  nextAction: string
}
export const stageLabels: Record<Stage, string> = {
  setup: 'Choose your session',
  diagnostic: 'Optional recall',
  explanation: 'Understand the idea',
  guided: 'Your explanation',
  feedback: 'Responsive feedback',
  practice: 'Optional practice',
  transfer: 'Fresh transfer check',
  retry: 'Targeted retry',
  recap: 'Your recap',
}
export const nextActions: Record<Stage, string> = {
  setup: 'Choose the sample, goal and time',
  diagnostic: 'Try or skip the optional recall',
  explanation: 'Read how light supports sugar building',
  guided: 'Explain the role of light',
  feedback: 'Read feedback on your explanation',
  practice: 'Try or skip the extra practice',
  transfer: 'Apply the idea to two plants',
  retry: 'Try a different transfer situation',
  recap: 'Review your results and next step',
}
function newSession(): Session {
  return {
    version: 1,
    contentVersion: photosynthesis.version,
    id: new Date().toISOString(),
    stage: 'setup',
    completed: false,
    setup: {
      tab: 'topic',
      topic: '',
      filename: '',
      sample: false,
      customGoal: '',
      minutes: 3,
    },
    goal: photosynthesis.goal,
    diagnostic: null,
    drafts: {
      guided: { text: '', demo: false },
      practice: { text: '', demo: false },
      transfer: { text: '', demo: false },
      retry: { text: '', demo: false },
    },
    attempts: [],
    nextAction: nextActions.setup,
  }
}
const answerStages: AnswerStage[] = ['guided', 'practice', 'transfer', 'retry']
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const isText = (value: unknown): value is string =>
  typeof value === 'string' && value.length <= 5000
/** Validate the entire persisted boundary; scores are recomputed rather than trusted. */
export function validateSession(value: unknown): Session | null {
  if (
    !isObject(value) ||
    value.version !== 1 ||
    value.contentVersion !== photosynthesis.version ||
    !isText(value.id) ||
    !stages.includes(value.stage as Stage) ||
    typeof value.completed !== 'boolean' ||
    !isText(value.goal)
  )
    return null
  const setup = value.setup
  if (
    !isObject(setup) ||
    !['topic', 'resource', 'sample'].includes(setup.tab as string) ||
    !isText(setup.topic) ||
    !isText(setup.filename) ||
    !isText(setup.customGoal) ||
    typeof setup.sample !== 'boolean' ||
    ![3, 5].includes(setup.minutes as number)
  )
    return null
  if (
    ![null, 'matter', 'light', 'unsure', 'skipped'].includes(
      value.diagnostic as Diagnostic,
    ) ||
    !isObject(value.drafts) ||
    !Array.isArray(value.attempts) ||
    value.attempts.length > 4
  )
    return null
  const drafts = {} as Session['drafts']
  for (const key of answerStages) {
    const draft = value.drafts[key]
    if (
      !isObject(draft) ||
      !isText(draft.text) ||
      typeof draft.demo !== 'boolean'
    )
      return null
    drafts[key] = { text: draft.text, demo: draft.demo }
  }
  const attempts: Attempt[] = []
  for (const item of value.attempts) {
    if (
      !isObject(item) ||
      !answerStages.includes(item.stage as AnswerStage) ||
      !isText(item.text) ||
      !item.text.trim() ||
      typeof item.demo !== 'boolean' ||
      !isText(item.at) ||
      attempts.some((a) => a.stage === item.stage)
    )
      return null
    const stage = item.stage as AnswerStage
    attempts.push({
      stage,
      text: item.text,
      demo: item.demo,
      at: item.at,
      assessment:
        stage === 'transfer' || stage === 'retry'
          ? assessTransfer(item.text, stage === 'retry')
          : assessGuided(item.text),
    })
  }
  if (
    attempts.some(
      (a, i) =>
        i > 0 &&
        answerStages.indexOf(a.stage) <=
          answerStages.indexOf(attempts[i - 1].stage),
    )
  )
    return null
  if (
    attempts.length &&
    (attempts[0].stage !== 'guided' ||
      value.diagnostic === null ||
      !setup.sample)
  )
    return null
  if (attempts.some((a) => a.stage === 'practice') && setup.minutes !== 5)
    return null
  const stage = value.stage as Stage
  if (
    stage === 'setup' &&
    (attempts.length || value.diagnostic !== null || value.completed)
  )
    return null
  if (stage === 'practice' && setup.minutes !== 5) return null
  if (stage === 'recap' && !value.completed) return null
  if (
    stage !== 'setup' &&
    value.goal !== (setup.customGoal.trim() || photosynthesis.goal)
  )
    return null
  if (stage !== 'setup' && !setup.sample) return null
  if (stage !== 'setup' && stage !== 'diagnostic' && value.diagnostic === null)
    return null
  const guided = attempts.find((a) => a.stage === 'guided')
  const transfer = attempts.find((a) => a.stage === 'transfer')
  if (
    ['feedback', 'practice', 'transfer', 'retry', 'recap'].includes(stage) &&
    !guided
  )
    return null
  if (['retry', 'recap'].includes(stage) && !transfer) return null
  if (
    attempts.some((a) => a.stage === 'retry') &&
    (!transfer || (transfer.assessment as TransferAssessment).score === 2)
  )
    return null
  if (
    stage === 'retry' &&
    (transfer!.assessment as TransferAssessment).score === 2
  )
    return null
  if (
    stage === 'recap' &&
    (transfer!.assessment as TransferAssessment).score < 2 &&
    !attempts.some((a) => a.stage === 'retry')
  )
    return null
  if (
    value.completed &&
    (!transfer ||
      ((transfer.assessment as TransferAssessment).score < 2 &&
        !attempts.some((a) => a.stage === 'retry')))
  )
    return null
  return {
    version: 1,
    contentVersion: photosynthesis.version,
    id: value.id,
    stage,
    completed: value.completed,
    setup: setup as Session['setup'],
    goal: value.goal,
    diagnostic: value.diagnostic as Diagnostic,
    drafts,
    attempts,
    nextAction: nextActions[stage],
  }
}
type StorageStatus = 'ready' | 'unavailable' | 'invalid'
function restore(): { session: Session | null; storage: StorageStatus } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { session: null, storage: 'ready' }
    const session = validateSession(JSON.parse(raw))
    return { session, storage: session ? 'ready' : 'invalid' }
  } catch (error) {
    return {
      session: null,
      storage: error instanceof SyntaxError ? 'invalid' : 'unavailable',
    }
  }
}
type StudyState = {
  session: Session | null
  storage: StorageStatus
  ensureSetup: () => void
  configure: (patch: Partial<Session['setup']>) => void
  start: () => void
  diagnose: (answer: Exclude<Diagnostic, null>) => void
  go: (stage: Stage) => void
  draft: (stage: AnswerStage, text: string, demo?: boolean) => void
  submit: (stage: AnswerStage) => void
  reset: () => void
  flush: () => void
}
let pending: ReturnType<typeof setTimeout> | undefined
export const useStudyStore = create<StudyState>((set, get) => {
  const flush = () => {
    clearTimeout(pending)
    if (get().storage === 'invalid') return
    try {
      if (get().session)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(get().session))
      else localStorage.removeItem(STORAGE_KEY)
      if (get().storage !== 'ready') set({ storage: 'ready' })
    } catch {
      set({ storage: 'unavailable' })
    }
  }
  const update = (change: (session: Session) => Session, immediate = true) => {
    if (!get().session) return
    set({ session: change(get().session!) })
    if (immediate) flush()
    else {
      clearTimeout(pending)
      pending = setTimeout(flush, 250)
    }
  }
  const go = (stage: Stage) =>
    update((session) => ({
      ...session,
      stage,
      nextAction: nextActions[stage],
      completed: session.completed || stage === 'recap',
    }))
  return {
    ...restore(),
    flush,
    ensureSetup: () => {
      if (!get().session && get().storage !== 'invalid') {
        set({ session: newSession() })
        flush()
      }
    },
    configure: (patch) =>
      update(
        (session) => ({ ...session, setup: { ...session.setup, ...patch } }),
        false,
      ),
    start: () => {
      if (get().session?.setup.sample)
        update((session) => ({
          ...session,
          goal: session.setup.customGoal.trim() || photosynthesis.goal,
          stage: 'diagnostic',
          nextAction: nextActions.diagnostic,
        }))
    },
    diagnose: (answer) => {
      update((session) => ({
        ...session,
        diagnostic: session.diagnostic ?? answer,
      }))
      go('explanation')
    },
    go,
    draft: (stage, text, demo = false) =>
      update(
        (session) => ({
          ...session,
          drafts: {
            ...session.drafts,
            [stage]: { text, demo: demo || session.drafts[stage].demo },
          },
        }),
        false,
      ),
    submit: (stage) => {
      const session = get().session
      if (!session || !session.drafts[stage].text.trim()) return
      if (!session.attempts.some((a) => a.stage === stage)) {
        const { text, demo } = session.drafts[stage]
        update((current) => ({
          ...current,
          attempts: [
            ...current.attempts,
            {
              stage,
              text,
              demo,
              at: new Date().toISOString(),
              assessment:
                stage === 'transfer' || stage === 'retry'
                  ? assessTransfer(text, stage === 'retry')
                  : assessGuided(text),
            },
          ].sort(
            (a, b) =>
              answerStages.indexOf(a.stage) - answerStages.indexOf(b.stage),
          ),
        }))
      }
      if (stage === 'guided') go('feedback')
      else if (stage === 'transfer') {
        const result = get().session!.attempts.find(
          (a) => a.stage === 'transfer',
        )!.assessment as TransferAssessment
        go(result.score === 2 ? 'recap' : 'retry')
      } else if (stage === 'retry') go('recap')
      else if (session.attempts.some((a) => a.stage === 'practice'))
        go('transfer')
    },
    reset: () => {
      set({ session: null, storage: 'ready' })
      flush()
    },
  }
})
// Flush pending drafts before any router navigation and browser interruption.
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => useStudyStore.getState().flush())
  window.addEventListener('beforeunload', () =>
    useStudyStore.getState().flush(),
  )
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') useStudyStore.getState().flush()
  })
}
