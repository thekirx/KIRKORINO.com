import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FluidHeroTitle } from './FluidHeroTitle'

describe('FluidHeroTitle', () => {
  it('moves within a safe limit during touch drag and returns on release', () => {
    render(<FluidHeroTitle />)
    const title = screen.getByRole('heading', { name: 'Kirk Orino' })

    fireEvent.pointerDown(title, { pointerId: 1, pointerType: 'touch', clientX: 100, clientY: 100 })
    fireEvent.pointerMove(title, { pointerId: 1, pointerType: 'touch', clientX: 180, clientY: 120 })

    expect(title.style.getPropertyValue('--kirk-shift-x')).toBe('24px')
    expect(title.style.getPropertyValue('--kirk-shift-y')).toBe('20px')
    expect(title.style.getPropertyValue('--orino-shift-x')).toBe('-11px')
    expect(title).toHaveClass('is-dragging')

    fireEvent.pointerUp(title, { pointerId: 1, pointerType: 'touch' })

    expect(title.style.getPropertyValue('--kirk-shift-x')).toBe('0px')
    expect(title.style.getPropertyValue('--orino-shift-x')).toBe('0px')
    expect(title).not.toHaveClass('is-dragging')
  })
})
