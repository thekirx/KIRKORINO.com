import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CountUp } from './CountUp'

afterEach(() => vi.unstubAllGlobals())

describe('CountUp', () => {
  it('renders the final value when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)

    render(<CountUp value={28} />)

    expect(screen.getByText('28')).toBeInTheDocument()
  })

  it('renders the final value immediately when motion is reduced', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }))

    render(<CountUp value={28} />)

    expect(screen.getByText('28')).toBeInTheDocument()
  })

  it('holds at zero until the figure scrolls into view', () => {
    class ObserverMock {
      constructor(public callback: IntersectionObserverCallback) {}
      observe() {}
      disconnect() {}
      unobserve() {}
    }
    vi.stubGlobal('IntersectionObserver', ObserverMock)

    render(<CountUp value={28} />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
