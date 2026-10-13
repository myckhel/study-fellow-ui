import { Link } from 'react-router'

export function Brand() {
  return <Link className="flex items-center gap-3 !text-ink no-underline" to="/"><span aria-hidden="true" className="grid size-10 place-items-center rounded-control bg-midnight text-lg text-starlight">✦</span><span className="font-semibold tracking-tight">studyfellow<span className="text-accent-ink">.</span></span></Link>
}

