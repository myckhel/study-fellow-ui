import { useState } from 'react'
import { Button, Card, Input } from 'antd'
import { photosynthesis } from '../content/photosynthesis'

export function LessonAnswer({ onLeave }: { onLeave: () => void }) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
      <Card className="!mt-5 !rounded-card !border-line"><h2 className="mb-2 text-lg font-semibold text-ink">Your turn</h2><p className="mb-4 leading-6 text-muted">{photosynthesis.question}</p><Input.TextArea aria-label="Your explanation" className="min-h-28" rows={4} placeholder="Write a few words in your own way…" value={answer} onChange={(event) => setAnswer(event.target.value)} />{submitted && <p role="status" className="mt-4 rounded-2xl bg-orbit-soft p-4 leading-6 text-ink">{photosynthesis.feedback}</p>}<div className="mt-4 flex flex-wrap gap-3"><Button type="primary" className="!h-11 !rounded-full !px-5" disabled={!answer.trim()} onClick={() => setSubmitted(true)}>Check my thinking</Button><Button className="!h-11 !rounded-full !px-5" onClick={onLeave}>Save and leave</Button></div></Card>
  )
}
