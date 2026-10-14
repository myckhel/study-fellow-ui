import { useState } from 'react'
import { Button, Input } from 'antd'
import { feedbackCopy } from '../content/learner-copy'
import { assessGuided, assessTransfer } from '../model/assessment'
import { useStudyStore, type AnswerStage } from '../model/study-store'

const examples: Record<AnswerStage, [string, string][]> = {
  guided: [
    ['Light as food', 'Light is food for the plant.'],
    ['Energy', 'Light provides energy.'],
    ['Energy and sugar', 'Light provides energy to build sugar.'],
  ],
  practice: [
    [
      'Energy and matter',
      'Light is not food. It provides energy to build sugar; water and carbon dioxide provide matter.',
    ],
  ],
  transfer: [
    ['Prediction only', 'Plant A makes sugar faster.'],
    [
      'Energy and sugar',
      'Plant A makes sugar faster because Plant B has less captured light energy to help build sugar.',
    ],
  ],
  retry: [
    [
      'Energy and sugar',
      'Seedling C makes sugar faster because Seedling D has less captured light energy to help build sugar.',
    ],
  ],
}
export function LessonAnswer({
  stage,
  question,
  optional = false,
}: {
  stage: AnswerStage
  question: string
  optional?: boolean
}) {
  const { session, draft, submit, go } = useStudyStore()
  const [clarify, setClarify] = useState(false)
  if (!session) return null
  const saved = session.attempts.find((a) => a.stage === stage)
  const value = session.drafts[stage]
  const check = () => {
    const result =
      stage === 'transfer' || stage === 'retry'
        ? assessTransfer(value.text, stage === 'retry')
        : assessGuided(value.text)
    if (result.uncertain && !clarify) setClarify(true)
    else submit(stage)
  }
  return (
    <div>
      <p className="leading-7">{question}</p>
      <label
        htmlFor={`answer-${stage}`}
        className="mb-2 block text-sm font-medium"
      >
        Your explanation
      </label>
      <Input.TextArea
        id={`answer-${stage}`}
        rows={5}
        maxLength={5000}
        value={saved?.text ?? value.text}
        readOnly={!!saved}
        placeholder="Explain the idea in your own words…"
        onChange={(event) => {
          draft(stage, event.target.value)
          setClarify(false)
        }}
      />
      {value.demo && (
        <p className="text-sm text-accent-ink">
          Based on an example, including any changes you made.
        </p>
      )}
      {saved ? (
        <p
          role="status"
          className="rounded-2xl bg-orbit-soft p-4 text-sm leading-6"
        >
          {stage === 'practice'
            ? feedbackCopy(assessGuided(saved.text).category)
            : 'Your answer is kept. Continue to see its result; it won’t be checked again.'}
        </p>
      ) : (
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-focus">Example answers</summary>
          <p>
            Choose an example to put in the answer box. It won’t be sent until you choose.
            An example answer does not show what you understand.
          </p>
          <div className="flex flex-wrap gap-2">
            {examples[stage].map(([label, text]) => (
              <Button
                key={label}
                onClick={() => {
                  draft(stage, text, true)
                  setClarify(false)
                }}
              >
                {label}
              </Button>
            ))}
          </div>
        </details>
      )}
      {clarify && !saved && (
        <p
          role="status"
          className="rounded-2xl bg-orbit-soft p-4 text-sm leading-6"
        >
          I’m not sure what your answer means yet. Name what light provides and
          how it helps build sugar
          {stage === 'transfer' || stage === 'retry'
            ? ', and clearly identify which plant makes sugar faster'
            : ''}
          . You can edit your answer or send it as it is. This does not mean your reasoning is wrong.
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          type="primary"
          size="large"
          disabled={!value.text.trim() && !saved}
          onClick={saved ? () => submit(stage) : check}
        >
          {saved
            ? 'Continue'
            : clarify
              ? 'Send as it is'
              : 'Check my thinking'}
        </Button>
        {optional && !saved && (
          <Button size="large" onClick={() => go('transfer')}>
            Skip extra practice
          </Button>
        )}
        {!saved && (
          <Button
            size="large"
            onClick={() => {
              draft(stage, "I'm not sure.")
              setClarify(true)
            }}
          >
            I’m not sure
          </Button>
        )}
      </div>
    </div>
  )
}
