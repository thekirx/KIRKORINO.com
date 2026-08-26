import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { archiveProjects } from '../content/projects'
import { ProjectArchive } from './ProjectArchive'

describe('ProjectArchive', () => {
  it('lists every archived project, whatever its category', () => {
    render(<ProjectArchive />)

    const rendered = screen.getAllByTestId('archive-project')
    expect(rendered).toHaveLength(archiveProjects.length)

    const names = rendered.map((row) => row.textContent)
    for (const project of archiveProjects) {
      expect(names.some((name) => name?.includes(project.name))).toBe(true)
    }
  })

  it('numbers the rows consecutively from the top', () => {
    render(<ProjectArchive />)

    const numbers = screen.getAllByTestId('archive-project').map((row) => row.querySelector('.archive-number')?.textContent)
    expect(numbers[0]).toBe('01')
    expect(numbers.at(-1)).toBe(String(archiveProjects.length).padStart(2, '0'))
  })
})
