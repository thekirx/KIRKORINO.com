import { describe, expect, it } from 'vitest'
import { allProjects, archiveProjects, featuredProjects } from './projects'

describe('project catalog', () => {
  it('contains ten ordered featured projects and eighteen archive projects', () => {
    expect(featuredProjects.map(({ name }) => name)).toEqual([
      'Hakum Auto Care',
      'Casa Uno Villas',
      'Buff Coffee Club',
      'Tela Park',
      'Cafe 10/23',
      'El Poco Cantina',
      'Oasis Pickleball Courts',
      'Kaen Manila',
      'SkyCourt',
      'Que Perfumery',
    ])
    expect(archiveProjects).toHaveLength(18)
    expect(allProjects).toHaveLength(28)
  })

  it('lists the newest Vercel deployments ahead of the older archive entries', () => {
    expect(archiveProjects.slice(0, 2).map(({ name }) => name)).toEqual(['Everyhype Store', 'Carport Wheels'])
  })

  it('keeps a project in exactly one of the two lists', () => {
    const featuredSlugs = new Set(featuredProjects.map(({ slug }) => slug))
    expect(archiveProjects.some(({ slug }) => featuredSlugs.has(slug))).toBe(false)
    expect(new Set(allProjects.map(({ slug }) => slug)).size).toBe(allProjects.length)
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

  it('gives every featured preview its intrinsic dimensions', () => {
    expect(featuredProjects.every(({ previewWidth, previewHeight }) =>
      Number.isInteger(previewWidth) && Number.isInteger(previewHeight) && previewWidth! > 0 && previewHeight! > 0,
    )).toBe(true)
  })

  it('provides an editorial headline and summary for every featured project', () => {
    expect(featuredProjects.every(({ featureHeadline, featureSummary }) =>
      Boolean(featureHeadline?.trim() && featureSummary?.trim()),
    )).toBe(true)
  })

  it('leads every featured case study with the brand name', () => {
    expect(featuredProjects.every(({ name, featureHeadline }) => featureHeadline === name)).toBe(true)
  })
})
