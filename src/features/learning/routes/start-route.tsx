import { useEffect, useRef, useState } from 'react'
import { Button, Input, type InputRef } from 'antd'
import { useNavigate } from 'react-router'
import { Brand } from '@/shared/ui/Brand'
import { focusedOutcome } from '../content/learner-copy'
import { scenario, stepTitle } from '../content/session-scenario'
import { usePlanMotion } from '../components/useSessionMotion'
import { SessionSaveNotice } from '../components/SessionSaveNotice'
import { useSessionStore, type AttachedResource } from '../model/session-store'

export function Component() {
  const navigate = useNavigate()
  const heading = useRef<HTMLHeadingElement>(null)
  const topicInput = useRef<InputRef>(null)
  const [topic, setTopic] = useState('')
  const [confusion, setConfusion] = useState('')
  const [resource, setResource] = useState<AttachedResource | null>(null)
  const [showNotesArea, setShowNotesArea] = useState(false)
  const [pastedNotes, setPastedNotes] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [phase, setPhase] = useState<'input' | 'diagnosis' | 'plan'>('input')
  const planList = useRef<HTMLOListElement>(null)
  usePlanMotion(phase === 'plan', planList)
  const [unsupported, setUnsupported] = useState(false)
  const [diagnostic, setDiagnostic] = useState('')
  const [correction, setCorrection] = useState('')
  const [energy, setEnergy] = useState(false)
  const [correctionNotice, setCorrectionNotice] = useState('')
  useEffect(() => { heading.current?.focus() }, [phase])
  const sample = () => {
    if (topic.trim() && topic.trim().toLowerCase() !== 'photosynthesis' && !window.confirm('Replace your topic with Photosynthesis? Your question about it will stay here.')) return
    setTopic('Photosynthesis')
    if (!confusion.trim()) setConfusion(scenario.initialLearnerInput)
    setUnsupported(false)
    topicInput.current?.focus()
  }
  const sampleNotes = () => {
    setResource({
      name: 'Photosynthesis_Lecture_Notes.txt',
      size: '12 KB',
      content: 'Chlorophyll absorbs sunlight in thylakoid membranes; converts light energy into chemical carriers (ATP, NADPH); Calvin cycle builds sugar using carbon dioxide and water.',
    })
    if (!topic.trim() || topic.trim().toLowerCase() !== 'photosynthesis') {
      setTopic('Photosynthesis')
      setUnsupported(false)
    }
    if (!confusion.trim()) {
      setConfusion(scenario.initialLearnerInput)
    }
    topicInput.current?.focus()
  }
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const size = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(1, Math.round(file.size / 1024))} KB`
    setResource({ name: file.name, size })
    if (!topic.trim()) {
      if (/photo/i.test(file.name)) {
        setTopic('Photosynthesis')
        setUnsupported(false)
      } else {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        setTopic(cleanName)
      }
    }
  }
  const removeResource = () => {
    setResource(null)
    setPastedNotes('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }
  const diagnosisLabels: Record<string, string> = { matter: 'Water and carbon dioxide supply materials.', light: 'Water, carbon dioxide and light all supply materials.', unsure: 'I’m not sure yet.' }
  const route = energy ? scenario.plan.supportedCorrection.route : scenario.plan.stepIds
  return <main id="main-content" className="mx-auto max-w-4xl px-5 pb-12 pt-6 sm:px-8">
    <header className="flex items-center justify-between gap-3"><Brand /><Button onClick={() => navigate('/')}>Home</Button></header>
    <p className="mb-3 mt-9 text-xs font-semibold tracking-widest text-focus">ONE SHORT SESSION</p>
    <h1 ref={heading} tabIndex={-1} className="mb-6 font-display text-4xl font-normal leading-tight">{phase === 'input' ? 'What feels confusing?' : phase === 'diagnosis' ? 'One quick question' : 'What you’ll learn'}</h1>
    <SessionSaveNotice />
    {phase === 'input' && <section className="rounded-card border border-line bg-surface p-6 sm:p-8 shadow-observatory">
      <form onSubmit={(event) => { event.preventDefault(); if (/^(photosynthesis|how does light help plants (make|build) sugar\??|i know plants need sunlight, but how does light help them make sugar\??)$/i.test(topic.trim())) { setUnsupported(false); setPhase('diagnosis') } else setUnsupported(true) }}>
        <label className="mb-2 block text-sm font-semibold tracking-wide text-ink" htmlFor="topic">Topic or question</label>
        <Input ref={topicInput} id="topic" maxLength={500} size="large" className="!rounded-control" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What would you like to understand?" />
        <label className="mb-2 mt-5 block text-sm font-semibold tracking-wide text-ink" htmlFor="confusion">What’s confusing? (optional)</label>
        <Input.TextArea id="confusion" maxLength={1000} autoSize={{ minRows: 3, maxRows: 5 }} className="!rounded-control" value={confusion} onChange={(e) => setConfusion(e.target.value)} placeholder="Share what feels tricky or where you get stuck..." />

        {/* Note or Resource Upload */}
        <div className="mt-5 rounded-2xl border border-line/80 bg-orbit-soft/20 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-focus flex items-center gap-1.5">
              <span>📄</span>
              <span>Note or resource upload</span>
              <span className="text-muted font-normal normal-case">(optional)</span>
            </span>
            <button
              type="button"
              onClick={() => setShowNotesArea(!showNotesArea)}
              className="text-xs text-focus hover:underline font-medium cursor-pointer"
            >
              {showNotesArea ? 'Hide note text' : 'Or paste text notes'}
            </button>
          </div>
          <p className="text-xs text-muted leading-relaxed mb-3">Upload lecture slides, syllabus, or study notes so StudyFellow can teach directly from your materials.</p>

          {resource ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orbit-soft text-focus text-base">📄</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink m-0">{resource.name}</p>
                  <p className="text-xs text-muted m-0">{resource.size ? `${resource.size} · ` : ''}Ready to guide session</p>
                </div>
              </div>
              <Button size="small" onClick={removeResource} className="shrink-0 !rounded-full !border-line hover:!border-danger hover:!text-danger">Remove</Button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
              role="button"
              tabIndex={0}
              aria-label="Upload note or resource"
              className="group cursor-pointer rounded-xl border-2 border-dashed border-line/80 bg-surface hover:border-focus hover:bg-orbit-soft/30 p-4 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orbit-soft/60 text-focus group-hover:scale-105 transition-transform">📁</span>
                <div>
                  <p className="text-sm font-medium text-ink m-0">Drop note file here or click to browse</p>
                  <p className="text-xs text-muted m-0">Supports PDF, DOCX, TXT, MD, images</p>
                </div>
              </div>
              <Button size="small" className="shrink-0 !rounded-full pointer-events-none">Select file</Button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.txt,.md,.doc,.docx,.png,.jpg,.jpeg"
            onChange={onFileChange}
          />

          {showNotesArea && (
            <div className="mt-3 pt-3 border-t border-line/60">
              <label htmlFor="pasted-notes" className="mb-1 block text-xs font-medium text-muted">Paste notes or text excerpt</label>
              <Input.TextArea
                id="pasted-notes"
                maxLength={5000}
                autoSize={{ minRows: 2, maxRows: 4 }}
                className="!rounded-control text-sm"
                value={pastedNotes}
                onChange={(e) => {
                  const val = e.target.value
                  setPastedNotes(val)
                  if (val.trim()) {
                    setResource({ name: 'Pasted study notes', size: `${val.length} chars`, content: val })
                    if (!topic.trim()) setTopic('Photosynthesis')
                  } else if (resource?.name === 'Pasted study notes') {
                    setResource(null)
                  }
                }}
                placeholder="Paste class notes, definitions, or textbook paragraphs here..."
              />
            </div>
          )}
        </div>

        <Button className="mt-6 !h-12 !rounded-full !px-8 font-medium" type="primary" htmlType="submit" disabled={!topic.trim()}>Continue</Button>
      </form>
      {unsupported && <p role="status" className="mt-5 rounded-control border border-warning/30 bg-accent-soft p-4 leading-6 text-accent-ink">We don’t have a lesson for that topic yet. Your words are still here. Try photosynthesis below.</p>}
      <div className="mt-8 rounded-2xl border border-line/80 bg-orbit-soft/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-focus">Try an example</span>
          <p className="mt-1 text-sm text-ink leading-relaxed">For example: {scenario.initialLearnerInput}</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button onClick={sample} className="!rounded-full !border-line hover:!border-focus">Try photosynthesis</Button>
          <Button onClick={sampleNotes} className="!rounded-full !border-line hover:!border-focus">Attach sample notes</Button>
        </div>
      </div>
    </section>}
    {phase === 'diagnosis' && <section className="rounded-card border border-line bg-surface p-6 sm:p-8 shadow-observatory">
      <div className="mb-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-line/70 bg-orbit-soft/50 px-3.5 py-1 text-xs text-focus">
        <span className="font-semibold uppercase tracking-wider">Photosynthesis</span>
        <span className="text-muted/60">·</span>
        <span className="text-muted">Your words: <span className="break-words font-medium text-ink">{topic}</span></span>
      </div>
      <h2 className="mb-2 font-display text-2xl font-normal text-ink sm:text-3xl">Which supplies materials for making sugar?</h2>
      <p className="mb-6 text-sm leading-relaxed text-muted">This helps choose where to start. It’s okay to skip.</p>
      <div className="flex flex-col items-stretch gap-3.5">
        {scenario.diagnosis.choices.filter(choice => choice.id !== 'skipped').map(choice => (
          <Button
            key={choice.id}
            className="!h-auto !min-h-14 !w-full !justify-start !whitespace-normal !rounded-2xl !border !border-line !bg-surface hover:!border-focus hover:!bg-orbit-soft/30 !p-4 sm:!p-5 !text-left !text-ink !shadow-none focus-visible:!outline-focus text-base leading-relaxed transition-all duration-150"
            onClick={() => { setDiagnostic(choice.id); setEnergy(choice.id === 'light'); setPhase('plan') }}
          >
            {diagnosisLabels[choice.id]}
          </Button>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-line/60 pt-5">
        <Button
          className="!h-10 !rounded-full !border-line !px-5 !text-muted hover:!border-focus hover:!text-ink"
          onClick={() => { setDiagnostic('skipped'); setEnergy(false); setPhase('plan') }}
        >
          Skip question
        </Button>
        <span className="text-xs text-muted">You can always skip and start with the basics</span>
      </div>
    </section>}
    {phase === 'plan' && <section className="grid gap-6 md:grid-cols-[1fr_280px]">
      <div className="rounded-card border border-line bg-surface p-6 sm:p-8 shadow-observatory">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line/70 bg-orbit-soft/50 px-3.5 py-1 text-xs text-focus">
          <span className="font-semibold uppercase tracking-wider">Your Plan</span>
          <span className="text-muted/60">·</span>
          <span className="text-muted">Personalized lesson</span>
        </div>
        <h2 className="mb-3 font-display text-2xl sm:text-3xl font-normal text-ink leading-snug">{energy ? focusedOutcome : scenario.inferredOutcome}</h2>
        <p className="text-base leading-relaxed text-muted mb-4">{energy ? 'We’ll separate light energy from water and carbon dioxide, then connect them to sugar building.' : 'We’ll start with what light supplies, then see how plants use it to build sugar.'}</p>
        <p className="text-sm text-muted mb-6">Your choice: <span className="font-medium text-ink">{diagnostic === 'skipped' ? 'Skip question' : diagnosisLabels[diagnostic]}</span>. We’ll use this to choose where to start.</p>
        <details className="group rounded-2xl border border-line/80 bg-orbit-soft/20 p-4 transition-all duration-200"><summary className="cursor-pointer text-sm font-semibold text-focus select-none flex items-center justify-between"><span>Change the focus</span><span className="text-xs text-muted font-normal group-open:hidden">Customize topic</span></summary>
          <div className="mt-4 pt-3 border-t border-line/60">
            <label htmlFor="correction" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">What should we focus on?</label>
            <Input.TextArea id="correction" maxLength={1000} autoSize={{ minRows: 2, maxRows: 4 }} className="!rounded-control" placeholder="e.g. energy and materials" value={correction} onChange={(e) => setCorrection(e.target.value)} />
            <div className="mt-3 flex flex-wrap gap-2.5">
              <Button className="!rounded-full !border-line hover:!border-focus" onClick={() => { if (/^(energy (versus|vs\.?|and) (matter|materials)|focus on energy and materials|i[’']m confused about energy versus materials\.?)$/i.test(correction.trim())) { setEnergy(true); setCorrectionNotice('We’ll focus on energy and materials. Your words are still here.') } else setCorrectionNotice('We can focus on light or energy and materials. Your words are still here.') }}>Update plan</Button>
              <Button className="!rounded-full !border-line hover:!border-focus" onClick={() => { setEnergy(true); setCorrectionNotice('We’ll focus on energy and materials.') }}>Focus on energy and materials</Button>
              <Button className="!rounded-full !border-line hover:!border-focus" onClick={() => { setEnergy(false); setCorrectionNotice('We’ll focus on light. Your words are still here.') }}>Focus on light</Button>
            </div>
            {correctionNotice && <p role="status" className="mt-3 rounded-xl border border-line/80 bg-accent-soft p-3 text-sm leading-6 text-accent-ink">{correctionNotice}</p>}
          </div>
        </details>
        {resource && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line/70 bg-orbit-soft/50 px-3.5 py-1 text-xs text-focus">
            <span aria-hidden="true">📄</span>
            <span>Attached notes: <strong className="text-ink font-semibold">{resource.name}</strong></span>
          </div>
        )}
        <div className="mt-8 border-t border-line/60 pt-6">
          <p className="mb-4 text-sm leading-relaxed text-muted">You can read the lesson and keep your answers here. Check your answers for feedback, then apply the idea in a new situation.</p>
          <Button type="primary" size="large" className="!h-12 !rounded-full !px-8 text-base font-medium shadow-sm hover:!scale-[1.01] active:!scale-[0.99] transition-transform" onClick={() => {
            const state = useSessionStore.getState(); if ((state.session || state.storage === 'old' || state.storage === 'invalid') && !window.confirm('Replace your saved progress? Your messages and answers will be cleared.')) return
            if (useSessionStore.getState().begin({ topic, confusion, diagnostic, correction, energy, resource })) navigate('/session')
          }}>Begin session</Button>
        </div>
      </div>
      <aside className="observatory-panel relative overflow-hidden rounded-card bg-midnight p-6 sm:p-7 text-ivory shadow-observatory flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span aria-hidden="true" className="text-starlight text-sm">✦</span>
            <p className="text-xs font-semibold tracking-widest text-starlight uppercase m-0">YOUR STEPS</p>
          </div>
          <ol ref={planList} className="space-y-4 pl-4 marker:text-starlight/70">{route.map(id => <li key={id} className="text-sm font-medium leading-snug text-ivory/90 hover:text-ivory transition-colors">{stepTitle[id]}</li>)}</ol>
        </div>
        <div className="mt-8 border-t border-white/10 pt-4">
          <p className="text-xs leading-relaxed text-orbit m-0">One step at a time. You can change the focus before starting.</p>
        </div>
      </aside>
    </section>}
  </main>
}
