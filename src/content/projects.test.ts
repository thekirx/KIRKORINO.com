import { describe, expect, it } from 'vitest'
import { allProjects, archiveProjects, featuredProjects } from './projects'

describe('project catalog', () => {
  it('contains six ordered featured projects and eighteen archive projects', () => {
    expect(featuredProjects.map(({ name }) => name)).toEqual([
      'Hakum Auto Care',
      'Kaen Manila',
      'Optrizo Dentistry',
      'SkyCourt',
      'Linaw Finance',
      'Que Perfumery',
    ])
    expect(archiveProjects).toHaveLength(18)
    expect(allProjects).toHaveLength(24)
  })

  it('contains only secure, unique live URLs and excludes the failed project', () => {
    const urls = allProjects.map(({ url }) => url)
    expect(urls.every((url) => url.startsWith('https://'))).toBe(true)
    expect(new Set(urls).size).toBe(urls.length)
    expect(allProjects.some(({ slug }) => slug === 'mvpgetmeds')).toBe(false)
  })
})
