const inquiryHref = 'mailto:kirkorino@gmail.com?subject=Project%20inquiry%20for%20Kirk%20Orino'

export function Header() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Kirk Orino, back to top">Kirk Orino</a>
      <nav aria-label="Primary navigation">
        <a className="nav-secondary" href="#work">Work</a>
        <a className="nav-secondary" href="#about">About</a>
        <a className="button button-small" href={inquiryHref}>Start a project</a>
      </nav>
    </header>
  )
}
