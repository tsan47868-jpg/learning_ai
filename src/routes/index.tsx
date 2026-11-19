import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen, Workflow, KeyRound, Code2, ShieldCheck, Sparkles, Play, Check, Compass, TrendingUp, Rocket, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({ component: HomePage })

const topics = [
  { icon: BookOpen, eyebrow: 'Start with the basics', title: 'Understand AI', text: 'Make sense of AI, machine learning, and generative tools. Learn what they can do and where they need a human in the loop.' },
  { icon: Workflow, eyebrow: 'Make work flow', title: 'Build automations', text: 'Connect the tools you already use and turn repeatable tasks into dependable workflows.' },
  { icon: KeyRound, eyebrow: 'Connect the pieces', title: 'Set up AI APIs', text: 'Get comfortable with API keys, configuration, and bringing AI services into your projects.' },
  { icon: Code2, eyebrow: 'Learn by doing', title: 'Make useful projects', text: 'Follow practical examples and shape what you learn into small tools that solve real problems.' },
  { icon: ShieldCheck, eyebrow: 'Build with care', title: 'Use AI responsibly', text: 'Keep privacy, accuracy, security, and human judgment in mind as you build.' },
  { icon: Sparkles, eyebrow: 'Stay curious', title: 'Explore what’s next', text: 'Discover new tools and ideas, then decide what is actually useful for your goals.' },
]

const journeyStages = [
  { icon: Compass, title: 'Build', intro: 'Get the foundations in place and start making things.', list: ['Understand the core ideas behind AI', 'Choose tools that fit your goals', 'Set up your first AI API or workflow'], milestone: 'You made your first AI project!', actions: ['Explore AI basics', 'Try a first prompt'] },
  { icon: TrendingUp, title: 'Grow', intro: 'Put your new skills to work on problems that matter.', list: ['Automate a task you repeat every week', 'Connect AI to the tools you already use', 'Improve your project with real feedback'], milestone: 'Your workflow is saving you time!', actions: ['Build an automation', 'Connect an API'] },
  { icon: Rocket, title: 'Scale', intro: 'Refine what works and take on bigger ideas.', list: ['Make your AI workflows more reliable', 'Build a tool around your own process', 'Share what you learned and help others'], milestone: 'You’re ready for what’s next!', actions: ['Ship a useful tool', 'Explore advanced ideas'] },
]

const journeyNotes = [
  { text: 'Try your first prompt', side: 'left' },
  { text: 'Find a task to automate', side: 'right' },
  { text: 'Connect AI to your tools', side: 'left' },
  { text: 'Make something useful', side: 'right' },
  { text: 'Keep what works', side: 'left' },
]

const faqs = [
  { question: 'Can I learn AI without a technical background?', answer: 'Absolutely. Start with the foundations, then build up at your own pace. The learning path is designed to make AI approachable for beginners and useful for builders.' },
  { question: 'What should I learn first: AI basics or prompting?', answer: 'Start with the basics so you understand what AI can and cannot do. Then practise writing prompts and reviewing the results.' },
  { question: 'How can I use AI in my everyday work?', answer: 'Try it for brainstorming, drafting, summarising, research, or a repetitive task. Review important outputs and keep human judgment in the loop.' },
  { question: 'Do I need to code to build an AI project?', answer: 'No. You can begin with prompts and no-code tools. Coding becomes useful when you want to customise a project or connect an AI API.' },
  { question: 'How do I choose the right AI tools?', answer: 'Begin with the task you want to solve. Compare tools by how well they fit your needs, privacy expectations, and workflow.' },
  { question: 'How do AI and automations work together?', answer: 'Automations connect steps across your apps. AI can add capabilities such as drafting text, sorting information, or extracting details along the way.' },
  { question: 'What should I keep in mind when using AI responsibly?', answer: 'Protect private information, check outputs for accuracy, and use your own judgment—especially when the result matters.' },
  { question: 'Can I suggest a topic for a future guide?', answer: 'Yes. Visit the contact page to ask a question or suggest a guide on AI basics, APIs, automations, or a tool you would like us to explore.' },
]

function HomePage() {
  const journeyRef = useRef<HTMLElement>(null)
  const heroArtRef = useRef<HTMLDivElement>(null)
  const [journeyProgress, setJourneyProgress] = useState(0)

  // 3D tilt: the hero scene follows the cursor with depth-separated layers.
  useEffect(() => {
    const art = heroArtRef.current
    if (!art) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const tilt = (event: MouseEvent) => {
      const rect = art.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      art.style.setProperty('--ry', `${(x * 13).toFixed(2)}deg`)
      art.style.setProperty('--rx', `${(-y * 9).toFixed(2)}deg`)
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

  useEffect(() => {
    const section = journeyRef.current
    if (!section) return
    const cards = section.querySelectorAll('.journey-stage')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          setJourneyProgress((current) => Math.max(current, Number((entry.target as HTMLElement).dataset.stage || 0) + 1))
        }
      })
    }, { threshold: 0.25 })
    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      '.learning-home .section-heading, .learning-home .topic-card, .learning-home .manifesto-inner, .learning-home .journey-heading, .learning-home .closing-cta .cta-box, .learning-home .faq-heading, .learning-home .faq-item',
    )
    const notes = document.querySelectorAll<HTMLElement>('.learning-home .journey-sticky-note')
    if (!('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-revealed'))
      notes.forEach((note) => note.classList.add('is-pinned'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })

    targets.forEach((target) => {
      target.classList.add('reveal-on-scroll')
      observer.observe(target)
    })

    const noteObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-pinned')
          noteObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.4 })

    notes.forEach((note) => {
      note.classList.add('note-armed')
      noteObserver.observe(note)
    })
    return () => {
      observer.disconnect()
      noteObserver.disconnect()
    }
  }, [])
  return (
    <main className="learning-home">
      <section className="home-hero page-wrap px-4 py-16 sm:py-24">
        <div className="hero-copy">
          <p className="home-eyebrow"><span /> Practical AI, made approachable</p>
          <h1>Make AI work<br /><em>for you.</em></h1>
          <p className="hero-intro">Learn the tools, build useful automations, and connect AI to the things you want to make. Clear guidance for curious people, beginners, and builders.</p>
          <div className="hero-actions">
            <Link to="/talks" className="home-button">Explore AI topics <ArrowRight size={17} /></Link>
            <a href="#learning-path" className="home-text-link"><Play size={15} /> See what you can learn</a>
          </div>
          <p className="hero-note">No hype. Just useful skills, learned one step at a time.</p>
        </div>
        <div className="hero-art" ref={heroArtRef} aria-label="Illustration of connected AI tools">
          <div className="hero-3d">
            <div className="hero-sway">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" />
              <div className="art-card art-main"><span className="art-kicker">IDEA → IMPACT</span><div className="art-brain">✳</div><strong>Learn it.<br />Build it.</strong><span className="art-caption">AI skills for real life</span></div>
              <div className="art-chip chip-top"><Sparkles size={16} /> Generative AI</div>
              <div className="art-chip chip-right"><Workflow size={16} /> Automation</div>
              <div className="art-chip chip-bottom"><KeyRound size={16} /> APIs</div>
              <span className="art-spark spark-a">✳</span><span className="art-spark spark-b">✦</span>
            </div>
          </div>
        </div>
      </section>

      <section className="proof-strip"><div className="page-wrap proof-inner"><span className="proof-star">✳</span><p>Curiosity is a great place to start.</p><span className="proof-rule"/><p>Build skills you can put to work.</p><span className="proof-star">✳</span></div></section>

      <section className="learning-section page-wrap px-4 py-20 sm:py-28" id="learning-path">
        <div className="section-heading"><div><p className="home-eyebrow">A practical learning path</p><h2>Find your way<br /><em>into AI.</em></h2></div><p className="section-summary">Whether you’re starting from scratch or ready to build, explore the ideas and tools that help turn AI into something useful.</p></div>
        <div className="topic-grid">{topics.map(({ icon: Icon, eyebrow, title, text }, i) => <article className="topic-card" key={title}><div className="topic-top"><span>0{i + 1}</span><Icon size={21} /></div><p className="topic-eyebrow">{eyebrow}</p><h3>{title}</h3><p className="topic-copy">{text}</p><Link to="/talks" className="topic-link">Explore topic <ArrowRight size={15} /></Link></article>)}</div>
      </section>

      <section className="manifesto-band"><div className="page-wrap manifesto-inner"><span className="manifesto-mark">“</span><div><p className="home-eyebrow">The idea behind Learning AI</p><h2>Technology should open doors,<br /><em>not make things harder.</em></h2><p>We’re here to make AI easier to understand and more practical to use—so you can spend less time feeling stuck and more time creating, learning, and moving forward.</p></div></div></section>

      <section className="journey-section page-wrap px-4 py-20 sm:py-28" ref={journeyRef}>
        <div className="journey-heading"><p className="home-eyebrow">A path you can take at your own pace</p><h2>You’re not building<br /><em>this alone.</em></h2><p>Grow your AI skills step by step. Start with a first project, find ways to make it useful, then build on what works.</p></div>
        <div className="journey-track" style={{ '--journey-progress': `${journeyProgress * 33.33}%` } as React.CSSProperties}>
          <svg className="journey-curve" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="journeyGradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#7396cd"/><stop offset=".52" stopColor="#e07a5f"/><stop offset="1" stopColor="#dda45e"/></linearGradient></defs><path className="journey-curve-base" d="M50 0 C50 70 15 80 15 165 S85 250 85 330 S15 420 15 500 S85 590 85 670 S15 760 15 840 S50 920 50 1000"/><path className="journey-curve-progress" d="M50 0 C50 70 15 80 15 165 S85 250 85 330 S15 420 15 500 S85 590 85 670 S15 760 15 840 S50 920 50 1000"/></svg>
          <div className="journey-sticky-notes" aria-hidden="true">{journeyNotes.map((note,index)=><span className={`journey-sticky-note note-${index+1} ${note.side}`} key={note.text}><i>{note.text}</i><b>✳</b></span>)}</div>
          {journeyStages.map(({icon:Icon,title,intro,list,milestone,actions},index)=><article className="journey-stage" data-stage={index} key={title}>
            <div className="stage-marker"><span>{String(index+1).padStart(2,'0')}</span></div>
            <div className="stage-card"><div className="stage-card-head"><span className="stage-icon"><Icon size={21}/></span><span className="stage-label">STAGE 0{index+1}</span></div><h3>{title}</h3><p className="stage-intro">{intro}</p><ul className="stage-checklist">{list.map(item=><li key={item}><span className="check-pop"><Check size={13}/></span>{item}</li>)}</ul><div className="stage-actions">{actions.map(action=><Link to="/talks" className="stage-pill" key={action}>{action}<ArrowRight size={13}/></Link>)}</div><div className="milestone-card"><span>✳ Milestone</span><strong>{milestone}</strong></div></div>
          </article>)}
        </div>
        <Link to="/talks" className="home-button journey-cta">See your learning path <ArrowRight size={17}/></Link>
      </section>

      <section className="closing-cta page-wrap px-4 py-20 sm:py-28"><div className="cta-box"><div><p className="home-eyebrow">Your next step starts here</p><h2>Curious about AI?<br /><em>Let’s make it useful.</em></h2><p>Explore a topic, follow an idea, and build something that makes your day a little easier.</p></div><Link to="/talks" className="home-button">Start exploring <ArrowRight size={17} /></Link><span className="cta-decoration">✳</span></div></section>
      <section className="faq-section page-wrap px-4 py-20 sm:py-24">
        <div className="faq-heading"><p className="home-eyebrow">A little clarity goes a long way</p><h2>Common questions</h2><p>Quick answers to help you find your next step with AI.</p></div>
        <div className="faq-list">{faqs.map(({question,answer})=><details className="faq-item" key={question}><summary>{question}<span className="faq-toggle"><Plus size={13}/></span></summary><p>{answer}</p></details>)}</div>
      </section>
    </main>
  )
}
