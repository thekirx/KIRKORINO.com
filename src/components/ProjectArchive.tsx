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
  return (
    <section className="project-archive" aria-labelledby="archive-title">
      <div className="archive-intro">
        <h2 id="archive-title">More things I’ve made.</h2>
        <p>A growing collection of websites, tools, stores, and experiments built for different kinds of people and businesses.</p>
      </div>
      <div className="archive-groups">
        {categoryOrder.map((category) => {
          const projects = archiveProjects.filter((project) => project.category === category)
          if (!projects.length) return null
          return (
            <section className="archive-group" key={category} aria-labelledby={`archive-${category}`}>
              <h3 id={`archive-${category}`}>{category}</h3>
              <div className="archive-list">
                {projects.map((project) => (
                  <a data-testid="archive-project" key={project.slug} href={project.url} target="_blank" rel="noopener noreferrer">
                    <span>{project.name}</span>
                    <ArrowIcon />
                  </a>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </section>
  )
}
