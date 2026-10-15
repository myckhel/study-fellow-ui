import { LearningIcon, type IconName } from './LearningIllustration'

export function LessonPreview() {
  return (
    <aside className="observatory-panel relative overflow-hidden rounded-card p-7 shadow-observatory sm:p-9">
      <span aria-hidden="true" className="absolute right-6 top-6 text-2xl text-starlight">✦</span>
      <div className="relative z-10">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-orbit">HOW IT WORKS</span>
        <h2 className="mt-4 font-display text-3xl font-normal text-ivory">A clear way forward</h2>
        <ol className="m-0 mt-7 list-none space-y-6 p-0">
          {[
            ['question', 'Bring a confusing idea', 'Start with what you want to understand.'],
            ['topic', 'Work through it', 'Read, ask questions and check your explanation.'],
            ['goal', 'Try what you’ve learned', 'Apply the idea in a new situation.'],
          ].map(([icon, title, detail]) => <li key={title} className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-ivory/10 text-starlight"><LearningIcon name={icon as IconName} /></span>
            <div><h3 className="m-0 text-base font-semibold text-ivory">{title}</h3><p className="mb-0 mt-1 text-sm leading-6 text-orbit">{detail}</p></div>
          </li>)}
        </ol>
      </div>
    </aside>
  )
}
