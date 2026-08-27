import { allProjects, featuredProjects } from '../content/projects'
import { CountUp } from './CountUp'
import { capabilities } from '../content/practice'

const industries = [...new Set(allProjects.map(({ category }) => category))]

const stats = [
  { label: 'Projects shipped', items: [], value: allProjects.length },
  { label: 'Industries served', items: industries, value: industries.length },
  { label: 'Featured projects', items: [], value: featuredProjects.length },
  { label: 'Capabilities', items: capabilities, value: capabilities.length },
]

export function Stats() {
  return (
    <section className="stats" aria-labelledby="stats-title">
      <h2 className="meta-text" id="stats-title" data-reveal>The practice in numbers</h2>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat" data-reveal key={stat.label}>
            <p className="stat-label">{stat.label}</p>
            {stat.items.length > 0 && (
              <ul className="stat-items">
                {stat.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
            <p className="stat-value"><CountUp value={stat.value} /></p>
          </div>
        ))}
      </div>
    </section>
  )
}
