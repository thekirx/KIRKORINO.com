import { describe, expect, it } from 'vitest'
import { capabilities } from './content/practice'

describe('server entry', () => {
  it('renders the meaningful homepage content and links', async () => {
    const { render } = await import('./entry-server')
    const html = render()
    const document = new DOMParser().parseFromString(html, 'text/html')
    const headings = document.querySelectorAll('h1')

    expect(headings).toHaveLength(1)
    expect(headings[0].textContent?.replace(/\s+/g, ' ').trim()).toBe('Kirk Orino')
    expect(
      document.body.textContent?.match(
        /I’m Kirk Orino, known online as @kirkorino—a web developer, content creator, and founder of Optrizo based in Manila\./g,
      ),
    ).toHaveLength(1)
    const marqueeText = document.querySelector('.hero-services')?.textContent ?? ''
    for (const capability of capabilities) {
      expect(marqueeText.split(capability)).toHaveLength(2)
    }
    expect(html).toContain('Web designer + developer')
    expect(html).toContain('Hakum Auto Care')
    expect(html).toContain('mailto:kirkorino@gmail.com')
  })
})
