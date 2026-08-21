import { describe, expect, it } from 'vitest'

describe('server entry', () => {
  it('renders the meaningful homepage content and links', async () => {
    const { render } = await import('./entry-server')
    const html = render()

    expect(html).toContain('<h1')
    expect(html).toContain('Kirk')
    expect(html).toContain('Web designer + developer')
    expect(html).toContain('Hakum Auto Care')
    expect(html).toContain('mailto:kirkorino@gmail.com')
  })
})
