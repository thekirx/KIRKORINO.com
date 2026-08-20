import { ArrowIcon } from './ArrowIcon'

const capabilities = ['Brand websites', 'E-commerce', 'Booking systems', 'Business software', 'Responsive development']

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <h1>Websites that make businesses impossible to overlook.</h1>
        <div className="hero-support">
          <p>I design and build distinctive websites and useful digital products for ambitious businesses.</p>
          <a className="text-link" href="#work">View selected work <ArrowIcon direction="down" /></a>
        </div>
      </div>
      <div className="capabilities" aria-label="Services">
        <div className="capabilities-track">
          {capabilities.map((capability) => <span key={capability}>{capability}</span>)}
        </div>
      </div>
    </section>
  )
}
