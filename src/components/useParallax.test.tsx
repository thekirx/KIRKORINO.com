import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useParallax } from './useParallax'

function Harness({ rects }: { rects: Array<{ top: number; height: number }> }) {
  useParallax()
  return (
    <>
      {rects.map((rect, index) => (
        <img alt="" data-parallax="" data-testid={`art-${index}`} key={index} />
      ))}
    </>
  )
}

function stubRects(container: HTMLElement, rects: Array<{ top: number; height: number }>) {
  container.querySelectorAll('[data-parallax]').forEach((el, index) => {
    const rect = rects[index]
    el.getBoundingClientRect = () =>
      ({ top: rect.top, height: rect.height, bottom: rect.top + rect.height }) as DOMRect
  })
}

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0)
    return 1
  })
  vi.stubGlobal('cancelAnimationFrame', () => {})
  Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true })
})

afterEach(() => vi.unstubAllGlobals())

describe('useParallax', () => {
  it('drifts art in opposite directions above and below the viewport centre', () => {
    // one frame centred high in the viewport, one centred low
    const rects = [{ top: 0, height: 200 }, { top: 800, height: 200 }]
    const { container } = render(<Harness rects={rects} />)
    stubRects(container, rects)
    window.dispatchEvent(new Event('scroll'))

    const [high, low] = [...container.querySelectorAll<HTMLElement>('[data-parallax]')]
    const highOffset = parseFloat(high.style.getPropertyValue('--parallax'))
    const lowOffset = parseFloat(low.style.getPropertyValue('--parallax'))

    expect(highOffset).toBeGreaterThan(0)
    expect(lowOffset).toBeLessThan(0)
    expect(Math.abs(highOffset)).toBeLessThanOrEqual(3.2)
  })

  it('leaves art centred in the viewport untouched', () => {
    const rects = [{ top: 400, height: 200 }]
    const { container } = render(<Harness rects={rects} />)
    stubRects(container, rects)
    window.dispatchEvent(new Event('scroll'))

    const offset = container.querySelector<HTMLElement>('[data-parallax]')?.style.getPropertyValue('--parallax')
    expect(parseFloat(offset ?? '')).toBe(0)
  })

  it('skips work entirely when motion is reduced', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }))
    const rects = [{ top: 0, height: 200 }]
    const { container } = render(<Harness rects={rects} />)
    stubRects(container, rects)
    window.dispatchEvent(new Event('scroll'))

    expect(container.querySelector<HTMLElement>('[data-parallax]')?.style.getPropertyValue('--parallax')).toBe('')
  })
})
