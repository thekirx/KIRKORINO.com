import { ArrowIcon } from './ArrowIcon'

const inquiryHref = 'mailto:kirkorino@gmail.com?subject=Project%20inquiry%20for%20Kirk%20Orino'

export function ContactCTA() {
  return (
    <section className="contact-cta" aria-labelledby="contact-title">
      <h2 id="contact-title">Have a business worth noticing?</h2>
      <p>Tell me what you’re building and let’s make the website match the ambition.</p>
      <div className="contact-actions">
        <a className="button" href={inquiryHref}>Email Kirk <ArrowIcon /></a>
        <a className="phone-link" href="tel:+639310588704">Call 0931 058 8704</a>
      </div>
    </section>
  )
}
