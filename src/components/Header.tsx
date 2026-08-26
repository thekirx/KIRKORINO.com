import { ArrowIcon } from './ArrowIcon'

const inquiryHref = 'mailto:kirkorino@gmail.com?subject=Project%20inquiry%20for%20Kirk%20Orino'

export function Header() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Kirk Orino, back to top">KO<sup>®</sup></a>
      <nav aria-label="Primary navigation">
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#profile">Profile</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="availability-link" href={inquiryHref}>Available for projects <ArrowIcon /></a>
      </nav>
    </header>
  )
}
