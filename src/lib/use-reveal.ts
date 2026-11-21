import { useEffect, type RefObject } from 'react'

/**
 * Adds a fade-up reveal-on-scroll animation to every element matching
 * `selector` inside `ref`, staggered by CSS. Elements are shown once and
 * then unobserved. Falls back to showing everything when IntersectionObserver
 * is unavailable, and the animation is neutralised by prefers-reduced-motion.
 */
export function useRevealOnScroll<T extends HTMLElement>(
  ref: RefObject<T | null>,
  selector: string,
) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const targets = Array.from(root.querySelectorAll<HTMLElement>(selector))
    if (targets.length === 0) return

    if (!('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-revealed'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    targets.forEach((target) => {
      target.classList.add('reveal-on-scroll')
      observer.observe(target)
    })

    return () => observer.disconnect()
  }, [ref, selector])
}
