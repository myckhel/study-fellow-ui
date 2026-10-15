import type { Attempt } from '../model/session-store'
import { presentFeedback } from '../content/feedback-presentation'

export function AnswerFeedback({ attempt }: { attempt: Attempt }) {
  const feedback = presentFeedback(attempt)
  return <div data-feedback-tone={feedback.tone} className={feedback.tone === 'success' ? 'border-l-4 border-success pl-3' : ''}>
    <h2 className={`mb-2 mt-0 text-base font-semibold ${feedback.tone === 'success' ? 'text-success' : 'text-ink'}`}>{feedback.tone === 'success' && <span aria-hidden="true" className="mr-2">✓</span>}{feedback.title}</h2>
    <p className="m-0 leading-7">{feedback.text}</p>
  </div>
}
