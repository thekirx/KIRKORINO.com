import { featuredProjects } from '../content/projects'
import { ProjectFeature } from './ProjectFeature'

export function SelectedWork() {
  return (
    <section className="selected-work" id="work" aria-labelledby="selected-work-title">
      <div className="section-heading">
        <h2 id="selected-work-title">Selected work</h2>
        <p>Seven projects. Multiple industries. One focus: making the experience feel right for the business.</p>
      </div>
      <div className="featured-list">
        {featuredProjects.map((project, index) => <ProjectFeature key={project.slug} project={project} index={index} />)}
      </div>
    </section>
  )
}
