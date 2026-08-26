import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  value: number
}

export function CountUp({ value }: CountUpProps) {
  const [shown, setShown] = useState(value)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver !== 'function') return

    setShown(0)
    let frame = 0

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (!entry?.isIntersecting) return
      observer.disconnect()

      const start = performance.now()
      const duration = 1100
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setShown(Math.round(value * eased))
        if (progress < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }, { threshold: 0.4 })

    observer.observe(element)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return <span ref={ref}>{shown}</span>
}
