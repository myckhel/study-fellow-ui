import type { ReactNode } from 'react'
export type IconName =
  | 'sun'
  | 'energy'
  | 'sugar'
  | 'water'
  | 'leaf'
  | 'topic'
  | 'resource'
  | 'goal'
  | 'time'
  | 'check'
  | 'question'
  | 'arrow'
const paths: Record<IconName, ReactNode> = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),
  energy: <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />,
  sugar: (
    <>
      <path d="m12 3 9 5v9l-9 5-9-5V8l9-5Zm0 10v9M3 8l9 5 9-5" />
      <path d="m7.5 5.5 9 5" />
    </>
  ),
  water: (
    <path d="M12 2C9 6 5 10 5 14a7 7 0 0 0 14 0c0-4-4-8-7-12Zm-4 13c0 2 1 3 3 3" />
  ),
  leaf: (
    <>
      <path d="M20 3C5 2 2 10 6 16c7 6 15 0 14-13ZM4 21 16 9" />
      <path d="m10 15-1-5m5 1 4 1" />
    </>
  ),
  topic: (
    <>
      <path d="M4 4h7v16H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm7 0h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-9M6 8h2m-2 4h2m7-4h3m-3 4h3" />
    </>
  ),
  resource: (
    <>
      <path d="M6 2h8l5 5v15H6V2Zm8 0v6h5M9 12h7m-7 4h7" />
    </>
  ),
  goal: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  time: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 3" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m7 12 3 3 7-7" />
    </>
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3v.1" />
    </>
  ),
  arrow: <path d="M3 12h18m-7-7 7 7-7 7" />,
}
export function LearningIcon({
  name,
  className = '',
}: {
  name: IconName
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block h-5 w-5 shrink-0 ${className}`}
    >
      {paths[name]}
    </svg>
  )
}
export function EnergyFlow({ compact = false }: { compact?: boolean }) {
  return (
    <figure
      className={`my-5 ${compact ? '' : 'rounded-2xl border border-line bg-orbit-soft p-4 sm:p-5'}`}
      aria-label="Captured light becomes chemical energy that supports sugar building. Water and carbon dioxide are matter inputs."
    >
      <div
        className={
          compact
            ? 'grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-1 sm:gap-3'
            : 'flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-start sm:gap-3'
        }
      >
        {[
          ['sun', 'Light', 'captured'],
          ['energy', 'Chemical energy', 'carriers'],
          ['sugar', 'Sugar', 'built from CO₂'],
        ].map(([icon, label, note], i) => (
          <div key={label} className="contents">
            {i > 0 && (
              <LearningIcon
                name="arrow"
                className={
                  compact
                    ? 'mt-5 h-4 w-4 text-orbit'
                    : 'mx-auto h-4 w-4 rotate-90 text-orbit sm:mt-5 sm:rotate-0'
                }
              />
            )}
            <div
              className={
                compact
                  ? 'min-w-0 text-center'
                  : 'flex min-w-0 items-center gap-3 text-left sm:block sm:text-center'
              }
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${compact ? 'mx-auto mb-3' : 'sm:mx-auto sm:mb-3'} ${compact ? 'bg-ivory/10 text-starlight' : 'bg-surface text-accent-ink shadow-sm'}`}
              >
                <LearningIcon name={icon as IconName} className="!h-7 !w-7" />
              </div>
              <div>
                <p className="m-0 text-sm font-semibold leading-5">{label}</p>
                <p
                  className={`mb-0 mt-1 text-xs leading-5 ${compact ? 'text-ivory/70' : 'text-muted'}`}
                >
                  {note}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!compact && (
        <figcaption className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-line pt-4 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <LearningIcon name="water" /> Water
          </span>
          <span className="rounded-full border border-line px-2 text-xs font-semibold">
            CO₂
          </span>
          <span>Materials · oxygen released</span>
        </figcaption>
      )}
    </figure>
  )
}
