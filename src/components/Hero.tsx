import { capabilities } from '../content/practice'
import { ArrowIcon } from './ArrowIcon'
import { FluidHeroTitle } from './FluidHeroTitle'

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-meta meta-text">
        <p>Web designer + developer</p>
        <p>Selected work / 2026</p>
        <p>Manila, PH</p>
      </div>
      <FluidHeroTitle />
      <div className="hero-foot" data-reveal>
        <p>I build sharp digital identities and useful websites for businesses that deserve to be noticed.</p>
        <a className="editorial-link" href="#work">Explore selected work <ArrowIcon direction="down" /></a>
      </div>
      <div className="hero-services" aria-label="Services">
        <div className="hero-services-track">
          {Array.from({ length: 6 }, (_, pass) => (
            <div className="hero-services-run" aria-hidden={pass > 0} key={pass}>
              {capabilities.map((capability) => <span key={capability}>{capability}</span>)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
