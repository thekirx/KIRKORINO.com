import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('portfolio page', () => {
  it('states the offer and provides direct contact actions', () => {
    render(<App />)

    // the hero word is layered for the clipped art, so assert the accessible
    // name rather than textContent, which now repeats "Kirk" per layer
    expect(screen.getByRole('heading', { level: 1, name: 'Kirk Orino' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Not just another website.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Selected work' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Let’s make it impossible to ignore.' })).toBeInTheDocument()
    expect(screen.getAllByTestId('project-index-item')).toHaveLength(10)
    expect(screen.getAllByRole('link', { name: /email kirk|available for projects/i })[0]).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:kirkorino@gmail.com'),
    )
    expect(screen.getByRole('link', { name: /call 0931 058 8704/i })).toHaveAttribute(
      'href',
      'tel:+639310588704',
    )
  })

  it('renders ten featured links and all eighteen archive links securely', () => {
    render(<App />)

    expect(screen.getAllByTestId('featured-project')).toHaveLength(10)
    expect(screen.getAllByTestId('archive-project')).toHaveLength(18)
    for (const link of screen.getAllByRole('link', { name: /view (?:live project|.* live)/i })) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})
