import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Footer } from './Footer'

describe('Footer', () => {
  it('keeps its oversized wordmark decorative without duplicate text nodes', () => {
    const { container } = render(<Footer />)
    const wordmark = container.querySelector('.footer-wordmark')
    const labels = [...container.querySelectorAll('.footer-wordmark span')]

    expect(wordmark).toHaveAttribute('aria-hidden', 'true')
    expect(wordmark?.textContent).toBe('')
    expect(labels.map((label) => label.getAttribute('data-label'))).toEqual(['Kirk', 'Orino'])
    expect(labels.every((label) => label.textContent === '')).toBe(true)
  })
})
