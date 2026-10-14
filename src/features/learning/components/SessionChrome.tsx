import { Button } from 'antd'
import { useNavigate } from 'react-router'
import { Brand } from '@/shared/ui/Brand'
import { photosynthesis } from '../content/photosynthesis'
import { useStudyStore } from '../model/study-store'

export function StorageNotice() {
  const storage = useStudyStore((s) => s.storage)
  const reset = useStudyStore((s) => s.reset)
  if (storage === 'ready') return null
  return (
    <aside
      role="status"
      className="my-5 rounded-2xl border border-line bg-accent-soft p-4 text-sm leading-6"
    >
      {storage === 'invalid' ? (
        <>
          <strong>We couldn’t open your saved lesson.</strong>
          <p>
            The saved lesson can’t be read. Clear it to start a new saved lesson.
            You can also start a short session without changing it.
          </p>
          <Button
            onClick={() => {
              if (
                window.confirm(
                  'Clear this saved session? This cannot be undone.',
                )
              )
                reset()
            }}
          >
            Reset saved session
          </Button>
        </>
      ) : (
        <>
          <strong>Your progress can’t be saved.</strong>
          <p className="mb-0">
            You can keep learning here, but your progress may be lost if you reload or close this tab.
          </p>
        </>
      )}
    </aside>
  )
}
export function SessionHeader() {
  const navigate = useNavigate()
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <Brand />
      <Button
        onClick={() => {
          useStudyStore.getState().flush()
          navigate('/')
        }}
      >
        Save and leave
      </Button>
    </header>
  )
}
export function Sources() {
  return (
    <footer className="mt-7 border-t border-line pt-5 text-sm leading-6 text-muted">
      <details>
        <summary className="cursor-pointer font-medium text-focus">
          Sources
        </summary>
        <p>
          Based on OpenStax Biology 2e. Examples, questions and answer checks are by StudyFellow.
        </p>
        {photosynthesis.sources.map((source) => (
          <div className="my-4" key={source.url}>
            <a
              className="font-medium text-focus underline underline-offset-4"
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              {source.label} ↗
            </a>
            <p className="my-1">Section: {source.locator}</p>
            <p className="my-1">{source.summary.replace(' This is an authored summary of the source.', '')}</p>
          </div>
        ))}
        <p>
          More about the science: the Calvin cycle directly produces G3P, which can be
          used to make glucose and other carbohydrates. “Sugar” in the
          simplified equation summarizes several steps.
        </p>
        <p>
          Less light lowers sugar-production rate when light is limiting and
          other conditions remain suitable. It does not determine total stored
          glucose.
        </p>
      </details>
    </footer>
  )
}
