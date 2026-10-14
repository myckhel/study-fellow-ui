import type { GuidedCategory } from '../model/assessment'

export type LessonSource = {
  label: string
  locator: string
  summary: string
  url: string
}
export type LessonConfig = {
  id: string
  version: number
  title: string
  goal: string
  explanation: string
  simpler: string
  guided: string
  practice: string
  transfer: string
  retry: string
  feedback: Record<GuidedCategory, string>
  sources: LessonSource[]
}
export const photosynthesis: LessonConfig = {
  id: 'photosynthesis',
  version: 1,
  title: 'How does light help a plant make sugar?',
  goal: 'Explain how light helps plants make sugar',
  explanation:
    'Chlorophyll captures light. Light-dependent reactions store that energy in chemical carriers, which support building carbohydrates from carbon dioxide. Light is energy; water and carbon dioxide are matter inputs.',
  simpler:
    'Think of building something: you need materials and energy to do the work. Water and carbon dioxide are materials. Captured light provides energy that helps the plant build sugar. This comparison is a teaching example, not the full chemistry.',
  guided:
    'A plant has enough water and carbon dioxide. Its leaves absorb light. What role does light play in helping the plant build sugar?',
  practice:
    'A learner says, “Sunlight is a material the plant turns into food.” How would you explain the difference between energy and matter?',
  transfer:
    'Two similar plants have the same suitable water, carbon dioxide, and temperature. Plant B is moved to much dimmer light; light is now limiting. Which plant makes sugar faster? Explain why using light energy.',
  retry:
    'Two similar seedlings have suitable water, carbon dioxide, and temperature. Seedling C is under a brighter lamp; seedling D is shaded. Light is limiting for D. Which seedling makes sugar faster, and how does captured light energy explain the difference?',
  feedback: {
    material:
      'Light supplies energy, not the matter that becomes sugar. Carbon dioxide and water are matter inputs. Captured light is converted into chemical energy that supports sugar building.',
    energy:
      'You identified light as energy. Add the next connection: captured light becomes chemical energy that helps build sugar from carbon dioxide.',
    sound:
      'You connected light energy to sugar building. Now apply that reasoning to a new situation where light is limiting.',
    unsure:
      'Let’s clarify this together. Our demo rules could not confidently interpret this answer. Try naming what light provides and how it supports building sugar; you can also continue to practise.',
  },
  sources: [
    {
      label: 'OpenStax Biology 2e · 8.1',
      locator:
        'Overview of Photosynthesis · The Two Parts of Photosynthesis · Figure 8.7',
      summary:
        'Photosynthesis captures light energy and uses water and carbon dioxide in producing carbohydrates, releasing oxygen. This is an authored summary of the source.',
      url: 'https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis',
    },
    {
      label: 'OpenStax Biology 2e · 8.2',
      locator:
        'The Light-Dependent Reactions of Photosynthesis · How Light-Dependent Reactions Work',
      summary:
        'Light-dependent reactions convert captured light into chemical energy carriers used by later carbohydrate-building reactions. This is an authored summary of the source.',
      url: 'https://openstax.org/books/biology-2e/pages/8-2-the-light-dependent-reactions-of-photosynthesis',
    },
  ],
}
