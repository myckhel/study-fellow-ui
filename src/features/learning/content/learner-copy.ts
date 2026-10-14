import type { GuidedCategory } from '../model/assessment'
import type { Stage } from '../model/study-store'
import { photosynthesis } from './photosynthesis'

// Presentation only: keep stored assessment results and session versions unchanged.
export const lessonTitles: Record<Stage, string> = {
  setup: 'Start a lesson', diagnostic: 'One quick question', explanation: 'Understand the idea',
  guided: 'Your explanation', feedback: 'Let’s look at your answer', practice: 'Extra practice',
  transfer: 'Try a new situation', retry: 'Try another situation', recap: 'Your summary',
}
export function feedbackCopy(category: GuidedCategory) {
  return category === 'unsure'
    ? 'I’m not sure what your answer means yet. Try naming what light provides and how it helps build sugar. You can also keep practising.'
    : photosynthesis.feedback[category]
}
export function evidenceCopy(text: string) {
  const labels: Record<string, string> = {
    'Meaning is uncertain or contradictory; clarification is needed.': 'Some parts of your answer are unclear. Let’s look again.',
    'No clear energy-to-sugar connection recognized by demo rules.': 'I couldn’t find a clear link between light energy and sugar building in this answer.',
    'Answer describes light as food or matter.': 'Your answer describes light as food or matter.',
    'Answer connects light energy with building sugar.': 'Your answer connects light energy with building sugar.',
    'Energy is named; its role in sugar building is not yet clear.': 'You named energy. How does it help build sugar?',
    'Recognized the higher production rate in brighter light.': 'You identified which plant makes sugar faster.',
    'Connected available light energy to sugar building.': 'You connected light energy to sugar building.',
  }
  return labels[text] ?? text
}
export const focusedOutcome = 'Understand energy and materials in photosynthesis'

export function nextStepCopy(stage: Stage, original: string) {
  const labels: Partial<Record<Stage, string>> = {
    setup: 'Choose photosynthesis and a time', diagnostic: 'Answer or skip the question',
    retry: 'Try another situation', recap: 'Review your answers and next step',
  }
  return labels[stage] ?? original
}
