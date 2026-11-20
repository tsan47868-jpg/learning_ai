import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

interface PageHeroProps {
  /** Giant wordmark behind the hero, e.g. "LEARNING AI" or "ABOUT". */
  wordmark: string
  eyebrow: string
  title: ReactNode
  sub: string
  note?: string
  actions?: ReactNode
  phone: { badge: string; title: ReactNode; cta: string }
  className?: string
}

/**
 * Shared hero system inspired by the green showcase design:
 * gradient panel, giant wordmark, left copy, phone mockup on the side,
 * floating AI tutor card. The visual group tilts in 3D with the cursor.
 */
export default function PageHero({ wordmark, eyebrow, title, sub, note, actions, phone, className = '' }: PageHeroProps) {
  const visualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const art = visualRef.current
    if (!art) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const tilt = (event: MouseEvent) => {
      const rect = art.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      art.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`)
      art.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`)
    }
    const reset = () => {
      art.style.setProperty('--ry', '0deg')
      art.style.setProperty('--rx', '0deg')
    }
    art.addEventListener('mousemove', tilt)
    art.addEventListener('mouseleave', reset)
    return () => {
      art.removeEventListener('mousemove', tilt)
      art.removeEventListener('mouseleave', reset)
    }
  }, [])

  return (
    <section className={`page-hero ${className}`}>
      <span className="hero-wordmark" aria-hidden="true">{wordmark}</span>
      <div className="page-hero-inner">
        <div className="page-hero-copy">
          <p className="hero-badge"><Sparkles size={14} /> {eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-hero-sub">{sub}</p>
          {actions && <div className="page-hero-actions">{actions}</div>}
          {note && <p className="page-hero-note">{note}</p>}
        </div>
        <div className="page-hero-visual" ref={visualRef} aria-label="Preview of Learning AI on mobile with the AI tutor">
          <div className="phone-mock" aria-hidden="true">
            <div className="phone-frame">
              <span className="phone-notch" />
              <div className="phone-screen">
                <div className="phone-mini-nav"><b>learning ai</b><i /><i /><i /></div>
                <span className="phone-mini-badge"><Sparkles size={9} /> {phone.badge}</span>
                <div className="phone-mini-title">{phone.title}</div>
                <span className="phone-mini-cta">{phone.cta} <ArrowRight size={9} /></span>
                <div className="phone-mini-cards"><i /><i /><i /></div>
              </div>
            </div>
          </div>
          <Link to="/tutor" className="tutor-float">
            <span className="tutor-orb" aria-hidden="true">✳</span>
            <span className="tutor-float-text"><b>AI tutor</b><small>Ask anything · get a visual</small></span>
            <ArrowRight size={15} />
          </Link>
          <span className="hero-float-chip"><Sparkles size={13} /> New guides weekly</span>
        </div>
      </div>
    </section>
  )
}
