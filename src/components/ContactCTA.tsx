import { ArrowIcon } from './ArrowIcon'
import { SplitHeading } from './SplitHeading'

const inquiryHref = 'mailto:kirkorino@gmail.com?subject=Project%20inquiry%20for%20Kirk%20Orino'

export function ContactCTA() {
  return (
    <section className="contact-cta" id="contact" aria-labelledby="contact-title">
      <span className="meta-text" data-reveal>New business / 2026</span>
      <SplitHeading id="contact-title">Let’s make it impossible to ignore.</SplitHeading>
      <div className="contact-actions" data-reveal>
        <a className="contact-email" href={inquiryHref}>Email Kirk <ArrowIcon /></a>
        <a className="phone-link" href="tel:+639310588704">Call 0931 058 8704</a>
      </div>
    </section>
  )
}
