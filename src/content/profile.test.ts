import { describe, expect, it } from 'vitest'
import { aboutParagraphs, portrait, socialLinks } from './profile'

describe('profile content', () => {
  it('gives the portrait real intrinsic dimensions', () => {
    expect(portrait.src.startsWith('/')).toBe(true)
    expect(Number.isInteger(portrait.width) && portrait.width > 0).toBe(true)
    expect(Number.isInteger(portrait.height) && portrait.height > 0).toBe(true)
    expect(portrait.alt.trim().length).toBeGreaterThan(0)
  })

  it('writes the bio in the first person', () => {
    expect(aboutParagraphs.length).toBeGreaterThan(0)
    expect(aboutParagraphs.every((paragraph) => paragraph.trim().length > 0)).toBe(true)
    expect(aboutParagraphs[0]).toMatch(/I[’']m Kirk/)
  })

  it('does not restate the positioning band higher up the page', () => {
    // the two sections drifted into saying the same thing once already
    const bio = aboutParagraphs.join(' ').toLowerCase()
    expect(bio).not.toContain('assembled from a template')
    expect(bio).not.toContain('strategy, design')
  })

  it('only ever carries real, absolute social URLs', () => {
    // guards against a placeholder like "#" or a guessed handle shipping
    for (const link of socialLinks) {
      expect(link.url).toMatch(/^https:\/\//)
      expect(link.name.trim().length).toBeGreaterThan(0)
    }
    expect(new Set(socialLinks.map(({ url }) => url)).size).toBe(socialLinks.length)
  })
})
