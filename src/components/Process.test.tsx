import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Process } from './Process'

describe('Process', () => {
  it('presents four numbered steps in order', () => {
    render(<Process />)

    const steps = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(steps).toHaveLength(4)
    expect(steps.map((step) => within(step).getByRole('heading', { level: 3 }).textContent)).toEqual([
      'Discovery',
      'Direction',
      'Design + build',
      'Launch + aftercare',
    ])
    expect(steps.map((step) => within(step).getByText(/^\d{3}$/).textContent)).toEqual(['001', '002', '003', '004'])
  })

  it('is reachable from the primary navigation anchor', () => {
    const { container } = render(<Process />)

    expect(container.querySelector('#process')).toBeInTheDocument()
  })
})
