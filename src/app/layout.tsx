import { Outlet, ScrollRestoration, useNavigation } from 'react-router'

export function AppLayout() {
  const navigation = useNavigation()
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-50 focus:rounded-control focus:bg-surface focus:p-3 focus:text-ink">Skip to content</a>
      {navigation.state !== 'idle' && <div role="status" className="fixed inset-x-0 top-0 z-40 bg-orbit-soft px-5 py-2 text-center text-sm text-ink">Opening your learning space…</div>}
      <Outlet />
      <ScrollRestoration />
    </>
  )
}
