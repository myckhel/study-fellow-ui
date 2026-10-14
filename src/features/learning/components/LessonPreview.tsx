import { EnergyFlow, LearningIcon } from './LearningIllustration'
import { lessonTitles, nextStepCopy } from '../content/learner-copy'
import { type Session } from '../model/study-store'
export function LessonPreview({ session }: { session: Session | null }) {
  return (
    <aside className="observatory-panel relative overflow-hidden rounded-card p-7 shadow-observatory sm:p-9">
      <span
        aria-hidden="true"
        className="absolute right-6 top-6 text-2xl text-starlight"
      >
        ✦
      </span>
      <div className="relative z-10">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-orbit">
          {session ? 'SAVED LESSON WITH ANSWER CHECKS' : 'PHOTOSYNTHESIS'}
        </span>
        <h2 className="mt-4 font-display text-3xl font-normal text-ivory">
          How plants make sugar
        </h2>
        <p className="leading-7 text-ivory/80">
          Photosynthesis, one clear step at a time.
        </p>
        <EnergyFlow compact />
        <div className="mt-8 rounded-2xl bg-surface p-4 text-ink">
          {session ? (
            <>
              <p className="mt-0 break-words text-sm">
                <strong>Goal:</strong> {session.goal}
              </p>
              <p className="text-sm">
                <strong>Last step:</strong> {lessonTitles[session.stage]}
              </p>
              <p className="mb-0 text-sm leading-6">
                <LearningIcon name="arrow" className="mr-2" />
                <strong>Next:</strong> {nextStepCopy(session.stage, session.nextAction)}
              </p>
            </>
          ) : (
            <p className="m-0 text-sm leading-6">
              Read a short explanation, see an example and try the idea.
              Check your answers and get feedback on each part.
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}
