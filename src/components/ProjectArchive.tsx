import { archiveProjects, type ProjectCategory } from '../content/projects'
import { ArrowIcon } from './ArrowIcon'

const categoryOrder: ProjectCategory[] = [
  'Hospitality',
  'Sports & Wellness',
  'Software & Systems',
  'Retail',
  'Automotive',
  'Business Services',
  'Experiments',
]

export function ProjectArchive() {
  const orderedProjects = categoryOrder.flatMap((category) =>
    archiveProjects.filter((project) => project.category === category),
  )

  return (
    <section className="project-archive" aria-labelledby="archive-title">
      <div className="archive-intro">
        <p className="meta-text">Full archive / 16</p>
        <h2 id="archive-title">The wider body of work.</h2>
      </div>
      <div className="archive-list">
        {orderedProjects.map((project, index) => (
          <a data-testid="archive-project" key={project.slug} href={project.url} target="_blank" rel="noopener noreferrer">
            <span className="archive-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="archive-name">{project.name}</span>
            <span className="archive-category">{project.category}</span>
            <ArrowIcon />
          </a>
        ))}
      </div>
    </section>
  )
}
