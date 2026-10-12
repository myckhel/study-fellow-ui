import { useState } from 'react'
import { Button, Card, Progress, Tag, Typography } from 'antd'
import { AnimatePresence, motion } from 'motion/react'
import { Link, Route, Routes, useNavigate } from 'react-router'
import { useStudyStore } from './store/study-store'

const { Paragraph, Text, Title } = Typography

function Brand() {
  return <Link className="flex items-center gap-3 text-slate-900 no-underline" to="/"><span aria-hidden="true" className="grid size-10 place-items-center rounded-2xl bg-emerald-950 text-lg text-white">✳</span><span className="font-semibold tracking-tight">studyfellow<span className="text-emerald-700">.</span></span></Link>
}

function Home() {
  const navigate = useNavigate()
  const completedLessons = useStudyStore((state) => state.completedLessons)
  const [showNote, setShowNote] = useState(false)

  return (
    <main className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8">
      <header className="flex items-center justify-between"><Brand /><button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600" onClick={() => setShowNote(!showNote)}>{showNote ? 'Hide note' : 'How it works'}</button></header>
      <section className="grid gap-10 pb-12 pt-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-20">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Tag color="green" className="mb-5 rounded-full px-3 py-1">YOUR LEARNING SPACE</Tag>
          <Title className="!mb-4 !text-4xl !font-semibold !leading-tight !tracking-tight sm:!text-6xl">Make sense of the things that feel <span className="text-emerald-800">hard.</span></Title>
          <Paragraph className="!max-w-xl !text-base !leading-7 !text-slate-600 sm:!text-lg">Short, guided lessons that meet you where you are, help you practise, and remember what you’ve learned.</Paragraph>
          <div className="mt-7 flex flex-wrap items-center gap-3"><Button type="primary" size="large" className="!h-12 !rounded-full !bg-emerald-950 !px-6" onClick={() => navigate('/lesson')}>Continue learning <span aria-hidden="true">→</span></Button><Text className="text-sm text-slate-500">About 4 minutes</Text></div>
          <AnimatePresence>{showNote && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-5 max-w-lg overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">StudyFellow explains one idea, listens to your reasoning, then adjusts the next example to help you keep going.</motion.div>}</AnimatePresence>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.12 }}>
          <Card className="overflow-hidden !rounded-[2rem] !border-0 !bg-[#e8f1e9] !shadow-sm" styles={{ body: { padding: 0 } }}>
            <div className="relative min-h-80 p-7 sm:p-9"><div className="absolute -right-10 -top-16 size-56 rounded-full bg-lime-200/70" /><div className="absolute bottom-0 right-8 h-44 w-36 rounded-t-full bg-emerald-900" /><div className="absolute bottom-0 right-28 h-32 w-28 rounded-t-full bg-emerald-700" />
              <div className="relative z-10 max-w-56"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900/65">UP NEXT · BIOLOGY</span><h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-emerald-950">How plants make their food</h2><p className="mt-3 text-sm leading-6 text-emerald-950/70">Photosynthesis, one clear step at a time.</p></div>
              <div className="absolute bottom-6 left-6 right-6 z-10 rounded-2xl bg-white/90 p-4 shadow-sm backdrop-blur sm:left-8 sm:right-8"><div className="flex items-center justify-between text-sm"><span className="font-medium text-slate-800">Your learning streak</span><span className="text-emerald-800">{completedLessons} lesson{completedLessons === 1 ? '' : 's'} complete</span></div><Progress percent={Math.min(completedLessons * 25, 100)} showInfo={false} strokeColor="#166534" trailColor="#e2e8f0" className="mb-0 mt-2" /></div>
            </div>
          </Card>
        </motion.div>
      </section>
      <section className="grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-3">{[['01', 'Understand', 'Start with a simple explanation grounded in a trusted source.'], ['02', 'Try it', 'Work through a small example and share how you think about it.'], ['03', 'Keep going', 'Get a follow-up that responds to your answer and helps it stick.']].map(([number, title, description]) => <article key={number} className="rounded-2xl p-4"><span className="text-xs font-semibold tracking-widest text-emerald-700">{number}</span><h3 className="mb-1 mt-3 font-semibold text-slate-900">{title}</h3><p className="m-0 text-sm leading-6 text-slate-600">{description}</p></article>)}</section>
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
      <header className="flex items-center justify-between"><Brand /><span className="text-sm text-slate-500">BIOLOGY · 4 MIN</span></header>
      <div className="mt-12"><Text className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">A GUIDED LESSON</Text><Title className="!mb-2 !mt-3 !text-4xl !tracking-tight">How does light help a plant make sugar?</Title><Paragraph className="!text-slate-600">Plants use light energy to help turn water and carbon dioxide into sugar. Let’s connect those pieces.</Paragraph></div>
      <Card className="!mt-7 !rounded-3xl !border-slate-200"><div className="rounded-2xl bg-emerald-50 p-5 text-center text-lg font-medium leading-8 text-emerald-950 sm:text-xl">carbon dioxide + water + <span className="text-amber-700">light energy</span> → sugar + oxygen</div><p className="mb-0 mt-5 leading-7 text-slate-700">Leaves capture light energy. The plant changes that energy into a form it can use to build sugar from carbon dioxide. Water also takes part, and oxygen is released.</p><a className="mt-4 inline-block text-sm font-medium text-emerald-800 underline underline-offset-4" href="https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis" target="_blank" rel="noreferrer">Explore the OpenStax source ↗</a></Card>
      <Card className="!mt-5 !rounded-3xl !border-slate-200"><h2 className="mb-2 text-lg font-semibold text-slate-900">Your turn</h2><p className="mb-4 leading-6 text-slate-600">If a plant gets less light while water and carbon dioxide stay available, what happens to its sugar production? Why?</p><textarea aria-label="Your explanation" className="min-h-28 w-full resize-y rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" placeholder="Write a few words in your own way…" value={answer} onChange={(event) => setAnswer(event.target.value)} />{submitted && <p role="status" className="mt-4 rounded-2xl bg-emerald-50 p-4 leading-6 text-emerald-950">Nice reasoning to practise with. Less light means less captured energy to support sugar building when light is the limiting factor. Can you explain that in your own words?</p>}<div className="mt-4 flex flex-wrap gap-3"><Button type="primary" className="!h-11 !rounded-full !bg-emerald-950 !px-5" disabled={!answer.trim()} onClick={() => setSubmitted(true)}>Check my thinking</Button><Button className="!h-11 !rounded-full !px-5" onClick={() => navigate('/')}>Save and leave</Button></div></Card>
      <div className="mt-7 flex justify-between text-sm"><Link className="text-emerald-800" to="/">← Back to learning space</Link><button className="text-slate-500 underline underline-offset-4" onClick={() => { completeLesson(); navigate('/') }}>Finish demo lesson</button></div>
    </main>
  )
}

export default function App() {
  return <Routes><Route path="/" element={<Home />} /><Route path="/lesson" element={<Lesson />} /><Route path="*" element={<Home />} /></Routes>
}
