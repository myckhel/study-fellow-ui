import { Button } from 'antd'
import { Link, useRouteError } from 'react-router'

export function RouteLoading() {
  return <main className="mx-auto max-w-3xl px-5 py-16"><p role="status" className="text-muted">Opening your lesson…</p></main>
}

export function RouteError() {
  const error = useRouteError()
  // Keep diagnostics in developer tools, not learner-facing copy.
  if (import.meta.env.DEV) console.error('Route failed', error)
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl">We couldn’t open this page</h1>
      <p className="mt-4 text-muted">Check your connection, then reload the page.</p>
      <Button type="primary" onClick={() => window.location.reload()}>Reload page</Button>
      <a className="ml-5 text-focus underline" href="/">Return home</a>
    </main>
  )
}

export function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl">Page not found</h1>
      <p className="mt-4 text-muted">Let’s get you back home.</p>
      <Link className="text-focus underline" to="/">Return home</Link>
    </main>
  )
}
