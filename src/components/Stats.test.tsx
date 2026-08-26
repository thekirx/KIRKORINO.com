import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { allProjects, featuredProjects } from '../content/projects'
import { Stats } from './Stats'

describe('Stats', () => {
  it('reports figures derived from the live project catalog', () => {
    render(<Stats />)

    const industries = new Set(allProjects.map(({ category }) => category))
    expect(screen.getByText('Projects shipped').parentElement).toHaveTextContent(String(allProjects.length))
    expect(screen.getByText('Featured projects').parentElement).toHaveTextContent(String(featuredProjects.length))
    expect(screen.getByText('Industries served').parentElement).toHaveTextContent(String(industries.size))
  })

  it('names every industry it counts', () => {
    render(<Stats />)

    for (const category of new Set(allProjects.map(({ category }) => category))) {
      expect(screen.getByText(category)).toBeInTheDocument()
    }
  })
})
