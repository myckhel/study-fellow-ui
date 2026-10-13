import { useState } from 'react'
import { Button, Tag, Typography } from 'antd'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { Brand } from '@/shared/ui/Brand'
import { useStudyStore } from '../model/study-store'
import { LessonPreview } from '../components/LessonPreview'

const { Paragraph, Text, Title } = Typography

export function Component() {
  const navigate = useNavigate()
  const completedLessons = useStudyStore((state) => state.completedLessons)
  const [showNote, setShowNote] = useState(false)

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8">
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
          <LessonPreview completedLessons={completedLessons} />
        </motion.div>
      </section>
      <section className="grid gap-4 border-t border-line pt-8 sm:grid-cols-3">{[['01', 'Understand', 'Start with a simple explanation grounded in a trusted source.'], ['02', 'Try it', 'Work through a small example and share how you think about it.'], ['03', 'Keep going', 'Get a follow-up that responds to your answer and helps it stick.']].map(([number, title, description]) => <article key={number} className="rounded-2xl p-4"><span className="text-xs font-semibold tracking-widest text-focus">{number}</span><h3 className="mb-1 mt-3 font-semibold text-ink">{title}</h3><p className="m-0 text-sm leading-6 text-muted">{description}</p></article>)}</section>
    </main>
  )
}

