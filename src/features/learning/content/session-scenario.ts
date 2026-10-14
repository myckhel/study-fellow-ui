import data from './phase1-scenario.json' with { type: 'json' }

function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze)
    Object.freeze(value)
  }
  return value
}
/** Build-time projection of canonical phase-0 v2; never mutate instructional data. */
export const scenario = freeze(data)
export type ContentBlock = typeof scenario.steps[number]['contentBlocks'][number]
export const stepTitle: Record<string, string> = {
  core: 'How light helps', guided: 'Your turn', example: 'An everyday example',
  'matter-energy': 'Energy and materials', 'energy-bridge': 'Connect the energy',
  'follow-up': 'Try the distinction', transfer: 'Apply the idea', retry: 'A different situation',
  recap: 'What we covered',
}
