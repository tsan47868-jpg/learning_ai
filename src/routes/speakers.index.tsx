import { createFileRoute } from '@tanstack/react-router'

import PageHero from '#/components/PageHero'

import { allSpeakers } from 'content-collections'

import SpeakerCard from '#/components/SpeakerCard'
import RemyAssistant from '#/components/RemyAssistant'

export const Route = createFileRoute('/speakers/')({
  component: SpeakersPage,
})

function SpeakersPage() {
  return (
    <>
      <RemyAssistant />
      <div className="min-h-screen">
        <PageHero
          wordmark="SPEAKERS"
          eyebrow="Meet the team"
          title={<>Our <em>Distinguished</em><br />Speakers</>}
          sub="Meet the educators, engineers, and practitioners who design and teach the Learning AI curriculum."
          phone={{ badge: 'The team', title: <>Distinguished<br />speakers</>, cta: 'View guides' }}
        />

        {/* Speakers grid */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allSpeakers.map((speaker) => (
              <SpeakerCard key={speaker.slug} speaker={speaker} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
