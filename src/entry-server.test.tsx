import { describe, expect, it } from 'vitest'

describe('server entry', () => {
  it('renders the meaningful homepage content and links', async () => {
    const { render } = await import('./entry-server')
    const html = render()
    const document = new DOMParser().parseFromString(html, 'text/html')
    const headings = document.querySelectorAll('h1')

    expect(headings).toHaveLength(1)
    expect(headings[0].textContent?.replace(/\s+/g, ' ').trim()).toBe('Kirk Orino')
    expect(html).toContain('Web designer + developer')
    expect(html).toContain('Hakum Auto Care')
    expect(html).toContain('mailto:kirkorino@gmail.com')
  })
})
