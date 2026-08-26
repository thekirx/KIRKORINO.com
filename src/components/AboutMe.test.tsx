import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AboutMe } from './AboutMe'

describe('AboutMe', () => {
  it('presents the portrait with explicit dimensions so it cannot shift layout', () => {
    render(<AboutMe />)

    const portrait = screen.getByRole('img', { name: 'Kirk Orino' })
    expect(portrait).toHaveAttribute('width')
    expect(portrait).toHaveAttribute('height')
    expect(portrait).toHaveAttribute('loading', 'lazy')
    expect(portrait).toHaveAttribute('decoding', 'async')
  })

  it('is reachable from the Profile nav anchor', () => {
    const { container } = render(<AboutMe />)

    expect(container.querySelector('#profile')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Hi, I’m Kirk.' })).toBeInTheDocument()
  })

  it('renders each confirmed social link safely, with its qualifier', () => {
    render(<AboutMe />)

    const tiktok = screen.getByRole('link', { name: /tiktok/i })
    expect(tiktok).toHaveAttribute('href', 'https://www.tiktok.com/@kirkorino')
    expect(tiktok).toHaveAttribute('target', '_blank')
    expect(tiktok).toHaveAttribute('rel', 'noopener noreferrer')
    expect(tiktok).toHaveTextContent('Lifestyle')
  })
})
