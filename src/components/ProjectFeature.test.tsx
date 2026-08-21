import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Project } from '../content/projects'
import { ProjectFeature } from './ProjectFeature'

const project: Project = {
  slug: 'sample',
  name: 'Sample Project',
  category: 'Business Services',
  description: 'A sample project.',
  featureHeadline: 'Designed with intent.',
  featureSummary: 'A focused editorial presentation.',
  url: 'https://example.com',
  featured: true,
  preview: '/previews/sample.jpg',
  previewAlt: 'Sample Project preview',
  previewWidth: 1200,
  previewHeight: 630,
}

describe('ProjectFeature', () => {
  it('renders a linkable editorial project story', () => {
    render(<ProjectFeature project={project} index={0} />)

    expect(screen.getByRole('article')).toHaveAttribute('id', 'project-sample')
    expect(screen.getByRole('heading', { name: 'Designed with intent.' })).toBeInTheDocument()
    expect(screen.getByText('A focused editorial presentation.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View Sample Project live' })).toHaveAttribute('href', 'https://example.com')
    const image = screen.getByRole('img', { name: 'Sample Project preview' })
    expect(image).toHaveAttribute('width', '1200')
    expect(image).toHaveAttribute('height', '630')
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('decoding', 'async')
  })

  it('shows branded project art when no captured preview is available', () => {
    render(<ProjectFeature project={{ ...project, preview: '' }} index={0} />)

    expect(screen.getByRole('img', { name: 'Sample Project preview' })).toHaveTextContent('Sample Project')
  })
})
