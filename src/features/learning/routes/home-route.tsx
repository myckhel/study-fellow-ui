import { useState } from 'react'
import { Button } from 'antd'
import { useNavigate } from 'react-router'
import { Brand } from '@/shared/ui/Brand'
import { useSessionStore } from '../model/session-store'
import { stepTitle } from '../content/session-scenario'
import { useStudyStore } from '../model/study-store'
import { LearningIcon, type IconName } from '../components/LearningIllustration'
import { LessonPreview } from '../components/LessonPreview'
import { StorageNotice } from '../components/SessionChrome'

export function Component() {
  const navigate = useNavigate()
  const { session, reset, flush } = useStudyStore()
  const tabSession = useSessionStore((s) => s.session)
  const [showNote, setShowNote] = useState(false)
  const open = () => {
    flush()
    navigate(session?.stage === 'setup' || !session ? '/legacy-start' : '/lesson')
  }
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Brand />
        <Button aria-expanded={showNote} onClick={() => setShowNote(!showNote)}>
          {showNote ? 'Hide note' : 'How it works'}
        </Button>
      </header>
      <StorageNotice />
      <section className="grid gap-10 pb-12 pt-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-20">
        <div>
          <span className="text-xs font-semibold tracking-widest text-focus">
            YOUR LEARNING SPACE
          </span>
          <h1 className="mb-4 mt-5 font-display text-4xl font-normal leading-tight sm:text-6xl">
            Make sense of the things that feel{' '}
            <span className="text-focus">hard.</span>
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted sm:text-lg">
            Get help with a confusing idea. Start with photosynthesis.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              type="primary"
              size="large"
              className="!h-12 !rounded-full !px-6"
              onClick={() => navigate('/start')}
            >
              Learn now →
            </Button>
            <span className="text-sm text-muted">
              One short session
            </span>
          </div>
          {showNote && (
            <p className="mt-5 rounded-2xl border border-line bg-orbit-soft p-4 text-sm leading-6">
              Read a short lesson, see an example and keep your questions here.
              Ask about light, energy and materials. Check your explanation and get a useful next step. The final new-situation answer is not checked yet.
              It is lost if you reload or close this tab. Saved lessons with answer checks are separate.
            </p>
          )}
          {tabSession && <div className="mt-5 rounded-2xl border border-line bg-orbit-soft p-4"><p className="mt-0 text-sm leading-6">Photosynthesis session · {stepTitle[tabSession.currentStepId]}. Lost if you reload or close this tab.</p><Button onClick={() => navigate('/session')}>Continue session</Button></div>}
          {session && (
            <div className="mt-5 rounded-2xl border border-line p-4"><p className="mt-0 text-sm">Saved lesson with answer checks</p><div className="flex flex-wrap gap-3"><Button onClick={open}>{session.stage === 'recap' ? 'View saved summary' : 'Resume saved lesson'}</Button>
              <Button
                onClick={() => {
                  if (
                    window.confirm(
                      'Restart? Your saved session and answers will be cleared.',
                    )
                  ) {
                    reset()
                    navigate('/legacy-start')
                  }
                }}
              >
                Restart saved lesson
              </Button>
              <Button
                onClick={() => {
                  if (
                    window.confirm(
                      'Clear saved progress? This cannot be undone.',
                    )
                  )
                    reset()
                }}
              >
                Clear progress
              </Button>
            </div></div>
          )}
        </div>
        <LessonPreview session={session} />
      </section>
      <section className="grid gap-4 border-t border-line pt-8 sm:grid-cols-3">
        {[
          ['sun', 'Understand', 'Read one clear explanation.'],
          [
            'topic',
            'Try it',
            'See examples and keep your questions here.',
          ],
          [
            'goal',
            'Keep going',
            'Try the idea in a new situation and choose your next step.',
          ],
        ].map(([number, title, description]) => (
          <article key={number} className="rounded-2xl p-4">
            <span className="text-xs font-semibold tracking-widest text-focus">
              <LearningIcon name={number as IconName} className="!h-7 !w-7" />
            </span>
            <h2 className="mb-1 mt-3 text-base font-semibold">{title}</h2>
            <p className="m-0 text-sm leading-6 text-muted">{description}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
