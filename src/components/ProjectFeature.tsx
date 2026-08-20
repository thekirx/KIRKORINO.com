import { useState } from 'react'
import type { Project } from '../content/projects'
import { ArrowIcon } from './ArrowIcon'

interface ProjectFeatureProps {
  project: Project
  index: number
}

export function ProjectFeature({ project, index }: ProjectFeatureProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="project-feature" data-testid="featured-project">
      <a className="project-media" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name} website`}>
        {imageFailed || !project.preview ? (
          <div className={`preview-fallback preview-fallback-${(index % 6) + 1}`} role="img" aria-label={project.previewAlt}>
            <span>{project.name}</span>
          </div>
        ) : (
          <img src={project.preview} alt={project.previewAlt} loading={index === 0 ? 'eager' : 'lazy'} onError={() => setImageFailed(true)} />
        )}
      </a>
      <div className="project-copy">
        <div>
          <span className="project-number">0{index + 1}</span>
          <p className="project-category">{project.category}</p>
        </div>
        <div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">
            View live project <ArrowIcon />
          </a>
        </div>
      </div>
    </article>
  )
}
