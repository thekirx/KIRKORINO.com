import { describe, expect, it } from 'vitest'

describe('prerender injection', () => {
  it('injects application markup into the generated root', async () => {
    const { injectAppMarkup } = await import('./prerender.mjs')
    const result = injectAppMarkup('<div id="root"></div>', '<main><h1>Kirk Orino</h1></main>')

    expect(result).toBe('<div id="root"><main><h1>Kirk Orino</h1></main></div>')
  })

  it('rejects missing roots and empty application markup', async () => {
    const { injectAppMarkup } = await import('./prerender.mjs')

    expect(() => injectAppMarkup('<main></main>', '<h1>Kirk</h1>')).toThrow('root')
    expect(() => injectAppMarkup('<div id="root"></div>', '')).toThrow('empty')
  })
})
