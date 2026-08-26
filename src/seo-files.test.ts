import { describe, expect, it } from 'vitest'
import indexHtml from '../index.html?raw'
import robots from '../public/robots.txt?raw'
import sitemap from '../public/sitemap.xml?raw'

const title = 'Kirk Orino | Web Designer & Developer in the Philippines'
const description = 'Portfolio of Kirk Orino, a web designer and developer creating modern websites, web applications, UI/UX experiences, and business systems in the Philippines.'

describe('static SEO files', () => {
  it('publishes canonical homepage and social metadata', () => {
    const document = new DOMParser().parseFromString(indexHtml, 'text/html')

    expect.soft(document.title).toBe(title)
    expect.soft(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(description)
    expect.soft(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://kirkorino.com/')
    expect.soft(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('website')
    expect.soft(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(title)
    expect.soft(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe(description)
    expect.soft(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe('https://kirkorino.com/')
    expect.soft(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      'https://kirkorino.com/og-image.png',
    )
    expect.soft(document.querySelector('meta[property="og:image:type"]')?.getAttribute('content')).toBe('image/png')
    expect.soft(document.querySelector('meta[property="og:image:width"]')?.getAttribute('content')).toBe('1729')
    expect.soft(document.querySelector('meta[property="og:image:height"]')?.getAttribute('content')).toBe('910')
    expect.soft(document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe('summary_large_image')
    expect.soft(document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe(title)
    expect.soft(document.querySelector('meta[name="twitter:description"]')?.getAttribute('content')).toBe(description)
    expect.soft(document.querySelector('meta[name="twitter:image"]')?.getAttribute('content')).toBe(
      'https://kirkorino.com/og-image.png',
    )
  })

  it('declares its own icon set so no stale origin favicon is used', () => {
    const document = new DOMParser().parseFromString(indexHtml, 'text/html')

    expect.soft(document.querySelector('link[rel="icon"][sizes="any"]')?.getAttribute('href')).toBe('/favicon.ico')
    expect.soft(document.querySelector('link[rel="icon"][sizes="32x32"]')?.getAttribute('href')).toBe('/favicon-32.png')
    expect.soft(document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href')).toBe('/apple-touch-icon.png')
    expect.soft(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#f4f2ed')
  })

  it('publishes valid Person structured data without invented profiles', () => {
    const document = new DOMParser().parseFromString(indexHtml, 'text/html')
    const script = document.querySelector('script[type="application/ld+json"]')
    const data = JSON.parse(script?.textContent ?? '')

    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Kirk Orino',
      url: 'https://kirkorino.com/',
      jobTitle: 'Web Designer & Developer',
    })
    expect(data.knowsAbout).toEqual(expect.arrayContaining(['Web Design', 'Web Development', 'Responsive Development']))
    expect(data).not.toHaveProperty('sameAs')
  })

  it('allows the homepage and lists only its canonical URL', () => {
    expect(robots).toBe('User-agent: *\nAllow: /\n\nSitemap: https://kirkorino.com/sitemap.xml\n')
    expect(sitemap).toContain('<loc>https://kirkorino.com/</loc>')
    expect(sitemap).not.toContain('.vercel.app')
    expect((sitemap.match(/<url>/g) ?? [])).toHaveLength(1)
  })
})
