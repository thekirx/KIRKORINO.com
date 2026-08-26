import { SplitHeading } from './SplitHeading'

export function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <SplitHeading id="about-title">Not just another website.</SplitHeading>
      <div className="about-copy" data-reveal>
        <span className="meta-text">Approach / 01</span>
        <p>Strategy, design, and development in one focused process—so the finished work feels specific to the business, never assembled from a template.</p>
      </div>
    </section>
  )
}
