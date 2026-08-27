import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { featuredProjects } from '../content/projects'
import { HeroWordArt } from './HeroWordArt'

const heroArt = featuredProjects.map(({ preview }) => preview).filter(Boolean)

/** How far a deliberate drag may throw the words. */
const dragLimit = 24
/** How far the words drift from hovering alone — small enough to read as craft. */
const parallaxLimit = 10

function prefersReducedMotion() {
  return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
}

function clamp(value: number, limit: number) {
  return Math.round(Math.max(-limit, Math.min(limit, value)))
}

function setTitleShift(title: HTMLHeadingElement, x: number, y: number, limit: number) {
  const kirkX = clamp(x, limit)
  const kirkY = clamp(y, limit)

  title.style.setProperty('--kirk-shift-x', `${kirkX}px`)
  title.style.setProperty('--kirk-shift-y', `${kirkY}px`)
  title.style.setProperty('--orino-shift-x', `${Math.round(kirkX * -0.45)}px`)
  title.style.setProperty('--orino-shift-y', `${Math.round(kirkY * -0.45)}px`)
}

export function FluidHeroTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number } | null>(null)

  const startDrag = (event: ReactPointerEvent<HTMLHeadingElement>) => {
    if (prefersReducedMotion()) return

    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY }
    event.currentTarget.setPointerCapture?.(event.pointerId)
    event.currentTarget.dataset.dragging = 'true'
    delete event.currentTarget.dataset.tracking
  }

  const moveTitle = (event: ReactPointerEvent<HTMLHeadingElement>) => {
    const title = titleRef.current
    if (!title || prefersReducedMotion()) return

    const drag = dragRef.current
    if (drag) {
      if (drag.pointerId !== event.pointerId) return
      setTitleShift(title, event.clientX - drag.startX, event.clientY - drag.startY, dragLimit)
      return
    }

    // Hover parallax is for pointing devices; touch users get the drag instead.
    if (event.pointerType !== 'mouse') return

    const rect = title.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const fromCentreX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const fromCentreY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)

    title.dataset.tracking = 'true'
    setTitleShift(title, fromCentreX * parallaxLimit, fromCentreY * parallaxLimit, parallaxLimit)
  }

  const releaseDrag = () => {
    const title = titleRef.current
    if (!title || !dragRef.current) return

    dragRef.current = null
    setTitleShift(title, 0, 0, dragLimit)
    delete title.dataset.dragging
  }

  const restTitle = () => {
    const title = titleRef.current
    if (!title) return

    dragRef.current = null
    setTitleShift(title, 0, 0, dragLimit)
    delete title.dataset.dragging
    delete title.dataset.tracking
  }

  return (
    <h1
      ref={titleRef}
      aria-label="Kirk Orino"
      className="hero-title"
      onPointerCancel={restTitle}
      onPointerDown={startDrag}
      onPointerLeave={restTitle}
      onPointerMove={moveTitle}
      onPointerUp={releaseDrag}
    >
      <span className="hero-word hero-word-kirk"><span className="hero-word-text"><HeroWordArt sources={heroArt} word="Kirk" /></span></span>{' '}
      <span className="hero-word hero-word-orino"><span className="hero-word-text">Orino</span></span>
    </h1>
  )
}
