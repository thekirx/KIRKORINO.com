import { useEffect, useRef } from 'react'

export function ScrollRail() {
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fill = fillRef.current
    if (!fill) return

    let frame = 0
    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      fill.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div aria-hidden="true" className="scroll-rail">
      <div className="scroll-rail-fill" ref={fillRef} />
    </div>
  )
}
