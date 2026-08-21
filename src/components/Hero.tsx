import { ArrowIcon } from './ArrowIcon'
import { FluidHeroTitle } from './FluidHeroTitle'

const capabilities = ['Brand websites', 'E-commerce', 'Booking systems', 'Business software', 'Responsive development']

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
        {capabilities.map((capability) => <span key={capability}>{capability}</span>)}
      </div>
    </section>
  )
}
