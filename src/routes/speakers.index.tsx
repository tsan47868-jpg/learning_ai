import { createFileRoute, Link } from '@tanstack/react-router'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'

import PageHero from '#/components/PageHero'
import { useRevealOnScroll } from '#/lib/use-reveal'

import { allSpeakers } from 'content-collections'

import SpeakerCard from '#/components/SpeakerCard'
import RemyAssistant from '#/components/RemyAssistant'

export const Route = createFileRoute('/speakers/')({
  component: SpeakersPage,
})

function SpeakersPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(pageRef, '.speakers-heading, .speakers-grid > a, .speakers-cta-inner')

  return (
    <>
      <RemyAssistant />
      <div className="min-h-screen speakers-page" ref={pageRef}>
        <PageHero
          wordmark="SPEAKERS"
          eyebrow="Meet the team"
          title={<>Our <em>Distinguished</em><br />Speakers</>}
          sub="Meet the educators, engineers, and practitioners who design and teach the Learning AI curriculum."
          phone={{ badge: 'The team', title: <>Distinguished<br />speakers</>, cta: 'View guides' }}
        />

        <section className="speakers-list page-wrap px-4">
          <div className="speakers-heading">
            <div>
              <p className="home-eyebrow">Behind the curriculum</p>
              <h2>Guides made by<br /><em>real practitioners.</em></h2>
            </div>
            <p>Every Learning AI guide is shaped by educators, engineers, and builders who use these tools in practice.</p>
          </div>
          <div className="speakers-grid">
            {allSpeakers.map((speaker) => (
              <SpeakerCard key={speaker.slug} speaker={speaker} />
            ))}
          </div>
        </section>

        <section className="speakers-cta green-cta">
          <div className="page-wrap speakers-cta-inner">
            <div>
              <p className="home-eyebrow">Your turn next</p>
              <h2>Ready to start<br /><em>learning?</em></h2>
              <p>Pick a topic, ask the AI tutor, and take your first step today.</p>
            </div>
            <Link to="/talks" className="home-button">Browse AI topics <ArrowRight size={17} /></Link>
          </div>
        </section>
      </div>
    </>
  )
}
