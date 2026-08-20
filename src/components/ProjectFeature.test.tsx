import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Project } from '../content/projects'
import { ProjectFeature } from './ProjectFeature'

const projectWithoutPreview: Project = {
  slug: 'sample',
  name: 'Sample Project',
  category: 'Business Services',
  description: 'A sample project.',
  url: 'https://example.com',
  featured: true,
  preview: '',
  previewAlt: 'Sample Project preview',
}

describe('ProjectFeature', () => {
  it('shows branded project art when no captured preview is available', () => {
    render(<ProjectFeature project={projectWithoutPreview} index={0} />)

    expect(screen.getByRole('img', { name: 'Sample Project preview' })).toHaveTextContent('Sample Project')
  })
})
