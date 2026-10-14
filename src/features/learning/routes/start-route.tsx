import { useEffect, useRef, useState } from 'react'
import { Button, Input } from 'antd'
import { useNavigate } from 'react-router'
import { Brand } from '@/shared/ui/Brand'
import { focusedOutcome } from '../content/learner-copy'
import { scenario, stepTitle } from '../content/session-scenario'
import { SessionSaveNotice } from '../components/SessionSaveNotice'
import { useSessionStore } from '../model/session-store'

export function Component() {
  const navigate = useNavigate()
  const heading = useRef<HTMLHeadingElement>(null)
  const [topic, setTopic] = useState('')
  const [confusion, setConfusion] = useState('')
  const [phase, setPhase] = useState<'input' | 'diagnosis' | 'plan'>('input')
  const [unsupported, setUnsupported] = useState(false)
  const [diagnostic, setDiagnostic] = useState('')
  const [correction, setCorrection] = useState('')
  const [energy, setEnergy] = useState(false)
  const [correctionNotice, setCorrectionNotice] = useState('')
  useEffect(() => { heading.current?.focus() }, [phase])
  const sample = () => {
    if (!topic.trim()) setTopic(scenario.initialLearnerInput)
    setUnsupported(false)
    setPhase('diagnosis')
  }
  const route = energy ? scenario.plan.supportedCorrection.route : scenario.plan.stepIds
  return <main id="main-content" className="mx-auto max-w-4xl px-5 pb-12 pt-6 sm:px-8">
    <header className="flex items-center justify-between gap-3"><Brand /><Button onClick={() => navigate('/')}>Home</Button></header>
    <p className="mb-3 mt-9 text-xs font-semibold tracking-widest text-focus">ONE SHORT SESSION</p>
    <h1 ref={heading} tabIndex={-1} className="mb-3 font-display text-4xl font-normal">{phase === 'input' ? 'What feels confusing?' : phase === 'diagnosis' ? 'One quick question' : 'What you’ll learn'}</h1>
    <p className="mb-6 leading-7 text-muted">Photosynthesis is the only topic available right now. Your progress is saved on this browser when saving is available.</p>
    <SessionSaveNotice />
    {phase === 'input' && <section className="rounded-card border border-line bg-surface p-5 sm:p-7">
      <form onSubmit={(event) => { event.preventDefault(); if (/^(photosynthesis|how does light help plants (make|build) sugar\??|i know plants need sunlight, but how does light help them make sugar\??)$/i.test(topic.trim())) sample(); else setUnsupported(true) }}>
        <label className="mb-2 block font-medium" htmlFor="topic">Topic or question</label>
        <Input id="topic" maxLength={500} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What would you like to understand?" />
        <label className="mb-2 mt-5 block font-medium" htmlFor="confusion">What’s confusing? (optional)</label>
        <Input.TextArea id="confusion" maxLength={1000} autoSize={{ minRows: 2, maxRows: 4 }} value={confusion} onChange={(e) => setConfusion(e.target.value)} />
        <Button className="mt-5" type="primary" htmlType="submit" disabled={!topic.trim()}>Show my plan</Button>
      </form>
      {unsupported && <p role="status" className="rounded-control bg-accent-soft p-4 leading-6">We don’t have a lesson for that topic yet. Your words are still here. Try photosynthesis below.</p>}
      <div className="mt-6 border-t border-line pt-5"><p className="leading-6">For example: {scenario.initialLearnerInput}</p><Button onClick={sample}>Try photosynthesis</Button></div>
    </section>}
    {phase === 'diagnosis' && <section className="rounded-card border border-line bg-surface p-5 sm:p-7">
      <p className="text-sm text-muted">Learning about photosynthesis. Your words: <span className="break-words text-ink">{topic}</span></p>
      <h2 className="text-xl font-medium">{scenario.diagnosis.question}</h2>
      <p className="text-sm leading-6 text-muted">This helps choose where to start. It’s okay to skip.</p>
      <div className="flex flex-col items-start gap-3">{scenario.diagnosis.choices.map(choice => <Button key={choice.id} className="!h-auto !min-h-11 !max-w-full !whitespace-normal !text-left" onClick={() => { setDiagnostic(choice.id); setEnergy(choice.id === 'light'); setPhase('plan') }}>{choice.id === 'skipped' ? 'Skip question' : choice.text}</Button>)}</div>
    </section>}
    {phase === 'plan' && <section className="grid gap-6 md:grid-cols-[1fr_264px]">
      <div className="rounded-card border border-line bg-surface p-5 sm:p-7">

        <h2 className="font-display text-3xl font-normal">{energy ? focusedOutcome : scenario.inferredOutcome}</h2>
        <p className="leading-7">{energy ? 'We’ll separate light energy from water and carbon dioxide, then connect them to sugar building.' : 'We’ll start with what light supplies, then see how plants use it to build sugar.'}</p>
        <p className="text-sm text-muted">Your choice: {diagnostic === 'skipped' ? 'Skip question' : scenario.diagnosis.choices.find(c => c.id === diagnostic)?.text}. We’ll use this to choose where to start.</p>
        <details className="mt-5 border-t border-line pt-2"><summary className="cursor-pointer text-focus">Change the focus</summary>
          <label htmlFor="correction" className="my-2 block">What should we focus on?</label><Input.TextArea id="correction" maxLength={1000} autoSize={{ minRows: 2, maxRows: 4 }} value={correction} onChange={(e) => setCorrection(e.target.value)} />
          <div className="mt-3 flex flex-wrap gap-3"><Button onClick={() => { if (/^(energy (versus|vs\.?|and) (matter|materials)|focus on energy and materials|i[’']m confused about energy versus materials\.?)$/i.test(correction.trim())) { setEnergy(true); setCorrectionNotice('We’ll focus on energy and materials. Your words are still here.') } else setCorrectionNotice('We can focus on light or energy and materials. Your words are still here.') }}>Update plan</Button><Button onClick={() => { setEnergy(true); setCorrectionNotice('We’ll focus on energy and materials.') }}>Focus on energy and materials</Button><Button onClick={() => { setEnergy(false); setCorrectionNotice('We’ll focus on light. Your words are still here.') }}>Focus on light</Button></div>
          {correctionNotice && <p role="status" className="leading-6">{correctionNotice}</p>}
        </details>
        <p className="mt-6 text-sm leading-6 text-muted">You can read the lesson and keep your answers here. Check your answers for feedback, then apply the idea in a new situation.</p>
        <Button type="primary" size="large" onClick={() => {
          const state = useSessionStore.getState(); if ((state.session || state.storage === 'old' || state.storage === 'invalid') && !window.confirm('Replace your saved progress? Your messages and answers will be cleared.')) return
          if (useSessionStore.getState().begin({ topic, confusion, diagnostic, correction, energy })) navigate('/session')
        }}>Begin session</Button>
      </div>
      <aside className="rounded-card bg-midnight p-6 text-ivory"><p className="text-xs tracking-widest text-starlight">YOUR STEPS</p><ol className="space-y-5 pl-5">{route.map(id => <li key={id}>{stepTitle[id]}</li>)}</ol><p className="text-sm leading-6 text-orbit">One step at a time. You can change the focus before starting.</p></aside>
    </section>}
  </main>
}
