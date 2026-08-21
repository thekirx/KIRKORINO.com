import { useRef, type PointerEvent as ReactPointerEvent } from 'react'

const shiftLimit = 24

function clampShift(value: number) {
  return Math.round(Math.max(-shiftLimit, Math.min(shiftLimit, value)))
}

function setTitleShift(title: HTMLHeadingElement, x: number, y: number) {
  const kirkX = clampShift(x)
  const kirkY = clampShift(y)

  title.style.setProperty('--kirk-shift-x', `${kirkX}px`)
  title.style.setProperty('--kirk-shift-y', `${kirkY}px`)
  title.style.setProperty('--orino-shift-x', `${Math.round(kirkX * -0.45)}px`)
  title.style.setProperty('--orino-shift-y', `${Math.round(kirkY * -0.45)}px`)
}

export function FluidHeroTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number } | null>(null)

  const startDrag = (event: ReactPointerEvent<HTMLHeadingElement>) => {
    if (event.pointerType === 'mouse' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY }
    event.currentTarget.setPointerCapture?.(event.pointerId)
    event.currentTarget.classList.add('is-dragging')
  }

  const moveTitle = (event: ReactPointerEvent<HTMLHeadingElement>) => {
    const drag = dragRef.current
    const title = titleRef.current
    if (!drag || !title || drag.pointerId !== event.pointerId) return

    setTitleShift(title, event.clientX - drag.startX, event.clientY - drag.startY)
  }

  const resetTitle = () => {
    const title = titleRef.current
    if (!title || !dragRef.current) return

    dragRef.current = null
    setTitleShift(title, 0, 0)
    title.classList.remove('is-dragging')
  }

  return (
    <h1
      ref={titleRef}
      className="hero-title"
      onPointerDown={startDrag}
      onPointerMove={moveTitle}
      onPointerUp={resetTitle}
      onPointerCancel={resetTitle}
    >
      <span className="hero-word hero-word-kirk"><span className="hero-word-text">Kirk</span></span>{' '}
      <span className="hero-word hero-word-orino"><span className="hero-word-text">Orino</span></span>
    </h1>
  )
}
