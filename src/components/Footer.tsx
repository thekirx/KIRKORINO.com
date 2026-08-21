import { ArrowIcon } from './ArrowIcon'

export function Footer() {
  return (
    <footer className="site-footer">
      <span>© 2026 Kirk Orino</span>
      <span>Manila, Philippines</span>
      <a className="back-to-top" href="#top">Back to top <ArrowIcon direction="up" /></a>
    </footer>
  )
}
