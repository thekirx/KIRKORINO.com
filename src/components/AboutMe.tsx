import { aboutParagraphs, portrait, socialLinks } from '../content/profile'
import { ArrowIcon } from './ArrowIcon'
import { SplitHeading } from './SplitHeading'

export function AboutMe() {
  return (
    <section className="about-me" id="profile" aria-labelledby="about-me-title">
      <div className="about-me-portrait" data-reveal>
        <img
          alt={portrait.alt}
          decoding="async"
          height={portrait.height}
          loading="lazy"
          src={portrait.src}
          width={portrait.width}
        />
      </div>
      <div className="about-me-copy">
        <p className="meta-text" data-reveal>About / 02</p>
        <SplitHeading id="about-me-title">Hi, I’m Kirk.</SplitHeading>
        <div className="about-me-body" data-reveal>
          {aboutParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        {socialLinks.length > 0 && (
          <ul className="about-me-socials" data-reveal>
            {socialLinks.map((link) => (
              <li key={link.url}>
                <a href={link.url} rel="noopener noreferrer" target="_blank">
                  <span>{link.name}</span>
                  {link.note ? <span className="social-note">{link.note}</span> : null}
                  <ArrowIcon />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
