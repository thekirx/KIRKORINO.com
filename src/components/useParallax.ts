import { useEffect } from 'react'

/**
 * Drifts every [data-parallax] image inside its frame as the page scrolls,
 * so project art moves against the block that contains it.
 */
export function useParallax() {
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    if (targets.length === 0) return

    let frame = 0
    const update = () => {
      frame = 0
      const viewport = window.innerHeight
      for (const target of targets) {
        const rect = target.getBoundingClientRect()
        if (rect.bottom < -200 || rect.top > viewport + 200) continue
        const centre = rect.top + rect.height / 2
        const offset = (centre - viewport / 2) / viewport
        target.style.setProperty('--parallax', `${(offset * -3.2).toFixed(2)}%`)
      }
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
}
