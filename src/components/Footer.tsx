import { capabilities } from '../content/practice'
import { featuredProjects } from '../content/projects'
import { ArrowIcon } from './ArrowIcon'

const inquiryHref = 'mailto:kirkorino@gmail.com?subject=Project%20inquiry%20for%20Kirk%20Orino'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-columns">
        <div className="footer-column">
          <p className="footer-heading">Selected work</p>
          <ul>
            {featuredProjects.slice(0, 5).map((project) => (
              <li key={project.slug}><a href={`#project-${project.slug}`}>{project.name}</a></li>
            ))}
            <li><a href="#work">Full archive</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <p className="footer-heading">Capabilities</p>
          <ul>
            {capabilities.map((capability) => <li key={capability}>{capability}</li>)}
          </ul>
        </div>
        <div className="footer-column">
          <p className="footer-heading">Get in touch</p>
          <ul>
            <li><a href={inquiryHref}>kirkorino@gmail.com</a></li>
            <li><a href="tel:+639310588704">0931 058 8704</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <p className="footer-heading">Location</p>
          <ul>
            <li>Manila, Philippines</li>
            <li>Working with clients anywhere</li>
          </ul>
        </div>
      </div>
      <p className="footer-wordmark" aria-hidden="true"><span data-label="Kirk" /><span data-label="Orino" /></p>
      <div className="footer-bar">
        <span>© 2026 Kirk Orino</span>
        <span>Designed and built in Manila</span>
        <a className="back-to-top" href="#top">Back to top <ArrowIcon direction="up" /></a>
      </div>
    </footer>
  )
}
