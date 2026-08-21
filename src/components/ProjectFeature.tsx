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
    <article
      id={`project-${project.slug}`}
      className={`project-story project-story-${project.slug} ${index < 4 ? 'project-story-primary' : 'project-story-continuation'}`}
      data-testid="featured-project"
    >
      <div className="story-copy">
        <p className="story-kicker">{String(index + 1).padStart(2, '0')} / {project.category}</p>
        <h3>{project.featureHeadline ?? project.name}</h3>
        <p className="story-summary">{project.featureSummary ?? project.description}</p>
        <a
          className="story-link"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.name} live`}
        >
          View live project <ArrowIcon />
        </a>
      </div>
      <a className="story-media" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name} website`}>
        {imageFailed || !project.preview ? (
          <div className={`preview-fallback preview-fallback-${(index % 6) + 1}`} role="img" aria-label={project.previewAlt}>
            <span>{project.name}</span>
          </div>
        ) : (
          <img
            className={`project-image project-image-${project.slug}`}
            src={project.preview}
            alt={project.previewAlt}
            loading={index === 0 ? 'eager' : 'lazy'}
            onError={() => setImageFailed(true)}
          />
        )}
      </a>
    </article>
  )
}
