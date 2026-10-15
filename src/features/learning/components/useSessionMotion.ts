import { useLayoutEffect, useRef, type RefObject } from 'react'
import type { Session } from '../model/session-store'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
function reveal(node: Element, duration: number, delay = 0) {
  if (reduced() || typeof node.animate !== 'function' || !node.getClientRects().length) return
  node.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration, delay, easing: 'ease-out', fill: 'backwards' })
}

/** Route-instance presentation memory; never persisted and never part of evidence. */
export function useSessionMotion(session: Session | null, root: RefObject<HTMLElement | null>) {
  const seen = useRef<{ id: string; steps: Set<string>; routes: Set<string>; turns: Set<number>; previousStep: string } | null>(null)
  useLayoutEffect(() => {
    if (!session || !root.current) { seen.current = null; return }
    const current = seen.current
    if (!current || current.id !== session.id) {
      seen.current = { id: session.id, steps: new Set([session.currentStepId, ...session.route.filter(entry => entry.status === 'completed').map(entry => entry.id)]), routes: new Set(session.route.map(entry => entry.id)), turns: new Set(session.turns.map(turn => turn.id)), previousStep: session.currentStepId }
      return
    }
    const position = (id: string) => session.route.findIndex(entry => entry.id === id)
    const firstForward = session.currentStepId !== current.previousStep && position(session.currentStepId) > position(current.previousStep) && !current.steps.has(session.currentStepId)
    current.steps.add(session.currentStepId)
    current.previousStep = session.currentStepId
    if (firstForward) {
      root.current.querySelectorAll('.session-block').forEach((node, index) => reveal(node, 180, Math.min(index * 30, 90)))
      const cue = root.current.querySelector('[data-completion-cue]')
      if (cue) reveal(cue, 180)
    }
    let routeIndex = 0
    for (const entry of session.route) {
      if (current.routes.has(entry.id)) continue
      current.routes.add(entry.id)
      const delay = routeIndex++ * 35
      root.current.querySelectorAll(`[data-route-entry="${entry.id}"]`).forEach(node => reveal(node, 180, delay))
    }
    for (const turn of session.turns) {
      if (current.turns.has(turn.id)) continue
      current.turns.add(turn.id)
      if (turn.speaker !== 'tutor' || turn.stepId !== session.currentStepId) continue
      const node = root.current.querySelector(`[data-turn-id="${turn.id}"]`)
      if (!node) continue
      reveal(node, 160)
      const success = node.querySelector('[data-feedback-tone="success"]')
      if (success && !reduced() && typeof success.animate === 'function') success.animate([{ opacity: .65 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' })
    }
  }, [session, root])
}

export function usePlanMotion(active: boolean, root: RefObject<HTMLOListElement | null>) {
  const shown = useRef(false)
  useLayoutEffect(() => {
    if (!active || !root.current || shown.current) return
    shown.current = true
    root.current.querySelectorAll('li').forEach((node, index) => reveal(node, 180, Math.min(index * 35, 140)))
  }, [active, root])
}
