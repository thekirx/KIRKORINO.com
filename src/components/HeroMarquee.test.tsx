import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { capabilities } from '../content/practice'
import { Hero } from './Hero'

describe('Hero capability marquee', () => {
  it('repeats the capability run so the band never shows a gap', () => {
    const { container } = render(<Hero />)

    const runs = container.querySelectorAll('.hero-services-run')
    expect(runs.length).toBeGreaterThanOrEqual(4)
    expect(container.querySelectorAll('.hero-services span')).toHaveLength(capabilities.length * runs.length)
  })

  it('exposes only one copy of the capabilities to assistive technology', () => {
    const { container } = render(<Hero />)

    const runs = [...container.querySelectorAll('.hero-services-run')]
    expect(runs.filter((run) => run.getAttribute('aria-hidden') !== 'true')).toHaveLength(1)
    for (const capability of capabilities) {
      expect(screen.getAllByText(capability)).toHaveLength(1)
      const cloneLabels = container.querySelectorAll(
        `.hero-services-run[aria-hidden="true"] span[data-label="${capability}"]`,
      )
      expect(cloneLabels).toHaveLength(runs.length - 1)
      expect([...cloneLabels].every((label) => label.textContent === '')).toBe(true)
    }
  })
})
