import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { featuredProjects } from '../content/projects'
import { ProjectIndex } from './ProjectIndex'

describe('ProjectIndex', () => {
  it('previews the hovered project and dims the rest', async () => {
    const user = userEvent.setup()
    const { container } = render(<ProjectIndex />)

    const rows = screen.getAllByTestId('project-index-item')
    expect(container.querySelector('.index-follower img')).toBeNull()

    await user.hover(rows[2])

    const follower = container.querySelector('.index-follower')
    expect(follower).toHaveClass('is-active')
    expect(follower?.querySelector('img')).toHaveAttribute('src', featuredProjects[2].preview)
    // dimming is CSS-only now, so assert what actually broke: React must not
    // rewrite a row's className, because that wipes the reveal marker
    expect([...container.querySelectorAll('.index-row')].every((row) => row.className === 'index-row')).toBe(true)

    await user.unhover(rows[2])

    expect(container.querySelector('.index-follower')).not.toHaveClass('is-active')
  })

  it('releases the hover state when the section is scrolled away', async () => {
    const user = userEvent.setup()
    const { container } = render(<ProjectIndex />)

    await user.hover(screen.getAllByTestId('project-index-item')[1])
    expect(container.querySelector('.index-follower')).toHaveClass('is-active')

    // scrolling does not move the pointer, so pointerleave may never fire
    act(() => window.dispatchEvent(new Event('scroll')))

    expect(container.querySelector('.index-follower')).not.toHaveClass('is-active')
  })

  it('releases the hover state when the window loses focus', async () => {
    const user = userEvent.setup()
    const { container } = render(<ProjectIndex />)

    await user.hover(screen.getAllByTestId('project-index-item')[0])
    act(() => window.dispatchEvent(new Event('blur')))

    expect(container.querySelector('.index-follower')).not.toHaveClass('is-active')
  })

  it('releases the hover state when the pointer leaves the list', async () => {
    const user = userEvent.setup()
    const { container } = render(<ProjectIndex />)

    await user.hover(screen.getAllByTestId('project-index-item')[3])
    await user.unhover(container.querySelector('.work-index-list') as HTMLElement)

    expect(container.querySelector('.index-follower')).not.toHaveClass('is-active')
  })

  it('preserves the reveal marker when a row is hovered', async () => {
    // regression: the row className used to carry hover state, so React rewrote
    // it on every hover and stripped the imperatively-set reveal marker,
    // dropping all ten rows to opacity 0 for the rest of the session
    const user = userEvent.setup()
    const { container } = render(<ProjectIndex />)

    const rows = [...container.querySelectorAll<HTMLElement>('.index-row')]
    rows.forEach((row) => { row.dataset.revealed = 'true' })

    await user.hover(rows[4])
    await user.unhover(rows[4])
    await user.hover(rows[7])

    expect(rows.every((row) => row.dataset.revealed === 'true')).toBe(true)
  })

  it('keeps the preview decorative and out of the accessibility tree', async () => {
    const user = userEvent.setup()
    const { container } = render(<ProjectIndex />)

    await user.hover(screen.getAllByTestId('project-index-item')[0])

    expect(container.querySelector('.index-follower')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.index-follower img')).toHaveAttribute('alt', '')
  })
})
