import type { Attempt, Session } from '../model/session-store'
import { unresolvedExplanation } from '../model/session-store'

export type FeedbackPresentation = { title: string; text: string; tone: 'success' | 'neutral' }

/** A display-only view: persisted feedback and assessment remain unchanged. */
export function presentFeedback(attempt: Attempt): FeedbackPresentation {
  const example = attempt.origin === 'example'
  if (attempt.assessment.uncertain) return { title: 'Let’s make that clearer', text: example ? 'This example answer needs a clearer explanation before we can check it.' : 'We need a clearer explanation before we can check this answer.', tone: 'neutral' }
  if (attempt.kind === 'guided') {
    if (attempt.assessment.category === 'sound') return { title: 'Step complete', text: example ? 'This example answer explains how light energy helps the plant make sugar.' : 'You explained how light energy helps the plant make sugar.', tone: 'success' }
    if (attempt.assessment.category === 'energy') return { title: 'One part is clear', text: example ? 'This example answer names energy. Add how that energy helps the plant make sugar.' : 'You named energy. Add how that energy helps the plant make sugar.', tone: 'neutral' }
    return { title: 'Let’s work through this', text: 'Light supplies energy. Water and carbon dioxide supply materials. Try connecting light energy to making sugar.', tone: 'neutral' }
  }
  const { prediction, reasoning, score } = attempt.assessment
  const plant = attempt.stepId === 'retry' ? 'seedling' : 'plant'
  if (score === 2) return { title: 'Check complete', text: example ? `This example answer chooses the right ${plant} and explains how light helps it make sugar.` : `You chose the right ${plant} and explained how light helps it make sugar.`, tone: 'success' }
  if (prediction || reasoning) return { title: 'One part is clear', text: prediction ? (example ? 'This example answer chooses the right plant. Add how less light energy affects sugar making.' : 'You chose the right plant. Add how less light energy affects sugar making.') : (example ? 'This example answer connects light energy to making sugar. Add which plant makes sugar faster.' : 'You connected light energy to making sugar. Add which plant makes sugar faster.'), tone: 'neutral' }
  return { title: 'Let’s work through this', text: 'Choose which plant makes sugar faster, then explain how the light it receives helps it make sugar.', tone: 'neutral' }
}

export function presentCriterion(attempt: Extract<Attempt, { kind: 'transfer' }>, criterion: 'prediction' | 'reasoning') {
  const clear = attempt.assessment[criterion]
  const plant = attempt.stepId === 'retry' ? 'seedling' : 'plant'
  return {
    label: criterion === 'prediction' ? 'Which plant makes sugar faster' : 'How light energy helps',
    value: clear ? 'Clear' : 'Needs another look',
    text: criterion === 'prediction'
      ? clear ? `The brighter ${plant} makes sugar faster in this situation.` : `Name which ${plant} makes sugar faster in this situation.`
      : clear ? 'Less light means less captured energy to help make sugar.' : 'Explain how less captured light energy affects sugar making.',
  }
}

export function presentCompletion(session: Session): FeedbackPresentation {
  const latest = [...session.attempts].reverse().find(attempt => attempt.kind === 'transfer')
  const soundComparison = latest?.kind === 'transfer' && latest.assessment.score === 2 && !latest.assessment.uncertain
  if (soundComparison && !unresolvedExplanation(session)) return { title: 'Session complete', text: 'The final answer explains which plant makes sugar faster and how light energy helps.', tone: 'success' }
  if (soundComparison) return { title: 'Session finished', text: 'The final plant comparison is complete. One earlier explanation still needs attention.', tone: 'neutral' }
  return { title: 'Session finished', text: 'You reached the end of this session. Take another look at the parts that are still unclear.', tone: 'neutral' }
}
