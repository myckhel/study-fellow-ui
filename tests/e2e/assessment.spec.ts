import { expect, test } from '@playwright/test'
import {
  assessGuided,
  assessTransfer,
} from '../../src/features/learning/model/assessment'
import { validateSession } from '../../src/features/learning/model/study-store'

test('guided rules distinguish reasoning conservatively', () => {
  for (const text of [
    'Light provides energy to build sugar.',
    'Light is not food; it provides energy to build sugar.',
  ])
    expect(assessGuided(text).category, text).toBe('sound')
  expect(assessGuided('Light is food.').category).toBe('material')
  expect(assessGuided('Light provides energy.').category).toBe('energy')
  for (const text of [
    'Light is not energy.',
    'Light energy cannot help build sugar.',
    'Light is food and energy.',
    'Light has energy but plants do not use it to build sugar.',
    'Light energy prevents plants from making sugar.',
    'The plant has energy to build sugar but light is irrelevant.',
    'banana',
    "I'm not sure",
  ])
    expect(assessGuided(text).uncertain, text).toBe(true)
})
test('fresh transfer preserves individual criteria and uncertain evidence', () => {
  const correct =
    'Plant A makes sugar faster because Plant B has less captured light energy to help build sugar.'
  expect(assessTransfer(correct).score).toBe(2)
  expect(assessTransfer('Plant A because energy').score).toBe(1)
  expect(
    assessTransfer(
      'Dimmer light gives less captured energy for sugar building.',
    ).score,
  ).toBe(1)
  expect(
    assessTransfer('Plant A makes sugar faster but light is food.').score,
  ).toBe(1)
  for (const text of [
    'Plant B makes more sugar because it has less light energy.',
    'Plant A does not make sugar faster.',
    'Plant A and Plant B make sugar faster.',
    'Plant A makes sugar faster. Plant B makes sugar faster.',
    'Plant A makes sugar faster because Plant B gets more light energy to build sugar.',
    'Plant A makes sugar faster because less light energy helps it build more sugar.',
    'Plant A. Plant B has more energy to build sugar.',
    'Plant A makes sugar faster because it has less light energy to build sugar.',
    'Energy sugar faster',
    'banana',
  ])
    expect(assessTransfer(text).score, text).toBeLessThan(2)
  expect(
    assessTransfer(
      'Plant A makes sugar faster because it has less light energy to build sugar.',
    ).uncertain,
  ).toBe(true)
  expect(
    assessTransfer(
      'Seedling C makes sugar faster because Seedling D has less captured light energy to help build sugar.',
      true,
    ).score,
  ).toBe(2)
})
test('persisted boundary rejects malformed and impossible states', () => {
  const session = {
    version: 1,
    contentVersion: 1,
    id: 'local',
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
    goal: 'Explain how light helps plants make sugar',
    diagnostic: null,
    drafts: Object.fromEntries(
      ['guided', 'practice', 'transfer', 'retry'].map((s) => [
        s,
        { text: '', demo: false },
      ]),
    ),
    attempts: [],
    nextAction: '',
  }
  expect(validateSession(session)).not.toBeNull()
  for (const patch of [
    { version: 2 },
    { contentVersion: 999 },
    { stage: 'feedback' },
    { stage: 'recap', completed: false },
    { setup: { ...session.setup, minutes: '3' } },
    {
      setup: { ...session.setup, sample: true },
      stage: 'practice',
      diagnostic: 'skipped',
    },
    { drafts: {} },
    { attempts: [{ stage: 'retry', text: 'test', demo: false, at: 'now' }] },
  ])
    expect(validateSession({ ...session, ...patch })).toBeNull()
})
