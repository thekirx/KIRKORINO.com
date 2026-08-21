import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MotionObserver } from './MotionObserver'

describe('MotionObserver', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('motion-enabled')
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
  })

  afterEach(() => vi.unstubAllGlobals())

  it('reveals marked elements when they enter the viewport', () => {
    class IntersectionObserverMock {
      constructor(private callback: IntersectionObserverCallback) {}
      observe = (element: Element) => this.callback(
        [{ isIntersecting: true, target: element } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      )
      unobserve = vi.fn()
      disconnect = vi.fn()
      root = null
      rootMargin = ''
      thresholds = []
      takeRecords = () => []
    }

    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
    const { container } = render(
      <>
        <MotionObserver />
        <div data-reveal>Project</div>
      </>,
    )

    expect(document.documentElement).toHaveClass('motion-enabled')
    expect(container.querySelector('[data-reveal]')).toHaveClass('is-visible')
  })

  it('leaves content stable when reduced motion is preferred', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    const observer = vi.fn()
    vi.stubGlobal('IntersectionObserver', observer)

    const { container } = render(
      <>
        <MotionObserver />
        <div data-reveal>Project</div>
      </>,
    )

    expect(observer).not.toHaveBeenCalled()
    expect(document.documentElement).not.toHaveClass('motion-enabled')
    expect(container.querySelector('[data-reveal]')).toHaveClass('is-visible')
  })
})
