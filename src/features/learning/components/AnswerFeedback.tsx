import type { Attempt } from '../model/session-store'
import { presentFeedback } from '../content/feedback-presentation'

export function AnswerFeedback({ attempt }: { attempt: Attempt }) {
  const feedback = presentFeedback(attempt)
  const isSuccess = feedback.tone === 'success'
  return <div data-feedback-tone={feedback.tone} className={`rounded-xl p-4 sm:p-5 transition-all ${isSuccess ? 'border-l-4 border-success bg-success/5 shadow-xs' : 'border border-line/80 bg-surface'}`}>
    <h2 className={`mb-2 mt-0 text-base font-semibold flex items-center gap-2 ${isSuccess ? 'text-success' : 'text-ink'}`}>
      {isSuccess && <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success text-ivory text-xs">✓</span>}
      {feedback.title}
    </h2>
    <p className="m-0 leading-7 text-ink">{feedback.text}</p>
  </div>
}
