import { describe, expect, it } from 'vitest'
import { allProjects, archiveProjects, featuredProjects } from './projects'

describe('project catalog', () => {
  it('contains seven ordered featured projects and sixteen archive projects', () => {
    expect(featuredProjects.map(({ name }) => name)).toEqual([
      'Hakum Auto Care',
      'Kaen Manila',
      'Optrizo Dentistry',
      'SkyCourt',
      'Linaw Finance',
      'Que Perfumery',
      'Casa Uno Villas',
    ])
    expect(archiveProjects).toHaveLength(16)
    expect(allProjects).toHaveLength(23)
  })

  it('contains only secure, unique live URLs and excludes the failed project', () => {
    const urls = allProjects.map(({ url }) => url)
    expect(urls.every((url) => url.startsWith('https://'))).toBe(true)
    expect(new Set(urls).size).toBe(urls.length)
    expect(allProjects.some(({ slug }) => slug === 'mvpgetmeds')).toBe(false)
    expect(allProjects.some(({ slug }) => slug === 'pa-tongits')).toBe(false)
    expect(allProjects.some(({ slug }) => slug === 'valentine-invitation')).toBe(false)
  })

  it('gives every featured project a real preview image', () => {
    expect(featuredProjects.every(({ preview }) => preview.startsWith('/previews/'))).toBe(true)
  })
})
