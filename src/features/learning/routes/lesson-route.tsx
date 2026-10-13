import { Card, Typography } from 'antd'
import { Link, useNavigate } from 'react-router'
import { Brand } from '@/shared/ui/Brand'
import { useStudyStore } from '../model/study-store'
import { LessonAnswer } from '../components/LessonAnswer'
import { photosynthesis } from '../content/photosynthesis'

const { Paragraph, Text, Title } = Typography

export function Component() {
  const navigate = useNavigate()
  const completeLesson = useStudyStore((state) => state.completeLesson)

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-5 pb-16 pt-6 sm:px-8">
      <header className="flex items-center justify-between"><Brand /><span className="text-sm text-muted">BIOLOGY · 4 MIN</span></header>
      <div className="mt-12"><Text className="text-xs font-semibold uppercase tracking-[0.18em] text-focus">A GUIDED LESSON</Text><Title className="!mb-2 !mt-3 !font-display !font-normal !text-4xl !tracking-tight">How does light help a plant make sugar?</Title><Paragraph className="!text-muted">{photosynthesis.introduction}</Paragraph></div>
      <Card className="!mt-7 !rounded-card !border-line"><div className="rounded-2xl bg-orbit-soft p-5 text-center text-lg font-medium leading-8 text-ink sm:text-xl">carbon dioxide + water + <span className="text-accent-ink">light energy</span> → sugar + oxygen</div><p className="mb-0 mt-5 leading-7 text-ink">{photosynthesis.explanation}</p><a className="mt-4 inline-block text-sm font-medium text-focus underline underline-offset-4" href={photosynthesis.source.url} target="_blank" rel="noreferrer">Explore the {photosynthesis.source.label} source ↗</a></Card>
      <LessonAnswer onLeave={() => navigate('/')} />
      <div className="mt-7 flex justify-between text-sm"><Link className="text-focus" to="/">← Back to learning space</Link><button className="text-muted underline underline-offset-4" onClick={() => { completeLesson(); navigate('/') }}>Finish demo lesson</button></div>
    </main>
  )
}

