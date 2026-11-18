import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Sparkles } from 'lucide-react'

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'X', href: 'https://x.com' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="learning-footer">
      <div className="page-wrap px-4">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo"><span className="footer-logo-mark">AI</span><span>Learning <b>AI</b></span></Link>
            <p>Practical AI learning for curious people, thoughtful builders, and anyone ready to make technology useful.</p>
            <span className="footer-note"><Sparkles size={14} /> Learn it. Build it. Put it to work.</span>
          </div>
          <div className="footer-links">
            <div><h2>Explore</h2><Link to="/talks">AI topics</Link><Link to="/about">About the project</Link><Link to="/contact">Get in touch</Link></div>
            <div><h2>Information</h2><a href="/terms">Terms &amp; Conditions</a><a href="/privacy">Privacy Policy</a><a href="/cookies">Cookie Policy</a></div>
            <div><h2>Follow along</h2><p>Ideas, learning, and practical ways to use AI.</p><div className="footer-socials">{socialLinks.map(({ label, href }) => <a href={href} key={label} target="_blank" rel="noreferrer">{label}<ArrowUpRight size={13} /></a>)}</div></div>
          </div>
        </div>
        <div className="footer-bottom"><p>© {year} Learning AI. All rights reserved.</p><p>Made for learning, built for what’s next.</p></div>
      </div>
    </footer>
  )
}
