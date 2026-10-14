import { Button } from 'antd'
import { useSessionStore } from '../model/session-store'
export function SessionSaveNotice({ compact = false }: { compact?: boolean }) {
  const { storage, session, flush, reset } = useSessionStore()
  if (storage === 'old' || storage === 'invalid') return <section role="status" aria-label="Save status" className="my-4 rounded-control border border-line bg-accent-soft p-4 text-sm leading-6"><p className="mt-0">{storage === 'old' ? 'Your earlier saved lesson can’t be opened in this session.' : 'Your saved session can’t be opened.'} It stays here until you choose to clear it.</p><Button onClick={() => { if (window.confirm('Clear saved progress and start again? Your saved answers will be removed.')) reset() }}>Clear saved progress</Button></section>
  if (storage === 'unavailable' && compact) return <div role="status" aria-label="Save status" className="my-2 flex items-center justify-between gap-2 text-xs text-muted"><span>Progress isn’t saved.</span><Button onClick={flush}>Retry saving</Button></div>
  if (storage === 'unavailable') return <section role="status" aria-label="Save status" className="my-3 rounded-control border border-line bg-accent-soft p-3 text-sm leading-6">Progress isn’t saved. You can keep learning in this tab. Reloading or closing it may lose your work. <Button onClick={flush}>Retry saving</Button></section>
  return session ? <p role="status" aria-label="Save status" className="my-2 text-xs leading-5 text-muted">{storage === 'pending' ? 'Saving…' : 'Saved on this browser.'}</p> : null
}
