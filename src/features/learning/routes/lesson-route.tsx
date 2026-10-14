import { useEffect, useRef, useState } from 'react'
import { Button, Card } from 'antd'
import { Navigate, useNavigate } from 'react-router'
import {
  useStudyStore,
  type Stage,
  type Attempt,
} from '../model/study-store'
import { lessonTitles, feedbackCopy, evidenceCopy } from '../content/learner-copy'
import type { GuidedAssessment, TransferAssessment } from '../model/assessment'
import {
  EnergyFlow,
  LearningIcon,
  type IconName,
} from '../components/LearningIllustration'
import { LessonAnswer } from '../components/LessonAnswer'
import {
  SessionHeader,
  Sources,
  StorageNotice,
} from '../components/SessionChrome'
import { photosynthesis } from '../content/photosynthesis'

function Criteria({ attempt, label }: { attempt: Attempt; label: string }) {
  const result = attempt.assessment as TransferAssessment
  return (
    <section className="my-5 rounded-2xl bg-orbit-soft p-4">
      <h3 className="mt-0 font-semibold">
        {label}: {result.score}/2{' '}
        {attempt.demo && (
          <span className="text-sm font-normal text-accent-ink">
            · Based on an example
          </span>
        )}
      </h3>
      <details className="mb-3 text-sm">
        <summary className="text-focus">Your answer</summary>
        <p className="break-words leading-6">{attempt.text}</p>
      </details>
      <ul className="mb-0 list-none space-y-2 p-0 text-sm leading-6">
        {result.evidence.map((item, i) => (
          <li key={evidenceCopy(item)}>
            <LearningIcon
              name={
                (i === 0 ? result.prediction : result.reasoning)
                  ? 'check'
                  : 'question'
              }
              className="mr-2 align-middle"
            />
            <strong>
              {i === 0 ? 'Which plant' : 'Why'} ·{' '}
              {(i === 0 ? result.prediction : result.reasoning)
                ? 'Shown'
                : 'Not clear yet'}
              :
            </strong>{' '}
            {evidenceCopy(item)}
          </li>
        ))}
      </ul>
      {result.uncertain && (
        <p className="mb-0 text-sm">
          Some parts of this answer are unclear. This does not mean your reasoning is wrong.
        </p>
      )}
    </section>
  )
}
export function Component() {
  const { session, diagnose, go } = useStudyStore()
  const navigate = useNavigate()
  const [simpler, setSimpler] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const stage = session?.stage
  useEffect(() => {
    heading.current?.focus()
  }, [stage])
  if (!session || session.stage === 'setup')
    return <Navigate to="/legacy-start" replace />
  const guided = session.attempts.find((a) => a.stage === 'guided')
  const first = session.attempts.find((a) => a.stage === 'transfer')
  const retry = session.attempts.find((a) => a.stage === 'retry')
  const result = (retry ?? first)?.assessment as TransferAssessment | undefined
  const path: Stage[] = [
    'diagnostic',
    'explanation',
    'guided',
    'feedback',
    ...(session.setup.minutes === 5 ? ['practice' as Stage] : []),
    'transfer',
    'recap',
  ]
  const index = path.indexOf(
    session.stage === 'retry' ? 'transfer' : session.stage,
  )
  const back = () => {
    if (session.stage === 'retry') go('transfer')
    else if (session.stage === 'recap' && retry) go('retry')
    else if (index > 0) go(path[index - 1])
  }
  const advanceFeedback = () =>
    go(session.setup.minutes === 5 ? 'practice' : 'transfer')
  const stageContent = () => {
    switch (session.stage) {
      case 'diagnostic':
        if (session.diagnostic !== null)
          return (
            <>
              <p className="leading-7">
                Your choice is kept:{' '}
                {session.diagnostic === 'matter'
                  ? 'Water and carbon dioxide'
                  : session.diagnostic === 'light'
                    ? 'Water, carbon dioxide and light energy'
                    : session.diagnostic === 'unsure'
                      ? 'Not sure'
                      : 'Skipped'}
                .
              </p>
              <Button
                type="primary"
                size="large"
                onClick={() => go('explanation')}
              >
                Continue
              </Button>
            </>
          )
        return (
          <>
            <p className="leading-7">
              Which are matter inputs the plant uses: water, carbon dioxide, or
              light energy?
            </p>
            <p className="text-sm text-muted">
              This helps choose where to start. You can continue with any answer.
            </p>
            <div className="flex flex-col gap-3">
              <Button size="large" onClick={() => diagnose('matter')}>
                Water and carbon dioxide
              </Button>
              <Button size="large" onClick={() => diagnose('light')}>
                Water, carbon dioxide and light energy
              </Button>
              <Button size="large" onClick={() => diagnose('unsure')}>
                I’m not sure
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => diagnose('skipped')}
              >
                Skip question
              </Button>
            </div>
          </>
        )
      case 'explanation':
        return (
          <>
            <span className="text-xs font-semibold uppercase tracking-wide text-focus">
              Explanation
            </span>
            {session.diagnostic === 'light' ||
            session.diagnostic === 'unsure' ? (
              <p className="rounded-xl bg-orbit-soft p-4 leading-6">
                Start with this distinction: light is energy, while water and
                carbon dioxide are matter inputs.
              </p>
            ) : session.diagnostic === 'matter' ? (
              <p className="text-sm text-success">
                Your recall distinguished matter inputs. Let’s connect them to
                energy.
              </p>
            ) : null}
            <EnergyFlow />
            <p className="leading-7">{photosynthesis.explanation}</p>
            <details className="text-sm text-muted">
              <summary className="text-focus">Simplified equation</summary>
              <div className="rounded-2xl bg-orbit-soft p-4 text-center font-medium leading-8">
                carbon dioxide + water + light energy → sugar + oxygen
              </div>
              <p className="text-sm leading-6 text-muted">
                Simplified equation · sugar is often represented as glucose.
                Several reactions are involved; see the G3P teaching note below.
              </p>
            </details>
            <Button
              aria-expanded={simpler}
              onClick={() => setSimpler(!simpler)}
            >
              {simpler ? 'Hide simpler explanation' : 'Explain it more simply'}
            </Button>
            {simpler && (
              <aside className="mt-4 rounded-2xl bg-accent-soft p-4">
                <strong className="text-xs uppercase text-accent-ink">
                  Example
                </strong>
                <p className="mb-0 leading-7">{photosynthesis.simpler}</p>
              </aside>
            )}
            <div className="mt-6">
              <Button type="primary" size="large" onClick={() => go('guided')}>
                Continue
              </Button>
            </div>
          </>
        )
      case 'guided':
        return (
          <LessonAnswer
            key="guided"
            stage="guided"
            question={photosynthesis.guided}
          />
        )
      case 'feedback':
        return (
          <>
            <span className="text-xs uppercase text-focus">
              About your answer
            </span>
            <p className="break-words text-sm leading-6">
              Your answer: {guided?.text}
            </p>
            {guided?.demo && (
              <p className="text-sm text-accent-ink">
                Based on an example
              </p>
            )}
            <div
              role="status"
              className="rounded-2xl bg-orbit-soft p-5 leading-7"
            >
              <p className="mt-0 font-medium">
                {evidenceCopy((guided?.assessment as GuidedAssessment).evidence)}
              </p>
              <p className="mb-0">
                {
                  feedbackCopy((guided!.assessment as GuidedAssessment).category)
                }
              </p>
            </div>
            <div className="mt-6">
              <Button type="primary" size="large" onClick={advanceFeedback}>
                Continue
              </Button>
            </div>
          </>
        )
      case 'practice':
        return (
          <>
            <span className="text-xs uppercase text-focus">
              Example · extra practice
            </span>
            <LessonAnswer
              key="practice"
              stage="practice"
              question={photosynthesis.practice}
              optional
            />
          </>
        )
      case 'transfer':
        return (
          <LessonAnswer
            key="transfer"
            stage="transfer"
            question={photosynthesis.transfer}
          />
        )
      case 'retry':
        return (
          <>
            <span className="text-xs uppercase text-focus">
              Let’s look again
            </span>
            {first && (
              <Criteria attempt={first} label="First answer" />
            )}
            <p className="leading-7">
              {(first?.assessment as TransferAssessment).prediction
                ? 'You identified which plant makes sugar faster. Now explain how light energy helps build sugar.'
                : 'In the stated conditions, the plant in brighter light makes sugar faster.'}{' '}
              Less captured light energy means less chemical energy available to
              support sugar building. Now try a different situation.
            </p>
            <LessonAnswer
              key="retry"
              stage="retry"
              question={photosynthesis.retry}
            />
          </>
        )
      case 'recap':
        return (
          <>
            <p className="leading-7">
              {result?.score === 2
                ? 'Your latest answer shows both parts: which plant makes sugar faster, and why light energy matters.'
                : 'You finished the lesson. Some parts of your answer are not clear yet. Read the explanation again, then try in your own words.'}{' '}
              {session.attempts.some((a) => a.demo)
                ? 'Some answers came from examples. They do not show what you understand.'
                : 'This checks one answer, not how long you’ll remember the idea.'}
            </p>
            {first && (
              <Criteria attempt={first} label="First answer" />
            )}
            {retry && <Criteria attempt={retry} label="Second answer" />}
            <p className="leading-7">
              <strong>Next action:</strong>{' '}
              {result?.score === 2
                ? 'Explain energy and matter in your own words, then read about chlorophyll in the source.'
                : 'Revisit how captured light becomes chemical energy for building sugar.'}
            </p>
            <Button
              type="primary"
              size="large"
              onClick={() =>
                result?.score === 2 ? navigate('/') : go('explanation')
              }
            >
              {result?.score === 2
                ? 'Return home'
                : 'Revisit explanation'}
            </Button>
          </>
        )
    }
  }
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-3xl px-5 pb-16 pt-6 sm:px-8"
    >
      <SessionHeader />
      <StorageNotice />
      <div className="mt-8 rounded-xl border border-line px-4 py-3 text-sm">
        <span className="inline-flex items-center gap-2">
          <LearningIcon
            name={
              (
                {
                  diagnostic: 'question',
                  explanation: 'sun',
                  guided: 'topic',
                  feedback: 'energy',
                  practice: 'leaf',
                  transfer: 'goal',
                  retry: 'goal',
                  recap: 'check',
                  setup: 'resource',
                } as Record<Stage, IconName>
              )[session.stage]
            }
          />
          Step {index + 1} of {path.length} · {lessonTitles[session.stage]}
        </span>
        <div
          aria-hidden="true"
          className="mt-3 h-1 overflow-hidden rounded-full bg-line"
        >
          <div
            className="h-full rounded-full bg-focus"
            style={{ width: `${((index + 1) / path.length) * 100}%` }}
          />
        </div>
        <p className="mb-0 mt-2 text-xs text-muted">
          {session.setup.minutes} minute lesson · answer checks
        </p>
      </div>
      {session.goal.length > 120 ? (
        <details className="mb-3 mt-6 text-sm text-muted">
          <summary className="cursor-pointer break-words text-focus">
            What you’ll learn: {session.goal.slice(0, 35)}… (view full)
          </summary>
          <p className="break-words leading-6">{session.goal}</p>
        </details>
      ) : (
        <p className="mb-3 mt-6 break-words text-sm text-muted">
          What you’ll learn: {session.goal}
        </p>
      )}
      <Card className="!rounded-card !border-line">
        <p className="mt-0 text-xs font-semibold uppercase tracking-widest text-focus">
          PHOTOSYNTHESIS
        </p>
        <h1
          ref={heading}
          tabIndex={-1}
          className="mb-5 mt-2 font-display text-3xl font-normal"
        >
          {lessonTitles[session.stage]}
        </h1>
        {stageContent()}
        <div className="mt-6">
          {index > 0 && <Button onClick={back}>← Back</Button>}
        </div>
        <Sources />
      </Card>
    </main>
  )
}
