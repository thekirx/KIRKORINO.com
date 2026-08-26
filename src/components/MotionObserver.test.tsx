import { act, render } from '@testing-library/react'
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
    expect(container.querySelector('[data-reveal]')).toHaveAttribute('data-revealed', 'true')
  })

  it('reveals split headings and keeps them revealed permanently', () => {
    const unobserve = vi.fn()
    let fire: ((intersecting: boolean) => void) | undefined
    class ObserverMock {
      constructor(private callback: IntersectionObserverCallback) {
        fire = (intersecting) =>
          this.callback(
            [{ isIntersecting: intersecting, target: document.querySelector('[data-reveal-split]') } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          )
      }
      observe() {}
      disconnect() {}
      unobserve = unobserve
    }
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
    vi.stubGlobal('IntersectionObserver', ObserverMock)

    const { container } = render(
      <>
        <MotionObserver />
        <h2 data-reveal-split>Selected work</h2>
      </>,
    )

    const heading = container.querySelector('[data-reveal-split]')
    fire?.(true)
    expect(heading).toHaveAttribute('data-revealed', 'true')
    expect(unobserve).toHaveBeenCalledWith(heading)

    // scrolling back past it must not undo the reveal
    fire?.(false)
    expect(heading).toHaveAttribute('data-revealed', 'true')
  })

  it('reveals content a fast scroll carried past the fold unobserved', () => {
    // The observer never reports a crossing when an element jumps from below the
    // fold to above it between two frames; without the scroll sweep it would
    // stay hidden forever.
    class SilentObserver {
      constructor(public callback: IntersectionObserverCallback) {}
      observe() {}
      disconnect() {}
      unobserve() {}
    }
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
    vi.stubGlobal('IntersectionObserver', SilentObserver)
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0)
      return 1
    })
    vi.stubGlobal('cancelAnimationFrame', () => {})
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

    // the element starts well below the fold, before the first sweep runs
    let top = 1200
    const original = Element.prototype.getBoundingClientRect
    Element.prototype.getBoundingClientRect = function () {
      return { top } as DOMRect
    }

    try {
      const { container } = render(
        <>
          <MotionObserver />
          <h2 data-reveal-split>Selected work</h2>
        </>,
      )

      const heading = container.querySelector('[data-reveal-split]') as HTMLElement
      expect(heading).not.toHaveAttribute('data-revealed')

      // a flick carries it clean past the viewport, no crossing ever observed
      top = -900
      act(() => window.dispatchEvent(new Event('scroll')))
      expect(heading).toHaveAttribute('data-revealed', 'true')
    } finally {
      Element.prototype.getBoundingClientRect = original
    }
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
    expect(container.querySelector('[data-reveal]')).toHaveAttribute('data-revealed', 'true')
  })
})
