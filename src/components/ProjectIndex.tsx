import { featuredProjects } from '../content/projects'

export function ProjectIndex() {
  return (
    <div className="work-index-list">
      {featuredProjects.map((project, index) => (
        <a data-testid="project-index-item" className="index-row" href={`#project-${project.slug}`} key={project.slug}>
          <span className="index-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="index-name">{project.name}</span>
          <span className="index-service">{project.category}</span>
          <span aria-hidden="true" className="index-arrow">↗</span>
        </a>
      ))}
    </div>
  )
}
