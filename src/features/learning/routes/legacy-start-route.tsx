import { useEffect, useRef } from 'react'
import { Button, Card, Input, Radio, Tabs } from 'antd'
import { Navigate, useNavigate } from 'react-router'
import { LearningIcon } from '../components/LearningIllustration'
import { photosynthesis } from '../content/photosynthesis'
import { useStudyStore } from '../model/study-store'
import { SessionHeader, StorageNotice } from '../components/SessionChrome'

export function Component() {
  const { session, storage, ensureSetup, configure, start } = useStudyStore()
  const navigate = useNavigate()
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    ensureSetup()
    heading.current?.focus()
  }, [ensureSetup, storage])
  if (session && session.stage !== 'setup')
    return <Navigate to="/lesson" replace />
  const setup = session?.setup
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-3xl px-5 pb-16 pt-6 sm:px-8"
    >
      <SessionHeader />
      <StorageNotice />
      <h1
        ref={heading}
        tabIndex={-1}
        className="mb-3 mt-10 font-display text-4xl font-normal"
      >
        Start a saved lesson
      </h1>
      <p className="mb-7 leading-7 text-muted">
        Photosynthesis with answer checks. Choose three or five minutes.
      </p>
      {setup && (
        <Card className="!rounded-card !border-line">
          <section>
            <h2 className="text-lg font-semibold">
              <LearningIcon name="resource" className="mr-2 text-focus" />
              01 · Topic or resource
            </h2>
            <Tabs
              activeKey={setup.tab}
              onChange={(key) => configure({ tab: key as typeof setup.tab })}
              items={[
                {
                  key: 'topic',
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <LearningIcon name="topic" />
                      Topic
                    </span>
                  ),
                  children: (
                    <>
                      <label htmlFor="topic" className="mb-2 block">
                        What would you like to understand?
                      </label>
                      <Input
                        id="topic"
                        maxLength={500}
                        value={setup.topic}
                        onChange={(e) => configure({ topic: e.target.value })}
                        placeholder="A concept or topic"
                      />
                      <p className="text-sm leading-6 text-muted">
                        Photosynthesis is the only topic available right now. Choose it below.
                      </p>
                    </>
                  ),
                },
                {
                  key: 'resource',
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <LearningIcon name="resource" />
                      Resource
                    </span>
                  ),
                  children: (
                    <>
                      <label htmlFor="resource" className="mb-2 block">
                        Choose a local file
                      </label>
                      <input
                        id="resource"
                        type="file"
                        className="max-w-full text-sm"
                        onChange={(e) =>
                          configure({
                            filename:
                              e.target.files?.[0]?.name.slice(0, 500) || '',
                          })
                        }
                      />
                      {setup.filename && (
                        <p className="break-all text-sm">
                          Selected locally: {setup.filename}
                        </p>
                      )}
                      <p className="text-sm leading-6 text-muted">
                        The file stays on your device. Only its name is saved; the lesson doesn’t read it.
                      </p>
                    </>
                  ),
                },
                {
                  key: 'sample',
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <LearningIcon name="leaf" />
                      Photosynthesis
                    </span>
                  ),
                  children: (
                    <p className="leading-6">
                      Explore how plants use light energy, water and carbon
                      dioxide to build sugar, with OpenStax source notes.
                    </p>
                  ),
                },
              ]}
            />
            <div className="rounded-2xl bg-orbit-soft p-4">
              <p className="mt-0 text-sm leading-6">
                This lesson teaches photosynthesis. Your topic or file does not change it.
              </p>
              <Button
                aria-pressed={setup.sample}
                onClick={() => configure({ sample: true })}
              >
                {setup.sample
                  ? 'Photosynthesis selected'
                  : 'Try photosynthesis'}
              </Button>
            </div>
          </section>
          <section className="mt-8 border-t border-line pt-5">
            <h2 className="text-lg font-semibold">
              <LearningIcon name="goal" className="mr-2 text-focus" />
              02 · Your goal
            </h2>
            <p className="leading-6">{photosynthesis.goal}.</p>
            <label htmlFor="goal" className="mb-2 block text-sm">
              What you want to learn (optional)
            </label>
            <Input
              id="goal"
              maxLength={500}
              value={setup.customGoal}
              onChange={(e) => configure({ customGoal: e.target.value })}
            />
            <p className="text-sm leading-6 text-muted">
              Your words are saved. The photosynthesis lesson stays the same.
            </p>
          </section>
          <section className="mt-8 border-t border-line pt-5">
            <h2 className="text-lg font-semibold">
              <LearningIcon name="time" className="mr-2 text-focus" />
              03 · Available time
            </h2>
            <Radio.Group
              aria-label="Available time"
              value={setup.minutes}
              onChange={(e) => configure({ minutes: e.target.value })}
            >
              <Radio value={3}>3 minutes · short lesson</Radio>
              <Radio value={5}>5 minutes · extra practice</Radio>
            </Radio.Group>
          </section>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              type="primary"
              size="large"
              disabled={!setup.sample || storage === 'invalid'}
              onClick={() => {
                start()
                navigate('/lesson')
              }}
            >
              Begin lesson
            </Button>
            <span className="text-sm text-muted">
              One quick question comes next.
            </span>
          </div>
        </Card>
      )}
    </main>
  )
}
