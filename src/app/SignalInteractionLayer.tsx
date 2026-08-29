import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const interactiveSelector = 'a, button, select, input, textarea, [role="button"]'
const magneticSelector = '.workspace-primary-action, .workspace-secondary-action, .workspace-system-rail nav a'

export function SignalInteractionLayer() {
  const location = useLocation()

  useEffect(() => {
    const finePointer = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches
    const reducedMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reducedMotion) return

    const root = document.documentElement
    root.classList.add('has-relay-signal-cursor')

    let magneticTarget: HTMLElement | null = null
    const clearMagnet = () => {
      magneticTarget?.style.removeProperty('--magnet-x')
      magneticTarget?.style.removeProperty('--magnet-y')
      magneticTarget = null
    }

    const onPointerMove = (event: PointerEvent) => {
      root.style.setProperty('--signal-x', `${event.clientX}px`)
      root.style.setProperty('--signal-y', `${event.clientY}px`)
      root.classList.add('relay-cursor-visible')

      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(interactiveSelector)
      root.dataset.signalMode = target ? 'link' : 'default'

      const nextMagnet = (event.target as HTMLElement | null)?.closest<HTMLElement>(magneticSelector) ?? null
      if (nextMagnet !== magneticTarget) clearMagnet()
      if (!nextMagnet) return

      magneticTarget = nextMagnet
      const rect = nextMagnet.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 5
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 4
      nextMagnet.style.setProperty('--magnet-x', `${x}px`)
      nextMagnet.style.setProperty('--magnet-y', `${y}px`)
    }

    const onPointerDown = () => root.classList.add('relay-cursor-pressed')
    const onPointerUp = () => root.classList.remove('relay-cursor-pressed')
    const onPointerLeave = () => {
      root.classList.remove('relay-cursor-visible')
      clearMagnet()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    document.addEventListener('mouseleave', onPointerLeave)

    return () => {
      clearMagnet()
      root.classList.remove('has-relay-signal-cursor', 'relay-cursor-visible', 'relay-cursor-pressed')
      delete root.dataset.signalMode
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('mouseleave', onPointerLeave)
    }
  }, [])

  return (
    <>
      <div className="relay-signal-cursor" aria-hidden="true">
        <i className="relay-signal-cursor__halo" />
        <i className="relay-signal-cursor__core" />
        <i className="relay-signal-cursor__node relay-signal-cursor__node--a" />
        <i className="relay-signal-cursor__node relay-signal-cursor__node--b" />
        <span>指针</span>
      </div>
      <i key={location.pathname} className="workspace-route-scan" aria-hidden="true" />
    </>
  )
}
