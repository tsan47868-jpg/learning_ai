import type { ReactNode } from 'react'

export interface LegalSection {
  title: string
  content: ReactNode
}

export default function LegalPage({
  label,
  title,
  updated,
  intro,
  sections,
}: {
  label: string
  title: string
  updated: string
  intro: ReactNode
  sections: LegalSection[]
}) {
  return (
    <main className="contact-page">
      <section className="page-wrap px-4 py-12 sm:py-16">
        <header className="mx-auto mb-10 max-w-3xl text-center">
          <p className="home-eyebrow justify-center"><span /> {label}</p>
          <h1 className="mb-4 text-5xl font-medium tracking-tight text-[var(--ink)] sm:text-6xl" style={{ fontFamily: 'Georgia, serif' }}>{title}</h1>
          <p className="m-0 text-sm text-[var(--muted-ink)]">Last updated: {updated}</p>
          <div className="mt-6 text-base leading-8 text-[var(--muted-ink)]">{intro}</div>
        </header>
        <div className="mx-auto grid max-w-4xl gap-5 text-center">
          {sections.map((section, index) => (
            <section key={section.title} className="rounded-xl border border-[var(--line-home)] bg-[#fffefa] p-6 sm:p-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[.14em] text-[#4d9e8d]">{String(index + 1).padStart(2, '0')}</p>
              <h2 className="mb-3 text-2xl font-medium text-[var(--ink)]" style={{ fontFamily: 'Georgia, serif' }}>{section.title}</h2>
              <div className="space-y-3 text-[.95rem] leading-7 text-[var(--muted-ink)]">{section.content}</div>
            </section>
          ))}
        </div>
      </section>
    </main>
  )
}
