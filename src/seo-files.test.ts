import { describe, expect, it } from 'vitest'
import indexHtml from '../index.html?raw'
import robots from '../public/robots.txt?raw'
import sitemap from '../public/sitemap.xml?raw'

const title = 'Kirk Orino | Web Developer & Content Creator'
const socialTitle = 'Kirk Orino — Web Developer & Content Creator'
const description = 'Kirk Orino is a Manila-based web developer, designer, content creator, and owner of Optrizo, building websites, digital experiences, and business systems.'

describe('static SEO files', () => {
  it('publishes canonical homepage and social metadata', () => {
    const document = new DOMParser().parseFromString(indexHtml, 'text/html')

    expect.soft(document.title).toBe(title)
    expect.soft(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(description)
    expect.soft(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://kirkorino.com/')
    expect.soft(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('website')
    expect.soft(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(socialTitle)
    expect.soft(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe(description)
    expect.soft(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe('https://kirkorino.com/')
    expect.soft(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      'https://kirkorino.com/og-image.png',
    )
    expect.soft(document.querySelector('meta[property="og:image:type"]')?.getAttribute('content')).toBe('image/png')
    expect.soft(document.querySelector('meta[property="og:image:width"]')?.getAttribute('content')).toBe('1729')
    expect.soft(document.querySelector('meta[property="og:image:height"]')?.getAttribute('content')).toBe('910')
    expect.soft(document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe('summary_large_image')
    expect.soft(document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe(socialTitle)
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

  it('publishes a connected identity graph using only verified profiles', () => {
    const document = new DOMParser().parseFromString(indexHtml, 'text/html')
    const script = document.querySelector('script[type="application/ld+json"]')
    const data = JSON.parse(script?.textContent ?? '')
    const graph = (data['@graph'] ?? []) as Array<Record<string, unknown>>
    const entity = (id: string) => graph.find((item) => item['@id'] === id)
    const website = entity('https://kirkorino.com/#website')
    const person = entity('https://kirkorino.com/#person')
    const people = graph.filter((item) => item['@type'] === 'Person')
    const organization = entity('https://optrizo.com/#organization')

    expect(data).toMatchObject({
      '@context': 'https://schema.org',
    })
    expect(graph).toHaveLength(3)
    expect(people).toHaveLength(1)
    expect(website).toMatchObject({
      '@type': 'WebSite',
      '@id': 'https://kirkorino.com/#website',
      url: 'https://kirkorino.com/',
      about: { '@id': 'https://kirkorino.com/#person' },
      author: { '@id': 'https://kirkorino.com/#person' },
    })
    expect(person).toMatchObject({
      '@type': 'Person',
      '@id': 'https://kirkorino.com/#person',
      name: 'Kirk Orino',
      alternateName: [
        'Kirk Oriño',
        'Dikie Kirk Orino',
        'Dikie Kirk Oriño',
        'Dikie Orino',
        'Dikie Oriño',
        'kirkorino',
      ],
      url: 'https://kirkorino.com/',
      sameAs: [
        'https://www.tiktok.com/@kirkorino',
        'https://www.linkedin.com/in/dikie-kirk-orino-a0b257319',
      ],
      owns: { '@id': 'https://optrizo.com/#organization' },
      worksFor: { '@id': 'https://optrizo.com/#organization' },
    })
    expect(person?.hasOccupation).toEqual([
      { '@type': 'Occupation', name: 'Web Developer' },
      { '@type': 'Occupation', name: 'Web Designer' },
      { '@type': 'Occupation', name: 'Content Creator' },
    ])
    expect(person?.knowsAbout).toEqual(expect.arrayContaining(['Web Design', 'Web Development', 'Responsive Development']))
    expect(organization).toMatchObject({
      '@type': 'Organization',
      '@id': 'https://optrizo.com/#organization',
      name: 'Optrizo',
      url: 'https://optrizo.com/',
      founder: { '@id': 'https://kirkorino.com/#person' },
    })

    const sameAs = person?.sameAs as string[]
    expect(new Set(sameAs).size).toBe(sameAs.length)
    expect(sameAs.filter((url) => url === 'https://www.linkedin.com/in/dikie-kirk-orino-a0b257319')).toHaveLength(1)
    expect(sameAs).toEqual([
      'https://www.tiktok.com/@kirkorino',
      'https://www.linkedin.com/in/dikie-kirk-orino-a0b257319',
    ])
  })

  it('allows the homepage and lists only its canonical URL', () => {
    expect(robots).toBe('User-agent: *\nAllow: /\n\nSitemap: https://kirkorino.com/sitemap.xml\n')
    expect(sitemap).toContain('<loc>https://kirkorino.com/</loc>')
    expect(sitemap).not.toContain('.vercel.app')
    expect((sitemap.match(/<url>/g) ?? [])).toHaveLength(1)
  })
})
