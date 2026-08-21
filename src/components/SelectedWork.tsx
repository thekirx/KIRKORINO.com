import { featuredProjects } from '../content/projects'
import { ProjectFeature } from './ProjectFeature'
import { ProjectIndex } from './ProjectIndex'

export function SelectedWork() {
  return (
    <section className="selected-work" id="work" aria-labelledby="selected-work-title">
      <div className="work-index">
        <div className="index-title">
          <h2 id="selected-work-title">Selected work</h2>
          <span aria-label="Seven featured projects">07</span>
        </div>
        <ProjectIndex />
      </div>
      <div className="primary-stories">
        {featuredProjects.slice(0, 4).map((project, index) => <ProjectFeature key={project.slug} project={project} index={index} />)}
      </div>
      <div className="project-continuation">
        {featuredProjects.slice(4).map((project, index) => <ProjectFeature key={project.slug} project={project} index={index + 4} />)}
      </div>
    </section>
  )
}
