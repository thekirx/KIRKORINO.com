const steps = [
  {
    title: 'Discovery',
    tagline: 'Understand the business first',
    body: 'We talk before anything gets designed—what the business does, who it serves, and what the site actually has to accomplish.',
  },
  {
    title: 'Direction',
    tagline: 'Decide before designing',
    body: 'Structure, tone, and a visual direction get agreed up front, so the build isn’t a guessing game and revisions stay cheap.',
  },
  {
    title: 'Design + build',
    tagline: 'One person, end to end',
    body: 'Design and development happen in the same pass. Nothing is lost in a handoff, because there isn’t one.',
  },
  {
    title: 'Launch + aftercare',
    tagline: 'Shipped, then supported',
    body: 'Deployed, checked on real devices, and handed over—with me still reachable when the business needs a change.',
  },
]

import { SplitHeading } from './SplitHeading'

export function Process() {
  return (
    <section className="process" id="process" aria-labelledby="process-title">
      <div className="process-intro" data-reveal>
        <p className="meta-text">How it works / 04</p>
        <SplitHeading id="process-title">How the work actually gets built.</SplitHeading>
        <p className="process-lede">
          Every project runs the same way, whether it’s a one-page brand site or a business system: understand first,
          decide second, build once.
        </p>
      </div>
      <ol className="process-steps">
        {steps.map((step, index) => (
          <li className="process-step" data-reveal key={step.title}>
            <p className="step-label">
              <span>Step</span>
              <span className="step-number">{String(index + 1).padStart(3, '0')}</span>
            </p>
            <h3>{step.title}</h3>
            <p className="step-tagline">{step.tagline}</p>
            <p className="step-body">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
