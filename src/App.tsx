import { useState } from 'react'
import { Button, Card, Input, Progress, Tag, Typography } from 'antd'
import { AnimatePresence, motion } from 'motion/react'
import { Link, Route, Routes, useNavigate } from 'react-router'
import { useStudyStore } from './store/study-store'

const { Paragraph, Text, Title } = Typography

function Brand() {
  return <Link className="flex items-center gap-3 !text-ink no-underline" to="/"><span aria-hidden="true" className="grid size-10 place-items-center rounded-control bg-midnight text-lg text-starlight">✦</span><span className="font-semibold tracking-tight">studyfellow<span className="text-accent-ink">.</span></span></Link>
}

function Home() {
  const navigate = useNavigate()
  const completedLessons = useStudyStore((state) => state.completedLessons)
  const [showNote, setShowNote] = useState(false)

  return (
    <main className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8">
      <header className="flex items-center justify-between"><Brand /><Button aria-expanded={showNote} onClick={() => setShowNote(!showNote)}>{showNote ? 'Hide note' : 'How it works'}</Button></header>
      <section className="grid gap-10 pb-12 pt-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-20">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Tag className="mb-5 rounded-full px-3 py-1">YOUR LEARNING SPACE</Tag>
          <Title className="!mb-4 !text-4xl !font-display !font-normal !leading-tight !tracking-tight sm:!text-6xl">Make sense of the things that feel <span className="text-focus">hard.</span></Title>
          <Paragraph className="!max-w-xl !text-base !leading-7 !text-muted sm:!text-lg">Short, guided lessons that meet you where you are, help you practise, and remember what you’ve learned.</Paragraph>
          <div className="mt-7 flex flex-wrap items-center gap-3"><Button type="primary" size="large" className="!h-12 !rounded-full !px-6" onClick={() => navigate('/lesson')}>Continue learning <span aria-hidden="true">→</span></Button><Text className="text-sm text-muted">About 4 minutes</Text></div>
          <AnimatePresence>{showNote && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-5 max-w-lg overflow-hidden rounded-2xl border border-line bg-orbit-soft p-4 text-sm leading-6 text-ink">StudyFellow explains one idea, listens to your reasoning, then adjusts the next example to help you keep going.</motion.div>}</AnimatePresence>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.12 }}>
          <Card className="overflow-hidden !rounded-card !border-0 !shadow-observatory" styles={{ body: { padding: 0 } }}>
            <div className="observatory-panel relative flex min-h-80 flex-col gap-5 p-7 sm:p-9"><span aria-hidden="true" className="absolute right-6 top-6 text-2xl text-starlight">✦</span>
              <div className="relative z-10 max-w-56"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-orbit">UP NEXT · BIOLOGY</span><h2 className="mt-3 font-display text-3xl font-normal leading-tight tracking-tight text-ivory">How plants make their food</h2><p className="mt-3 text-sm leading-6 text-ivory/80">Photosynthesis, one clear step at a time.</p></div>
              <div className="relative z-10 mt-auto rounded-2xl bg-surface p-4 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2 text-sm"><span className="font-medium text-ink">Your learning streak</span><span className="text-focus">{completedLessons} lesson{completedLessons === 1 ? '' : 's'} complete</span></div><Progress percent={Math.min(completedLessons * 25, 100)} showInfo={false} className="mb-0 mt-2" /></div>
            </div>
          </Card>
        </motion.div>
      </section>
      <section className="grid gap-4 border-t border-line pt-8 sm:grid-cols-3">{[['01', 'Understand', 'Start with a simple explanation grounded in a trusted source.'], ['02', 'Try it', 'Work through a small example and share how you think about it.'], ['03', 'Keep going', 'Get a follow-up that responds to your answer and helps it stick.']].map(([number, title, description]) => <article key={number} className="rounded-2xl p-4"><span className="text-xs font-semibold tracking-widest text-focus">{number}</span><h3 className="mb-1 mt-3 font-semibold text-ink">{title}</h3><p className="m-0 text-sm leading-6 text-muted">{description}</p></article>)}</section>
    </main>
  )
}

function Lesson() {
  const navigate = useNavigate()
  const completeLesson = useStudyStore((state) => state.completeLesson)
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className="mx-auto max-w-3xl px-5 pb-16 pt-6 sm:px-8">
      <header className="flex items-center justify-between"><Brand /><span className="text-sm text-muted">BIOLOGY · 4 MIN</span></header>
      <div className="mt-12"><Text className="text-xs font-semibold uppercase tracking-[0.18em] text-focus">A GUIDED LESSON</Text><Title className="!mb-2 !mt-3 !font-display !font-normal !text-4xl !tracking-tight">How does light help a plant make sugar?</Title><Paragraph className="!text-muted">Plants use light energy to help turn water and carbon dioxide into sugar. Let’s connect those pieces.</Paragraph></div>
      <Card className="!mt-7 !rounded-card !border-line"><div className="rounded-2xl bg-orbit-soft p-5 text-center text-lg font-medium leading-8 text-ink sm:text-xl">carbon dioxide + water + <span className="text-accent-ink">light energy</span> → sugar + oxygen</div><p className="mb-0 mt-5 leading-7 text-ink">Leaves capture light energy. The plant changes that energy into a form it can use to build sugar from carbon dioxide. Water also takes part, and oxygen is released.</p><a className="mt-4 inline-block text-sm font-medium text-focus underline underline-offset-4" href="https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis" target="_blank" rel="noreferrer">Explore the OpenStax source ↗</a></Card>
      <Card className="!mt-5 !rounded-card !border-line"><h2 className="mb-2 text-lg font-semibold text-ink">Your turn</h2><p className="mb-4 leading-6 text-muted">If a plant gets less light while water and carbon dioxide stay available, what happens to its sugar production? Why?</p><Input.TextArea aria-label="Your explanation" className="min-h-28" rows={4} placeholder="Write a few words in your own way…" value={answer} onChange={(event) => setAnswer(event.target.value)} />{submitted && <p role="status" className="mt-4 rounded-2xl bg-orbit-soft p-4 leading-6 text-ink">Nice reasoning to practise with. Less light means less captured energy to support sugar building when light is the limiting factor. Can you explain that in your own words?</p>}<div className="mt-4 flex flex-wrap gap-3"><Button type="primary" className="!h-11 !rounded-full !px-5" disabled={!answer.trim()} onClick={() => setSubmitted(true)}>Check my thinking</Button><Button className="!h-11 !rounded-full !px-5" onClick={() => navigate('/')}>Save and leave</Button></div></Card>
      <div className="mt-7 flex justify-between text-sm"><Link className="text-focus" to="/">← Back to learning space</Link><button className="text-muted underline underline-offset-4" onClick={() => { completeLesson(); navigate('/') }}>Finish demo lesson</button></div>
    </main>
  )
}

export default function App() {
  return <Routes><Route path="/" element={<Home />} /><Route path="/lesson" element={<Lesson />} /><Route path="*" element={<Home />} /></Routes>
}
