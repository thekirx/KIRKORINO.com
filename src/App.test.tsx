import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('portfolio page', () => {
  it('states the offer and provides direct contact actions', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Kirk Orino')
    expect(screen.getByRole('heading', { name: 'Not just another website.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Selected work' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Let’s make it impossible to ignore.' })).toBeInTheDocument()
    expect(screen.getAllByTestId('project-index-item')).toHaveLength(7)
    expect(screen.getAllByRole('link', { name: /email kirk|available for projects/i })[0]).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:kirkorino@gmail.com'),
    )
    expect(screen.getByRole('link', { name: /call 0931 058 8704/i })).toHaveAttribute(
      'href',
      'tel:+639310588704',
    )
  })

  it('renders seven featured links and all sixteen archive links securely', () => {
    render(<App />)

    expect(screen.getAllByTestId('featured-project')).toHaveLength(7)
    expect(screen.getAllByTestId('archive-project')).toHaveLength(16)
    for (const link of screen.getAllByRole('link', { name: /view (?:live project|.* live)/i })) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})
