import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen, Compass, Heart, Lightbulb, Sparkles, Workflow } from 'lucide-react'

export const Route = createFileRoute('/about')({ component: AboutPage })

const principles = [
  { icon: BookOpen, number: '01', title: 'Start with clarity', text: 'AI can feel like a lot at once. We break big ideas into plain language, useful examples, and steps you can try for yourself.' },
  { icon: Lightbulb, number: '02', title: 'Make it practical', text: 'The best way to learn is to put an idea to work. Explore real tasks, small experiments, and projects you can make your own.' },
  { icon: Heart, number: '03', title: 'Keep people in the picture', text: 'Good tools support human judgment. We make room for questions about privacy, accuracy, and responsible use along the way.' },
]

const steps = [
  { icon: Compass, title: 'Get curious', text: 'Find an idea or a task you would like to understand better.' },
  { icon: BookOpen, title: 'Learn by trying', text: 'Follow a guide, test a tool, and see what happens.' },
  { icon: Workflow, title: 'Make it useful', text: 'Keep what works and build it into your everyday practice.' },
]

function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero page-wrap px-4">
        <div className="about-hero-copy">
          <p className="home-eyebrow"><span /> A little about us</p>
          <h1>AI is easier<br />when we learn<br /><em>it together.</em></h1>
          <p>Learning AI is a welcoming place to make sense of new technology. We share approachable explanations and practical ideas to help you go from curious to confident, one useful step at a time.</p>
          <Link to="/talks" className="home-button">Explore what you can learn <ArrowRight size={17} /></Link>
        </div>
        <div className="about-hero-art" aria-label="An illustrated learning notebook surrounded by ideas">
          <div className="about-art-orbit orbit-a" /><div className="about-art-orbit orbit-b" />
          <span className="about-art-spark spark-one">✳</span><span className="about-art-spark spark-two">✦</span>
          <div className="about-note"><span className="about-note-label">A NOTE TO THE CURIOUS</span><div className="about-note-symbol">✳</div><strong>Ask a question.<br /><em>Try an idea.</em></strong><span className="about-note-foot">There’s always a place to begin.</span></div>
          <div className="about-float float-left"><Sparkles size={16} /> Stay curious</div>
          <div className="about-float float-right"><Workflow size={16} /> Make it useful</div>
        </div>
      </section>

      <section className="about-ribbon"><div className="page-wrap about-ribbon-inner"><span>✳</span><p>Less overwhelm. More understanding.</p><i /><p>Skills for the things you want to do.</p><span>✳</span></div></section>

      <section className="about-story page-wrap px-4 py-20 sm:py-28">
        <div className="about-story-mark" aria-hidden="true">“</div>
        <div className="about-story-copy"><p className="home-eyebrow">Why Learning AI exists</p><h2>Technology moves fast.<br /><em>Learning can feel human.</em></h2><p>There’s no shortage of new tools or big promises. What’s harder to find is a calm, clear way to understand what those tools actually do—and how they might fit into your life.</p><p>That’s why we’re building a practical learning space for everyday explorers and makers. Start with the question you have today. Learn the idea behind it. Then decide what you want to do next.</p></div>
      </section>

      <section className="about-principles page-wrap px-4 py-20 sm:py-24">
        <div className="about-section-heading"><div><p className="home-eyebrow">What guides us</p><h2>Useful, thoughtful,<br /><em>and open to everyone.</em></h2></div><p>AI learning should meet you where you are and help you move forward with confidence.</p></div>
        <div className="about-principle-grid">{principles.map(({ icon: Icon, number, title, text }) => <article className="about-principle" key={number}><div className="about-principle-top"><span>{number}</span><Icon size={21} strokeWidth={1.7} /></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="about-approach-band"><div className="page-wrap about-approach px-4"><div className="about-approach-heading"><p className="home-eyebrow">A simple way forward</p><h2>Curiosity turns<br /><em>into capability.</em></h2><p>You do not need to know it all before you begin. Pick a starting point, experiment at your own pace, and grow from there.</p></div><div className="about-steps">{steps.map(({ icon: Icon, title, text }, index) => <article className="about-step" key={title}><div className="about-step-icon"><Icon size={20} /></div><span>STEP 0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="about-cta page-wrap px-4 py-20 sm:py-24"><div className="about-cta-box"><div><p className="home-eyebrow">Your next step starts here</p><h2>Bring a question.<br /><em>Leave with an idea.</em></h2><p>Browse a topic, ask the AI tutor, or simply follow your curiosity.</p></div><div className="about-cta-actions"><Link to="/talks" className="home-button">Explore AI topics <ArrowRight size={17} /></Link><Link to="/tutor" className="about-secondary-link">Meet your AI tutor <ArrowRight size={15} /></Link></div><span className="about-cta-spark">✳</span></div></section>
    </main>
  )
}
