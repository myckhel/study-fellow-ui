import { Card, Progress } from 'antd'

export function LessonPreview({ completedLessons }: { completedLessons: number }) {
  return (
          <Card className="overflow-hidden !rounded-card !border-0 !shadow-observatory" styles={{ body: { padding: 0 } }}>
            <div className="observatory-panel relative flex min-h-80 flex-col gap-5 p-7 sm:p-9"><span aria-hidden="true" className="absolute right-6 top-6 text-2xl text-starlight">✦</span>
              <div className="relative z-10 max-w-56"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-orbit">UP NEXT · BIOLOGY</span><h2 className="mt-3 font-display text-3xl font-normal leading-tight tracking-tight text-ivory">How plants make their food</h2><p className="mt-3 text-sm leading-6 text-ivory/80">Photosynthesis, one clear step at a time.</p></div>
              <div className="relative z-10 mt-auto rounded-2xl bg-surface p-4 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2 text-sm"><span className="font-medium text-ink">Your learning streak</span><span className="text-focus">{completedLessons} lesson{completedLessons === 1 ? '' : 's'} complete</span></div><Progress percent={Math.min(completedLessons * 25, 100)} showInfo={false} className="mb-0 mt-2" /></div>
            </div>
          </Card>
  )
}
