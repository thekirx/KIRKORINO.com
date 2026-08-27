import { useEffect } from 'react'

/**
 * Reveals [data-reveal] and [data-reveal-split] content as it enters the viewport.
 *
 * Reveals are marked with data-revealed, not a class. React owns the className
 * prop and rewrites it whenever a component re-renders, which silently strips an
 * imperatively-added class and drops the element back to opacity 0 forever.
 *
 * IntersectionObserver alone is not enough: it only reports threshold crossings
 * sampled per frame, so a fast scroll (a flick, a scrollbar drag, a restored
 * scroll position) can carry an element from below the fold to above it between
 * two frames. No crossing is ever observed and the content stays invisible
 * permanently. The scroll pass below is the safety net — it reveals anything
 * that has reached or passed the fold, whether or not the observer saw it.
 */
export function MotionObserver() {
  useEffect(() => {
    const elements = new Set(
      document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-split]'),
    )
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion || typeof IntersectionObserver !== 'function') {
      elements.forEach((element) => { element.dataset.revealed = 'true' })
      return
    }

    const reveal = (element: HTMLElement) => {
      element.dataset.revealed = 'true'
      elements.delete(element)
      observer.unobserve(element)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })

    let frame = 0
    const sweep = () => {
      frame = 0
      const fold = window.innerHeight * 0.92
      for (const element of [...elements]) {
        if (element.getBoundingClientRect().top < fold) reveal(element)
      }
      if (elements.size === 0) window.removeEventListener('scroll', onScroll)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(sweep)
    }

    elements.forEach((element) => observer.observe(element))
    document.documentElement.classList.add('motion-enabled')
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    sweep()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
      document.documentElement.classList.remove('motion-enabled')
    }
  }, [])

  return null
}
