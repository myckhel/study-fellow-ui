import { useEffect, useRef, useState } from 'react'
import { Button, Input, type InputRef } from 'antd'
import { Navigate, useNavigate } from 'react-router'
import { Brand } from '@/shared/ui/Brand'
import { focusedOutcome } from '../content/learner-copy'
import { scenario, stepTitle } from '../content/session-scenario'
import { assessAnswer } from '../model/session-assessment'
import { activeDraft, nextExample, useSessionStore } from '../model/session-store'
import { SessionSaveNotice } from '../components/SessionSaveNotice'
import { useSessionMotion } from '../components/useSessionMotion'
import { AnswerFeedback } from '../components/AnswerFeedback'
import { SessionRecap } from '../components/SessionRecap'
import { SessionBlock } from '../components/SessionBlocks'

const isCheckExample = (kind: string) => kind === 'answer'
export function Component() {
  const { session, setDraft, send, move, reset, storage, check: checkAnswer, help, keepWorking, selectPath, flush, review, useExample: insertExample, attachedResource } = useSessionStore()
  const navigate = useNavigate()
  const heading = useRef<HTMLHeadingElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const composer = useRef<InputRef>(null)
  const following = useRef(true)
  const [replyCue, setReplyCue] = useState(false)
  const [showResourceModal, setShowResourceModal] = useState(false)
  const motionRoot = useRef<HTMLElement>(null)
  useSessionMotion(session, motionRoot)
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
  const answerMode = guided && !attempt && !session.help
  const exampleWords = scenario.examplePaths.flatMap(path => path.inputs.filter(input => input.stepId === step.id && (!attempt || input.kind === 'conversation')).map(input => ({ ...input, pathId: path.pathId })))
  const uniqueExampleWords = exampleWords.filter((item, index) => exampleWords.findIndex(other => other.kind === item.kind && other.text === item.text) === index)
  const exampleLabel = (item: typeof exampleWords[number]) => {
    if (item.kind === 'conversation') return 'Clarification question'
    const result = assessAnswer(item.text, step.id)
    return 'score' in result ? result.score === 2 ? 'Complete answer' : 'Partial answer' : result.category === 'sound' ? 'Complete answer' : result.category === 'material' ? 'Misconception answer' : 'Partial answer'
  }
  const fillExample = (pathId?: string, seedId?: string) => {
    const path = scenario.examplePaths.find(path => path.pathId === (pathId ?? session.examplePath))
    const chosen = seedId ? path?.inputs.find(input => input.id === seedId && input.stepId === step.id) : seed
    if (!chosen) return
    const target = isCheckExample(chosen.kind) ? session.answerDrafts[step.id] : session.drafts[step.id]
    if (target?.text.trim() && !(target.origin === 'example' && target.seedTurnId === chosen.id && target.pathId === path?.pathId && target.text === chosen.text) && !window.confirm('Replace this draft with example words? Your other answer or question will stay here.')) return
    insertExample(pathId, seedId); composer.current?.focus()
  }
  const respond = (action: () => void) => { const nearBottom = following.current; action(); if (!nearBottom) setReplyCue(true); composer.current?.focus() }
  const turns = session.turns.filter(turn => turn.stepId === step.id)
  const next = activeRoute[index + 1]?.id
  const completedCount = activeRoute.filter(entry => entry.status === 'completed').length
  const routeList = <>
    <div className="mb-4 pb-3 border-b border-white/10 hidden md:block">
      <div className="flex items-center justify-between text-[11px] text-orbit mb-2">
        <span className="uppercase tracking-widest text-starlight font-semibold">Observatory Path</span>
        <span>{completedCount} / {activeRoute.length} done</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-starlight transition-all duration-300 rounded-full"
          style={{ width: `${Math.round((completedCount / Math.max(1, activeRoute.length)) * 100)}%` }}
        />
      </div>
    </div>
    <p className="text-xs tracking-widest text-starlight">YOUR STEPS</p>
    <ol className="m-0 list-none space-y-2 p-0">
      {session.route.map((entry, position) => {
        const isCurrent = entry.id === step.id
        const isCompleted = entry.status === 'completed'
        return (
          <li
            key={entry.id}
            data-route-entry={entry.id}
            aria-current={isCurrent ? 'step' : undefined}
            className={`rounded-xl p-3 border transition-all ${
              isCurrent
                ? 'bg-white/12 border-starlight/50 shadow-xs text-ivory ring-1 ring-starlight/20'
                : isCompleted
                ? 'bg-white/5 border-transparent text-ivory/80 hover:bg-white/8'
                : 'border-transparent text-orbit/80 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center">
              <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold mr-2.5 ${
                isCurrent
                  ? 'bg-starlight text-midnight'
                  : isCompleted
                  ? 'bg-success/30 text-emerald-300'
                  : 'bg-white/10 text-orbit'
              }`}>
                {isCompleted ? '✓' : position + 1}
              </span>
              <span className="font-medium text-sm leading-snug">{stepTitle[entry.id]}</span>
            </div>
            <span className="mt-1 block pl-7 text-xs text-orbit">
              {isCurrent
                ? 'Current step'
                : entry.status === 'skipped'
                ? 'Skipped · ' + entry.reason
                : isCompleted
                ? '✓ Completed'
                : entry.reason
                ? 'Added · ' + entry.reason
                : 'Next'}
            </span>
          </li>
        )
      })}
    </ol>
    <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-relaxed text-orbit">
      <p className="m-0">What you’ll learn: {session.interpretation === 'energy' ? focusedOutcome : scenario.inferredOutcome}</p>
    </div>
    {attachedResource && (
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
        <p className="text-[11px] uppercase tracking-wider text-starlight font-semibold m-0 mb-1 flex items-center gap-1.5">
          <span>📄</span>
          <span>Attached Notes</span>
        </p>
        <p className="text-ivory font-medium truncate m-0">{attachedResource.name}</p>
        {attachedResource.size && <p className="text-orbit m-0 mt-0.5 text-[11px]">{attachedResource.size}</p>}
      </div>
    )}
  </>
  return <main ref={motionRoot} id="main-content" className="session-shell" tabIndex={-1}>
    <header className="session-header">
      <Brand />
      <div className="hidden sm:flex items-center gap-2 rounded-full border border-line/80 bg-surface px-3.5 py-1 text-xs shadow-xs">
        <span className="h-2 w-2 rounded-full bg-starlight animate-pulse" />
        <span className="font-semibold text-ink uppercase tracking-wider">{session.originalTopic || 'Photosynthesis'}</span>
        <span className="text-muted/40">·</span>
        <span className="text-muted">Step {index + 1} of {activeRoute.length}</span>
        {attachedResource && (
          <>
            <span className="text-muted/40">·</span>
            <button type="button" onClick={() => setShowResourceModal(true)} className="text-focus hover:underline font-medium flex items-center gap-1 cursor-pointer">
              📄 {attachedResource.name}
            </button>
          </>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={() => { flush(); navigate('/') }} className="!rounded-full !border-line hover:!border-focus">Leave</Button>
        <Button onClick={() => { if (window.confirm('Start again? Your messages, answers and saved progress will be cleared.')) { if (reset()) navigate('/start') } }} className="!rounded-full !border-line hover:!border-danger hover:!text-danger">Reset</Button>
      </div>
    </header>
    <div className="session-body">
      <aside className="session-route-desktop">{routeList}</aside>
      <section className="session-workspace" aria-label="Learning session">
        <details className="session-route-mobile"><summary>Steps · {index + 1} of {activeRoute.length} · {stepTitle[step.id]}</summary><div className="max-h-52 overflow-auto p-4">{routeList}</div></details>
        <div className="session-reading-area"><div ref={canvas} role="region" aria-label="Teaching and conversation" tabIndex={0} className="session-canvas" onScroll={() => { const region = canvas.current!; following.current = region.scrollHeight - region.scrollTop - region.clientHeight < 72; if (following.current) setReplyCue(false) }}>
          <div className="mx-auto max-w-3xl">
            <details key={recap ? 'recap-paths' : 'session-paths'} className="mb-5 rounded-2xl border border-line bg-surface p-3.5 text-sm shadow-xs"><summary className="cursor-pointer font-medium text-focus">Start an example session</summary><p className="mt-2 text-xs text-muted leading-relaxed">Restart with an example route. This clears your current messages and answers.</p><div className="mt-2 flex flex-wrap gap-2">{scenario.examplePaths.map(path => <Button key={path.pathId} size="small" aria-pressed={path.pathId === session.examplePath} className="!rounded-full" onClick={() => { if (window.confirm('Replace this session with an example path? Your current messages and answers will be cleared.')) { selectPath(path.pathId); setReplyCue(false) } }}>Restart with {path.pathId} example</Button>)}</div>{seed && !attempt && <Button size="small" className="mt-3 !rounded-full" disabled={draft?.seedTurnId === seed.id} onClick={() => fillExample()}>Use example {seed.kind === 'answer' ? 'answer' : 'message'}</Button>}</details>
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-line/70 bg-orbit-soft/50 px-3 py-1 text-xs text-focus">
              <span className="font-semibold uppercase tracking-wider">Step {index + 1} of {activeRoute.length}</span>
              <span className="text-muted/40">·</span>
              <span className="text-muted">{step.kind === 'learner-prompt' ? 'Challenge Check' : step.kind === 'recap' ? 'Review & Summary' : 'Lesson'}</span>
            </div>
            <h1 ref={heading} tabIndex={-1} className="mb-4 mt-0 font-display text-3xl font-normal sm:text-4xl text-ink leading-tight">{stepTitle[step.id]}</h1>
            {storage === 'unavailable' && <p className="rounded-control bg-accent-soft p-3 text-sm leading-6">Your progress can’t be saved. Keep learning in this tab. Reloading or closing it may lose your work. Use Retry saving below to try again.</p>}
            {guided && !attempt && <p className="text-sm leading-6 text-muted">{session.help ? 'Ask about this step. Your answer is kept.' : 'Send your answer for feedback, or choose Need help to ask a question.'}</p>}
            {recap ? <SessionRecap session={session} review={review} /> : step.contentBlocks.map(block => <SessionBlock key={block.id} block={block} stepSourceRefs={step.sourceRefs} />)}
            {step.id === 'retry' && <p className="rounded-control bg-accent-soft p-4 leading-6">{session.route.find(entry => entry.id === 'retry')?.reason} Dimmer light means less captured energy available to build sugar.</p>}
            {step.id === 'core' && <details className="mt-5 text-sm leading-6 text-muted"><summary className="cursor-pointer text-focus font-medium">More about the science</summary><p>{scenario.teachingNotes.g3p}</p><p>{scenario.teachingNotes.conditions}</p></details>}
            {turns.length > 0 && <section aria-label="Messages at this step" className="mt-6 space-y-4">{turns.map(turn => <article key={turn.id} data-turn-id={turn.id} aria-label={turn.speaker === 'tutor' && turn.attemptId ? 'Answer feedback' : undefined} className={`rounded-2xl p-4 sm:p-5 transition-all ${turn.speaker === 'learner' ? 'ml-6 sm:ml-12 border border-line/70 bg-orbit-soft/50 shadow-xs' : 'mr-6 sm:mr-12 border border-line bg-surface shadow-observatory'}`}><p className="mb-2.5 mt-0 text-xs font-semibold text-muted flex items-center gap-1.5">{turn.speaker === 'tutor' ? <span className="text-focus">✦</span> : <span>👤</span>}<span>{turn.origin === 'authored' ? 'StudyFellow' : turn.origin === 'example' ? `Example ${turn.attemptId ? 'answer' : 'message'}${turn.edited ? ' · edited' : ''}` : 'You'}</span></p><>{turn.speaker === 'tutor' && turn.attemptId && attempt ? <AnswerFeedback attempt={attempt} /> : <p className="m-0 whitespace-pre-wrap break-words leading-7 text-ink">{turn.text}</p>}</>{turn.speaker === 'tutor' && turn.attemptId && attempt?.routeReason && <p className="mt-3 rounded-lg bg-orbit-soft/70 p-2.5 text-xs font-semibold text-focus m-0">Route changed: {attempt.routeReason}</p>}</article>)}</section>}
            {session.clarification === step.id && <section role="status" className="mt-6 rounded-2xl border border-line bg-surface p-5 shadow-xs"><p className="m-0 text-ink leading-relaxed">I can’t clearly check that wording. Explain what light provides and how that helps sugar building. For the two plants, name which makes sugar faster.</p><p className="mt-2 mb-0 text-xs text-muted">Your answer is kept. Keep working, or continue with help and keep this point unclear.</p></section>}
            {!recap && <>
            {uniqueExampleWords.length > 0 && <details className="mb-3 text-sm"><summary className="cursor-pointer text-focus font-medium">Example words</summary><p className="mt-1 text-xs text-muted">Choose words to put in the box. You can edit them before sending.</p><div className="mt-2 flex flex-wrap gap-2">{uniqueExampleWords.map(item => <Button key={item.id} className="!h-auto !min-h-11 !whitespace-normal !rounded-xl !border-line hover:!border-focus" onClick={() => fillExample(item.pathId, item.id)}>{exampleLabel(item)}</Button>)}</div></details>}
            </>}
          </div>
        </div>
          {replyCue && <Button className="session-reply-cue !rounded-full shadow-md" onClick={() => { if (canvas.current) canvas.current.scrollTop = canvas.current.scrollHeight; following.current = true; setReplyCue(false) }}>New reply ↓</Button>}
        </div>
        <div className="session-dock">
          <div className="mx-auto max-w-3xl">
            <div className="session-actions mb-3 flex flex-wrap items-center gap-2.5">
              {index > 0 && <Button onClick={() => { setReplyCue(false); move(-1) }} className="!rounded-full !border-line hover:!border-focus">Back</Button>}
              {!recap && (session.completed || !guided || attempt) && <Button type="primary" aria-label={next === 'recap' ? 'View summary' : undefined} onClick={() => { setReplyCue(false); move(1) }} className="!rounded-full !px-6 font-semibold shadow-xs">{next === 'recap' ? 'View summary' : 'Continue'}</Button>}
              {guided && !attempt && !session.help && session.clarification === step.id && <><Button type="primary" onClick={() => respond(keepWorking)} className="!rounded-full !px-5 font-semibold">Keep working</Button><Button onClick={() => respond(() => checkAnswer(true))} className="!rounded-full !border-line">Continue with help</Button></>}
              {guided && !attempt && <Button type={session.help ? 'primary' : 'default'} onClick={() => { help(!session.help); composer.current?.focus() }} className="!rounded-full !px-5 font-medium">{session.help ? 'Return to answer' : 'Need help?'}</Button>}
              {recap && <Button type="primary" onClick={() => navigate('/')} className="!rounded-full !px-6 font-semibold">Return home</Button>}
            </div>
            {!recap && <>
              {draft?.origin === 'example' && <p className="mb-1 mt-0 text-xs font-semibold text-muted">Example {answerMode ? 'answer' : 'message'}{draft.edited ? ' · edited' : ''}</p>}
              <form className="flex items-end gap-2.5" onSubmit={event => { event.preventDefault(); if (!draft?.text.trim()) return; respond(answerMode ? () => checkAnswer() : send) }}>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 px-1 flex items-center justify-between text-[11px] text-muted font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${answerMode ? 'bg-starlight' : 'bg-focus'}`} />
                      {answerMode ? 'Answer mode · Checking understanding' : 'Conversation mode · Ask anything'}
                    </span>
                  </div>
                  <label htmlFor="session-message" className="sr-only">Message StudyFellow</label>
                  <Input.TextArea ref={composer} id="session-message" className={!draft?.text ? 'session-message-empty !rounded-2xl' : '!rounded-2xl'} maxLength={2000} autoSize={{ minRows: 1, maxRows: 4 }} value={draft?.text ?? ''} onChange={event => setDraft(event.target.value)} readOnly={guided && !!attempt && !session.help} placeholder={guided && !session.help ? 'Your answer…' : 'What’s on your mind?'} />
                </div>
                <Button htmlType="submit" type={answerMode ? 'primary' : 'default'} disabled={!draft?.text?.trim()} className="!h-11 !rounded-full !px-6 font-medium shadow-xs">Send</Button>
              </form>
            </>}
            <p aria-live="polite" className="sr-only">{turns.length ? `StudyFellow message ${turns.length / 2} is here.` : ''}</p>
            <SessionSaveNotice compact />
          </div>
        </div>
      </section>
    </div>
    {attachedResource && showResourceModal && (
      <div role="dialog" aria-modal="true" aria-label="Attached notes" className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/50 p-4 backdrop-blur-xs">
        <div className="w-full max-w-lg rounded-card border border-line bg-surface p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-line/60 pb-3 mb-4">
            <h2 className="font-display text-xl text-ink m-0 flex items-center gap-2"><span>📄</span><span>{attachedResource.name}</span></h2>
            <Button size="small" onClick={() => setShowResourceModal(false)} className="!rounded-full">Close</Button>
          </div>
          <div className="max-h-72 overflow-auto text-sm leading-relaxed text-ink whitespace-pre-wrap bg-orbit-soft/30 rounded-xl p-4 border border-line/50">
            {attachedResource.content || 'Notes are attached and referenced for this session.'}
          </div>
        </div>
      </div>
    )}
  </main>
}
