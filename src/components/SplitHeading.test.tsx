import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SplitHeading } from './SplitHeading'

describe('SplitHeading', () => {
  it('keeps the intact sentence as the accessible name', () => {
    render(<SplitHeading id="t">Not just another website.</SplitHeading>)

    expect(screen.getByRole('heading', { name: 'Not just another website.' })).toBeInTheDocument()
  })

  it('splits the line into one masked span per word', () => {
    const { container } = render(<SplitHeading>The wider body of work.</SplitHeading>)

    const words = container.querySelectorAll('.split-word-inner')
    expect([...words].map((word) => word.textContent)).toEqual(['The', 'wider', 'body', 'of', 'work.'])
    expect(container.querySelector('.split-heading > span')).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps inter-word spaces outside the clipping mask', () => {
    // A space inside an overflow-hidden inline-block collapses, which renders
    // the line as a single run-together word.
    const { container } = render(<SplitHeading>Selected work</SplitHeading>)

    const masks = [...container.querySelectorAll('.split-word')]
    expect(masks.every((mask) => mask.textContent === mask.textContent?.trim())).toBe(true)
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe('Selected work')
  })

  it('staggers each word so the line reveals in sequence', () => {
    const { container } = render(<SplitHeading>One two three</SplitHeading>)

    expect([...container.querySelectorAll<HTMLElement>('.split-word-inner')].map((w) => w.style.transitionDelay))
      .toEqual(['0ms', '55ms', '110ms'])
  })

  it('renders as the requested element', () => {
    render(<SplitHeading as="h3">Design and build</SplitHeading>)

    expect(screen.getByRole('heading', { level: 3, name: 'Design and build' })).toBeInTheDocument()
  })
})
