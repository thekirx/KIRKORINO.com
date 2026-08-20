import { ArrowIcon } from './ArrowIcon'

export function Footer() {
  return (
    <footer className="site-footer">
      <span>© 2026 Kirk Orino</span>
      <div>
        <a href="mailto:kirkorino@gmail.com">kirkorino@gmail.com</a>
        <a href="tel:+639310588704">0931 058 8704</a>
      </div>
      <a className="back-to-top" href="#top">Back to top <ArrowIcon direction="up" /></a>
    </footer>
  )
}
