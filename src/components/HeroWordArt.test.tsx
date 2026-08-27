import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HeroWordArt } from './HeroWordArt'

const sources = ['/previews/a.jpg', '/previews/b.jpg', '/previews/c.jpg']

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('HeroWordArt', () => {
  it('leaves a solid word behind the art as the fallback', () => {
    const { container } = render(<HeroWordArt sources={sources} word="Kirk" />)

    expect(container.querySelector('.hero-art-solid')).toHaveTextContent('Kirk')
    expect(container.querySelectorAll('.hero-art-layer')).toHaveLength(2)
  })

  it('hides every art layer from assistive technology', () => {
    const { container } = render(<HeroWordArt sources={sources} word="Kirk" />)

    for (const layer of container.querySelectorAll('.hero-art-layer')) {
      expect(layer).toHaveAttribute('aria-hidden', 'true')
      expect(layer).toHaveAttribute('data-word', 'Kirk')
      expect(layer).toBeEmptyDOMElement()
    }
    // the word is announced exactly once
    expect(screen.getAllByText('Kirk', { ignore: '[aria-hidden="true"]' })).toHaveLength(1)
  })

  it('veils every frame so light previews stay legible inside the letters', () => {
    const { container } = render(<HeroWordArt sources={sources} word="Kirk" />)

    for (const layer of container.querySelectorAll<HTMLElement>('.hero-art-layer')) {
      expect(layer.style.backgroundImage).toContain('linear-gradient')
      expect(layer.style.backgroundImage).toMatch(/url\(/)
    }
  })

  it('advances through the sources on a timer', () => {
    const { container } = render(<HeroWordArt sources={sources} word="Kirk" />)

    const activeSource = () =>
      (container.querySelector('.hero-art-layer.is-active') as HTMLElement).style.backgroundImage

    expect(activeSource()).toContain('/previews/a.jpg')
    act(() => vi.advanceTimersByTime(3400))
    expect(activeSource()).toContain('/previews/b.jpg')
    act(() => vi.advanceTimersByTime(3400))
    expect(activeSource()).toContain('/previews/c.jpg')
    act(() => vi.advanceTimersByTime(3400))
    expect(activeSource()).toContain('/previews/a.jpg')
  })

  it('keeps exactly one layer active so the dissolve has a partner', () => {
    const { container } = render(<HeroWordArt sources={sources} word="Kirk" />)

    act(() => vi.advanceTimersByTime(3400))
    expect(container.querySelectorAll('.hero-art-layer.is-active')).toHaveLength(1)
    const idle = container.querySelector('.hero-art-layer:not(.is-active)') as HTMLElement
    expect(idle.style.backgroundImage).toContain('/previews/a.jpg')
  })

  it('does not cycle when motion is reduced', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }))
    const { container } = render(<HeroWordArt sources={sources} word="Kirk" />)

    act(() => vi.advanceTimersByTime(20000))

    expect((container.querySelector('.hero-art-layer.is-active') as HTMLElement).style.backgroundImage)
      .toContain('/previews/a.jpg')
  })
})
