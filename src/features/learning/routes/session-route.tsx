import { useEffect, useRef, useState } from 'react'
import { Button, Input, type InputRef } from 'antd'
import { Navigate, useNavigate } from 'react-router'
import { Brand } from '@/shared/ui/Brand'
import { focusedOutcome } from '../content/learner-copy'
import { scenario, stepTitle } from '../content/session-scenario'
import { activeDraft, nextExample, useSessionStore } from '../model/session-store'
import { SessionSaveNotice } from '../components/SessionSaveNotice'
import { SessionRecap } from '../components/SessionRecap'
import { SessionBlock } from '../components/SessionBlocks'

export function Component() {
  const { session, setDraft, send, move, reset, storage, check: checkAnswer, help, keepWorking, selectPath, flush, review, useExample: insertExample } = useSessionStore()
  const navigate = useNavigate()
  const heading = useRef<HTMLHeadingElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const composer = useRef<InputRef>(null)
  const following = useRef(true)
  const [replyCue, setReplyCue] = useState(false)
  const currentId = session?.currentStepId
  const turnCount = (session?.turns.length ?? 0) + (session?.attempts.length ?? 0) + (session?.clarification ? 1 : 0)
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
  const activeRoute = session.route.filter(entry => entry.status !== 'skipped')
  const index = activeRoute.findIndex(entry => entry.id === step.id)
  const check = step.kind === 'learner-prompt'
  const guided = check
  const attempt = session.attempts.find(attempt => attempt.stepId === step.id)
  const draft = activeDraft(session)
  const seed = nextExample(session)
  const recap = step.kind === 'recap'
  const respond = (action: () => void) => { const nearBottom = following.current; action(); if (!nearBottom) setReplyCue(true); composer.current?.focus() }
  const turns = session.turns.filter(turn => turn.stepId === step.id)
  const next = activeRoute[index + 1]?.id
  const routeList = <><p className="text-xs tracking-widest text-starlight">YOUR STEPS</p><ol className="m-0 list-none space-y-3 p-0">{session.route.map((entry, position) => <li key={entry.id} aria-current={entry.id === step.id ? 'step' : undefined} className={`rounded-control p-3 ${entry.id === step.id ? 'bg-ivory/10' : ''}`}><span className="mr-3 text-orbit">{position + 1}</span>{stepTitle[entry.id]}<span className="mt-1 block pl-6 text-xs text-orbit">{entry.id === step.id ? 'Current step' : entry.status === 'skipped' ? 'Skipped · ' + entry.reason : entry.status === 'completed' ? 'Completed' : entry.reason ? 'Added · ' + entry.reason : 'Next'}</span></li>)}</ol><p className="mt-6 text-sm leading-6 text-orbit">What you’ll learn: {session.interpretation === 'energy' ? focusedOutcome : scenario.inferredOutcome}</p></>
  return <main id="main-content" className="session-shell" tabIndex={-1}>
    <header className="session-header"><Brand /><div className="flex gap-2"><Button onClick={() => { flush(); navigate('/') }}>Leave</Button><Button onClick={() => { if (window.confirm('Start again? Your messages, answers and saved progress will be cleared.')) { if (reset()) navigate('/start') } }}>Reset</Button></div></header>
    <div className="session-body">
      <aside className="session-route-desktop">{routeList}</aside>
      <section className="session-workspace" aria-label="Learning session">
        <details className="session-route-mobile"><summary>Steps · {index + 1} of {activeRoute.length} · {stepTitle[step.id]}</summary><div className="max-h-52 overflow-auto p-4">{routeList}</div></details>
        <div className="session-reading-area"><div ref={canvas} role="region" aria-label="Teaching and conversation" tabIndex={0} className="session-canvas" onScroll={() => { const region = canvas.current!; following.current = region.scrollHeight - region.scrollTop - region.clientHeight < 72; if (following.current) setReplyCue(false) }}>
          <div className="mx-auto max-w-3xl">
            <details key={recap ? 'recap-paths' : 'session-paths'} className="mb-5 rounded-control border border-line p-3 text-sm"><summary>Example paths{session.examplePath ? ` · ${session.examplePath}` : ''}</summary><p>Try an example learner’s words. You can edit each message or answer before using Send or Check answer.</p><div className="flex flex-wrap gap-2">{scenario.examplePaths.map(path => <Button key={path.pathId} aria-pressed={path.pathId === session.examplePath} onClick={() => { if (window.confirm('Replace this session with an example path? Your current messages and answers will be cleared.')) { selectPath(path.pathId); setReplyCue(false) } }}>{path.pathId === 'ready' ? 'Ready' : path.pathId === 'misconception' ? 'Misconception' : 'Clarification'}</Button>)}</div>{seed && !attempt && <Button className="mt-3" disabled={draft?.seedTurnId === seed.id} onClick={() => { insertExample(); composer.current?.focus() }}>Use example {seed.kind === 'answer' ? 'answer' : 'message'}</Button>}</details>
            <h1 ref={heading} tabIndex={-1} className="mb-4 mt-0 font-display text-3xl font-normal sm:text-4xl">{stepTitle[step.id]}</h1>
            {storage === 'unavailable' && <p className="rounded-control bg-accent-soft p-3 text-sm leading-6">Your progress can’t be saved. Keep learning in this tab. Reloading or closing it may lose your work. Use Retry saving below to try again.</p>}
            {guided && !attempt && <p className="text-sm leading-6 text-muted">Check answer gives feedback. Send asks about this step.</p>}
            {recap ? <SessionRecap session={session} review={review} /> : step.contentBlocks.map(block => <SessionBlock key={block.id} block={block} stepSourceRefs={step.sourceRefs} />)}
            {step.id === 'retry' && <p className="rounded-control bg-accent-soft p-4 leading-6">{session.route.find(entry => entry.id === 'retry')?.reason} Dimmer light means less captured energy available to build sugar.</p>}
            {step.id === 'core' && <details className="mt-5 text-sm leading-6 text-muted"><summary>More about the science</summary><p>{scenario.teachingNotes.g3p}</p><p>{scenario.teachingNotes.conditions}</p></details>}
            {turns.length > 0 && <section aria-label="Messages at this step" className="mt-6 space-y-4">{turns.map(turn => <article key={turn.id} aria-label={turn.speaker === 'tutor' && turn.attemptId ? 'Answer feedback' : undefined} className={`rounded-2xl p-4 ${turn.speaker === 'learner' ? 'ml-5 bg-orbit-soft' : 'mr-5 border border-line bg-surface'}`}><p className="mb-2 mt-0 text-xs font-semibold text-muted">{turn.origin === 'authored' ? 'StudyFellow' : turn.origin === 'example' ? `Example answer${turn.edited ? ' · edited' : ''}` : 'You'}</p><p className="m-0 whitespace-pre-wrap break-words leading-7">{turn.text}</p>{turn.speaker === 'tutor' && turn.attemptId && attempt?.routeReason && <p className="font-semibold">Route changed: {attempt.routeReason}</p>}</article>)}</section>}
            {session.clarification === step.id && <section role="status" className="mt-6 rounded-control border border-line p-4"><p>I can’t clearly check that wording. Explain what light provides and how that helps sugar building. For the two plants, name which makes sugar faster.</p><p>Your answer is kept. Keep working, or continue with help and keep this point unclear.</p></section>}
          </div>
        </div>
          {replyCue && <Button className="session-reply-cue" onClick={() => { if (canvas.current) canvas.current.scrollTop = canvas.current.scrollHeight; following.current = true; setReplyCue(false) }}>New reply ↓</Button>}
        </div>
        <div className="session-dock">
          <div className="mx-auto max-w-3xl">
            
            <div className="session-actions mb-3 flex flex-wrap items-center gap-3">{index > 0 && <Button onClick={() => { setReplyCue(false); move(-1) }}>Back</Button>}{!recap && (session.completed || !guided || attempt) && <Button type="primary" aria-label={next === 'recap' ? 'View summary' : undefined} onClick={() => { setReplyCue(false); move(1) }}>{next === 'recap' ? 'View summary' : 'Continue'}</Button>}{guided && !attempt && !session.help && session.clarification !== step.id && <Button type="primary" disabled={!draft?.text.trim()} onClick={() => respond(() => checkAnswer())}>Check answer</Button>}{guided && !attempt && !session.help && session.clarification === step.id && <><Button type="primary" onClick={() => respond(keepWorking)}>Keep working</Button><Button onClick={() => respond(() => checkAnswer(true))}>Continue with help</Button></>}{guided && !attempt && <Button type={session.help ? 'primary' : 'default'} onClick={() => { help(!session.help); composer.current?.focus() }}>{session.help ? 'Return to answer' : 'Need help?'}</Button>}{recap && <Button type="primary" onClick={() => navigate('/')}>Return home</Button>}</div>
            {!recap && <>{draft?.origin === 'example' && <p className="mb-1 mt-0 text-xs font-semibold text-muted">Example answer{draft.edited ? ' · edited' : ''}</p>}<form className="flex items-end gap-2" onSubmit={event => { event.preventDefault(); if (!draft?.text.trim()) return; respond(send) }}>
              <div className="min-w-0 flex-1"><label htmlFor="session-message" className="sr-only">Message StudyFellow</label><Input.TextArea ref={composer} id="session-message" className={!draft?.text ? 'session-message-empty' : undefined} maxLength={2000} autoSize={{ minRows: 1, maxRows: 4 }} value={draft?.text ?? ''} onChange={event => setDraft(event.target.value)} readOnly={guided && !!attempt && !session.help} placeholder={guided && !session.help ? 'Your answer…' : 'What’s on your mind?'} /></div>
              <Button htmlType="submit" disabled={!draft?.text?.trim()}>Send</Button>
            </form>
            </>}<p aria-live="polite" className="sr-only">{turns.length ? `StudyFellow message ${turns.length / 2} is here.` : ''}</p><SessionSaveNotice compact />
          </div>
        </div>
      </section>
    </div>
  </main>
}
