import { useEffect, useRef, useState } from 'react'
import { Button, Input, type InputRef } from 'antd'
import { Navigate, useNavigate } from 'react-router'
import { Brand } from '@/shared/ui/Brand'
import { focusedOutcome } from '../content/learner-copy'
import { scenario, stepTitle } from '../content/session-scenario'
import { useSessionStore } from '../model/session-store'
import { SessionBlock } from '../components/SessionBlocks'

export function Component() {
  const { session, setDraft, send, move, reset } = useSessionStore()
  const navigate = useNavigate()
  const heading = useRef<HTMLHeadingElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const composer = useRef<InputRef>(null)
  const following = useRef(true)
  const [replyCue, setReplyCue] = useState(false)
  const currentId = session?.currentStepId
  const turnCount = session?.turns.length ?? 0
  const previousTurnCount = useRef(turnCount)
  useEffect(() => {
    heading.current?.focus()
    if (canvas.current) canvas.current.scrollTop = 0
    following.current = true
  }, [currentId])
  useEffect(() => {
    if (turnCount > previousTurnCount.current && following.current && canvas.current) canvas.current.scrollTop = canvas.current.scrollHeight
    previousTurnCount.current = turnCount
  }, [turnCount])
  if (!session) return <Navigate to="/start" replace />
  const step = scenario.steps.find(step => step.id === session.currentStepId)!
  const index = session.route.indexOf(step.id)
  const check = step.kind === 'learner-prompt'
  const recap = step.kind === 'recap'
  const turns = session.turns.filter(turn => turn.stepId === step.id)
  const next = session.route[index + 1]
  const routeList = <><p className="text-xs tracking-widest text-starlight">YOUR STEPS</p><ol className="m-0 list-none space-y-3 p-0">{session.route.map((id, position) => <li key={id} aria-current={id === step.id ? 'step' : undefined} className={`rounded-control p-3 ${id === step.id ? 'bg-ivory/10' : ''}`}><span className="mr-3 text-orbit">{position + 1}</span>{stepTitle[id]}<span className="mt-1 block pl-6 text-xs text-orbit">{id === step.id ? 'Current step' : position < index ? 'Earlier' : 'Next'}</span></li>)}</ol><p className="mt-6 text-sm leading-6 text-orbit">What you’ll learn: {session.interpretation === 'energy' ? focusedOutcome : scenario.inferredOutcome}</p></>
  return <main id="main-content" className="session-shell" tabIndex={-1}>
    <header className="session-header"><Brand /><div className="flex gap-2"><Button onClick={() => navigate('/')}>Leave</Button><Button onClick={() => { if (window.confirm('Start again? Your messages and answers will be cleared. Your saved lesson will stay.')) { reset(); navigate('/start') } }}>Reset</Button></div></header>
    <div className="session-body">
      <aside className="session-route-desktop">{routeList}</aside>
      <section className="session-workspace" aria-label="Learning session">
        <details className="session-route-mobile"><summary>Steps · {index + 1} of {session.route.length} · {stepTitle[step.id]}</summary><div className="max-h-52 overflow-auto p-4">{routeList}</div></details>
        <div ref={canvas} role="region" aria-label="Teaching and conversation" tabIndex={0} className="session-canvas" onScroll={() => { const region = canvas.current!; following.current = region.scrollHeight - region.scrollTop - region.clientHeight < 72; if (following.current) setReplyCue(false) }}>
          <div className="mx-auto max-w-3xl">
            
            <h1 ref={heading} tabIndex={-1} className="mb-4 mt-0 font-display text-3xl font-normal sm:text-4xl">{stepTitle[step.id]}</h1>
            {check && <p className="rounded-control bg-accent-soft p-3 text-sm leading-6">Your answer won’t be checked yet. Send keeps it here; Continue opens the next step.</p>}
            {step.contentBlocks.map(block => <SessionBlock key={block.id} block={block} stepSourceRefs={step.sourceRefs} />)}
            {step.id === 'core' && <details className="mt-5 text-sm leading-6 text-muted"><summary>More about the science</summary><p>{scenario.teachingNotes.g3p}</p><p>{scenario.teachingNotes.conditions}</p></details>}
            {turns.length > 0 && <section aria-label="Messages at this step" className="mt-6 space-y-4">{turns.map(turn => <article key={turn.id} className={`rounded-2xl p-4 ${turn.speaker === 'learner' ? 'ml-5 bg-orbit-soft' : 'mr-5 border border-line bg-surface'}`}><p className="mb-2 mt-0 text-xs font-semibold text-muted">{turn.origin === 'typed' ? 'You' : 'StudyFellow'}</p><p className="m-0 whitespace-pre-wrap break-words leading-7">{turn.text}</p></article>)}</section>}
          </div>
        </div>
        <div className="session-dock">
          <div className="mx-auto max-w-3xl">
            
            <div className="session-actions mb-3 flex flex-wrap items-center gap-3">{index > 0 && <Button onClick={() => { setReplyCue(false); move(-1) }}>Back</Button>}{!recap && <Button type="primary" aria-label={next === 'recap' ? 'View summary' : undefined} onClick={() => { setReplyCue(false); move(1) }}>{next === 'recap' ? 'View summary' : 'Continue'}</Button>}{recap && <Button type="primary" onClick={() => navigate('/')}>Return home</Button>}{replyCue && <Button onClick={() => { if (canvas.current) canvas.current.scrollTop = canvas.current.scrollHeight; following.current = true; setReplyCue(false) }}>New reply ↓</Button>}</div>
            <form className="flex items-end gap-2" onSubmit={event => { event.preventDefault(); if (!session.drafts[step.id]?.trim()) return; const nearBottom = following.current; send(); if (!nearBottom) setReplyCue(true); composer.current?.focus() }}>
              <div className="min-w-0 flex-1"><label htmlFor="session-message" className="sr-only">Message StudyFellow</label><Input.TextArea ref={composer} id="session-message" className={!session.drafts[step.id] ? 'session-message-empty' : undefined} maxLength={2000} autoSize={{ minRows: 1, maxRows: 4 }} value={session.drafts[step.id] ?? ''} onChange={event => setDraft(event.target.value)} placeholder={check ? 'Your answer or question…' : 'What’s on your mind?'} /></div>
              <Button htmlType="submit" disabled={!session.drafts[step.id]?.trim()}>Send</Button>
            </form>
            <p aria-live="polite" className="sr-only">{turns.length ? `StudyFellow message ${turns.length / 2} is here.` : ''}</p><p className="mb-0 mt-2 text-xs leading-5 text-muted">Lost if you reload or close this tab.</p>
          </div>
        </div>
      </section>
    </div>
  </main>
}
