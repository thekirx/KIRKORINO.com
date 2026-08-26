import { useEffect, useRef, useState } from 'react'
import { featuredProjects } from '../content/projects'

export function ProjectIndex() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  // Scrolling does not move the pointer, so the browser may never fire
  // pointerleave on the row underneath it. Without this the index stays stuck
  // dimmed and the preview stays pinned on screen after the section scrolls by.
  useEffect(() => {
    if (activeSlug === null) return

    const clear = () => setActiveSlug(null)
    window.addEventListener('scroll', clear, { passive: true })
    window.addEventListener('blur', clear)
    document.addEventListener('visibilitychange', clear)

    return () => {
      window.removeEventListener('scroll', clear)
      window.removeEventListener('blur', clear)
      document.removeEventListener('visibilitychange', clear)
    }
  }, [activeSlug])

  useEffect(() => {
    const follower = followerRef.current
    const list = listRef.current
    if (!follower || !list) return
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let target = { x: 0, y: 0 }
    let current = { x: 0, y: 0 }
    let frame = 0
    let started = false

    const onMove = (event: PointerEvent) => {
      target = { x: event.clientX, y: event.clientY }
      if (started) return
      started = true
      current = target
    }

    const tick = () => {
      current.x += (target.x - current.x) * 0.14
      current.y += (target.y - current.y) * 0.14
      follower.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`
      frame = requestAnimationFrame(tick)
    }

    list.addEventListener('pointermove', onMove)
    frame = requestAnimationFrame(tick)

    return () => {
      list.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  const activeProject = featuredProjects.find((project) => project.slug === activeSlug)

  return (
    <div className="work-index-list" onPointerLeave={() => setActiveSlug(null)} ref={listRef}>
      {featuredProjects.map((project, index) => (
        <a
          data-testid="project-index-item"
          data-reveal
          className="index-row"
          href={`#project-${project.slug}`}
          key={project.slug}
          onPointerEnter={() => setActiveSlug(project.slug)}
          onPointerLeave={() => setActiveSlug((current) => (current === project.slug ? null : current))}
          onFocus={() => setActiveSlug(project.slug)}
          onBlur={() => setActiveSlug((current) => (current === project.slug ? null : current))}
        >
          <span className="index-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="index-name">{project.name}</span>
          <span className="index-service">{project.category}</span>
          <span aria-hidden="true" className="index-arrow">↗</span>
        </a>
      ))}
      <div
        aria-hidden="true"
        className={`index-follower${activeProject?.preview ? ' is-active' : ''}`}
        ref={followerRef}
      >
        {activeProject?.preview && (
          <img alt="" decoding="async" loading="lazy" src={activeProject.preview} />
        )}
      </div>
    </div>
  )
}
