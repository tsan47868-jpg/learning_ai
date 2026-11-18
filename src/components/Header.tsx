import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="learning-header">
      <nav className="page-wrap header-inner" aria-label="Main navigation">
        <Link to="/" className="header-logo" aria-label="Learning AI home">
          <span className="header-logo-mark">AI</span>
          <span>Learning <b>AI</b></span>
        </Link>
        <div className="header-nav">
          <Link to="/talks" activeProps={{ className: 'header-link is-current' }} className="header-link">Learn</Link>
          <Link to="/about" activeProps={{ className: 'header-link is-current' }} className="header-link">About</Link>
          <Link to="/contact" activeProps={{ className: 'header-link is-current' }} className="header-link">Contact</Link>
        </div>
        <div className="header-actions"><ThemeToggle /><Link to="/talks" className="header-cta">Explore topics <span>↗</span></Link></div>
      </nav>
    </header>
  )
}
