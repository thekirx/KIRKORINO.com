import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('portfolio page', () => {
  it('states the offer and provides direct contact actions', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Websites that make businesses impossible to overlook.',
    )
    expect(screen.getAllByRole('link', { name: /email kirk|start a project/i })[0]).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:kirkorino@gmail.com'),
    )
    expect(screen.getByRole('link', { name: /call 0931 058 8704/i })).toHaveAttribute(
      'href',
      'tel:+639310588704',
    )
  })

  it('renders six featured links and all eighteen archive links securely', () => {
    render(<App />)

    expect(screen.getAllByTestId('featured-project')).toHaveLength(6)
    expect(screen.getAllByTestId('archive-project')).toHaveLength(18)
    for (const link of screen.getAllByRole('link', { name: /view live project/i })) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})
