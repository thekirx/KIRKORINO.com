import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ScrollRail } from './ScrollRail'

function setPageMetrics({ scrollHeight, innerHeight, scrollY }: Record<string, number>) {
  Object.defineProperty(document.documentElement, 'scrollHeight', { value: scrollHeight, configurable: true })
  Object.defineProperty(window, 'innerHeight', { value: innerHeight, configurable: true })
  Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true })
}

beforeEach(() => {
  // run animation frames synchronously so a scroll settles within the test
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0)
    return 1
  })
  vi.stubGlobal('cancelAnimationFrame', () => {})
})

afterEach(() => vi.unstubAllGlobals())

describe('ScrollRail', () => {
  it('starts empty at the top of the page', () => {
    setPageMetrics({ scrollHeight: 5000, innerHeight: 1000, scrollY: 0 })

    const { container } = render(<ScrollRail />)

    expect(container.querySelector<HTMLElement>('.scroll-rail-fill')?.style.transform).toBe('scaleX(0)')
  })

  it('tracks progress through the scrollable distance', () => {
    setPageMetrics({ scrollHeight: 5000, innerHeight: 1000, scrollY: 1000 })

    const { container } = render(<ScrollRail />)
    window.dispatchEvent(new Event('scroll'))

    // 1000 of 4000 scrollable pixels
    expect(container.querySelector<HTMLElement>('.scroll-rail-fill')?.style.transform).toBe('scaleX(0.25)')
  })

  it('clamps at both ends and survives an unscrollable page', () => {
    setPageMetrics({ scrollHeight: 5000, innerHeight: 1000, scrollY: 99999 })
    const { container } = render(<ScrollRail />)
    window.dispatchEvent(new Event('scroll'))
    expect(container.querySelector<HTMLElement>('.scroll-rail-fill')?.style.transform).toBe('scaleX(1)')

    setPageMetrics({ scrollHeight: 800, innerHeight: 1000, scrollY: 0 })
    const short = render(<ScrollRail />)
    window.dispatchEvent(new Event('scroll'))
    expect(short.container.querySelector<HTMLElement>('.scroll-rail-fill')?.style.transform).toBe('scaleX(0)')
  })

  it('is hidden from assistive technology', () => {
    setPageMetrics({ scrollHeight: 5000, innerHeight: 1000, scrollY: 0 })

    const { container } = render(<ScrollRail />)

    expect(container.querySelector('.scroll-rail')).toHaveAttribute('aria-hidden', 'true')
  })
})
