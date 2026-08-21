import { ArrowIcon } from './ArrowIcon'

const inquiryHref = 'mailto:kirkorino@gmail.com?subject=Project%20inquiry%20for%20Kirk%20Orino'

export function ContactCTA() {
  return (
    <section className="contact-cta" id="contact" aria-labelledby="contact-title">
      <span className="meta-text">New business / 2026</span>
      <h2 id="contact-title">Let’s make it impossible to ignore.</h2>
      <div className="contact-actions">
        <a className="contact-email" href={inquiryHref}>Email Kirk <ArrowIcon /></a>
        <a className="phone-link" href="tel:+639310588704">Call 0931 058 8704</a>
      </div>
    </section>
  )
}
