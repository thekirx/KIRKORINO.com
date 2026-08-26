import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FluidHeroTitle } from './FluidHeroTitle'

afterEach(() => vi.unstubAllGlobals())

function heroTitle() {
  const title = screen.getByRole('heading', { name: 'Kirk Orino' })
  // jsdom reports a zero-size box, so give the parallax maths a real one
  title.getBoundingClientRect = () => ({ left: 0, top: 0, width: 1000, height: 400 }) as DOMRect
  return title
}

describe('FluidHeroTitle', () => {
  it('moves within a safe limit during drag and returns on release', () => {
    render(<FluidHeroTitle />)
    const title = heroTitle()

    fireEvent.pointerDown(title, { pointerId: 1, pointerType: 'touch', clientX: 100, clientY: 100 })
    fireEvent.pointerMove(title, { pointerId: 1, pointerType: 'touch', clientX: 180, clientY: 120 })

    expect(title.style.getPropertyValue('--kirk-shift-x')).toBe('24px')
    expect(title.style.getPropertyValue('--kirk-shift-y')).toBe('20px')
    expect(title.style.getPropertyValue('--orino-shift-x')).toBe('-11px')
    expect(title.dataset.dragging).toBe('true')

    fireEvent.pointerUp(title, { pointerId: 1, pointerType: 'touch' })

    expect(title.style.getPropertyValue('--kirk-shift-x')).toBe('0px')
    expect(title.style.getPropertyValue('--orino-shift-x')).toBe('0px')
    expect(title.dataset.dragging).toBeUndefined()
  })

  it('lets a mouse drag the words too, not just touch', () => {
    render(<FluidHeroTitle />)
    const title = heroTitle()

    fireEvent.pointerDown(title, { pointerId: 2, pointerType: 'mouse', clientX: 500, clientY: 200 })
    fireEvent.pointerMove(title, { pointerId: 2, pointerType: 'mouse', clientX: 560, clientY: 200 })

    expect(title.dataset.dragging).toBe('true')
    expect(title.style.getPropertyValue('--kirk-shift-x')).toBe('24px')
  })

  it('drifts the words toward the cursor on hover, counter-moving Orino', () => {
    render(<FluidHeroTitle />)
    const title = heroTitle()

    // hard right edge of the title box
    fireEvent.pointerMove(title, { pointerId: 3, pointerType: 'mouse', clientX: 1000, clientY: 200 })

    expect(title.dataset.tracking).toBe('true')
    expect(title.style.getPropertyValue('--kirk-shift-x')).toBe('10px')
    // 10 * -0.45 = -4.5, and Math.round takes that to -4
    expect(title.style.getPropertyValue('--orino-shift-x')).toBe('-4px')
    // vertically centred, so no vertical drift
    expect(title.style.getPropertyValue('--kirk-shift-y')).toBe('0px')
  })

  it('keeps hover drift well inside the drag limit', () => {
    render(<FluidHeroTitle />)
    const title = heroTitle()

    fireEvent.pointerMove(title, { pointerId: 4, pointerType: 'mouse', clientX: 99999, clientY: 99999 })

    expect(Number.parseInt(title.style.getPropertyValue('--kirk-shift-x'), 10)).toBeLessThanOrEqual(10)
    expect(Number.parseInt(title.style.getPropertyValue('--kirk-shift-y'), 10)).toBeLessThanOrEqual(10)
  })

  it('settles back to centre when the pointer leaves', () => {
    render(<FluidHeroTitle />)
    const title = heroTitle()

    fireEvent.pointerMove(title, { pointerId: 5, pointerType: 'mouse', clientX: 1000, clientY: 400 })
    expect(title.style.getPropertyValue('--kirk-shift-x')).toBe('10px')

    fireEvent.pointerLeave(title, { pointerId: 5, pointerType: 'mouse' })

    expect(title.style.getPropertyValue('--kirk-shift-x')).toBe('0px')
    expect(title.dataset.tracking).toBeUndefined()
  })

  it('does not drift on touch, which has the drag instead', () => {
    render(<FluidHeroTitle />)
    const title = heroTitle()

    fireEvent.pointerMove(title, { pointerId: 6, pointerType: 'touch', clientX: 1000, clientY: 200 })

    expect(title.dataset.tracking).toBeUndefined()
    expect(title.style.getPropertyValue('--kirk-shift-x')).toBe('')
  })

  it('stays completely still when motion is reduced', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }))
    render(<FluidHeroTitle />)
    const title = heroTitle()

    fireEvent.pointerMove(title, { pointerId: 7, pointerType: 'mouse', clientX: 1000, clientY: 400 })
    fireEvent.pointerDown(title, { pointerId: 7, pointerType: 'mouse', clientX: 100, clientY: 100 })
    fireEvent.pointerMove(title, { pointerId: 7, pointerType: 'mouse', clientX: 400, clientY: 300 })

    expect(title.style.getPropertyValue('--kirk-shift-x')).toBe('')
    expect(title.dataset.tracking).toBeUndefined()
    expect(title.dataset.dragging).toBeUndefined()
  })
})
