import { archiveProjects, type ProjectCategory } from '../content/projects'
import { ArrowIcon } from './ArrowIcon'
import { SplitHeading } from './SplitHeading'

const categoryOrder: ProjectCategory[] = [
  'Hospitality',
  'Sports & Wellness',
  'Software & Systems',
  'Retail',
  'Automotive',
  'Healthcare',
  'Business Services',
  'Experiments',
]

export function ProjectArchive() {
  // Anything whose category is missing from the running order still has to be
  // listed, or a catalogue entry disappears from the page without a trace.
  const orderedProjects = [
    ...categoryOrder.flatMap((category) => archiveProjects.filter((project) => project.category === category)),
    ...archiveProjects.filter((project) => !categoryOrder.includes(project.category)),
  ]

  return (
    <section className="project-archive" aria-labelledby="archive-title">
      <div className="archive-intro" data-reveal>
        <p className="meta-text">Full archive / {archiveProjects.length}</p>
        <SplitHeading id="archive-title">The wider body of work.</SplitHeading>
      </div>
      <div className="archive-list">
        {orderedProjects.map((project, index) => (
          <a data-testid="archive-project" data-reveal key={project.slug} href={project.url} target="_blank" rel="noopener noreferrer">
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
