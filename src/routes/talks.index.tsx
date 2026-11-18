import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Brain, Workflow, KeyRound, Code2, ShieldCheck, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/talks/')({ component: AiAboutPage })

const areas = [
  { icon: Brain, label: 'Start with the basics', title: 'AI foundations', text: 'Get familiar with artificial intelligence, machine learning, and generative AI. Learn what these systems can do and where their limits are.' },
  { icon: Workflow, label: 'Make work flow', title: 'Automation', text: 'Connect tools and design workflows that handle repetitive tasks, move information, and save time.' },
  { icon: KeyRound, label: 'Connect the pieces', title: 'AI API setup', text: 'Learn the basics of API keys, configuration, requests, and connecting AI services to your apps.' },
  { icon: Code2, label: 'Learn by doing', title: 'Build with AI', text: 'Experiment with prompts and simple projects that put AI capabilities to work in practical ways.' },
  { icon: ShieldCheck, label: 'Build with care', title: 'Responsible use', text: 'Think about privacy, security, accuracy, and human review when using AI in real workflows.' },
  { icon: Sparkles, label: 'Stay curious', title: 'Keep exploring', text: 'Discover tools and techniques, then choose what is useful for your goals and your everyday work.' },
]

function AiAboutPage() {
  return (
    <main className="topics-page">
      <section className="topics-hero page-wrap px-4">
        <div className="topics-hero-copy"><p className="home-eyebrow"><span/> Learn at your own pace</p><h1>AI is easier<br/><em>when you explore.</em></h1><p>Start with what interests you. Build understanding, try practical tools, and turn what you learn into skills you can use.</p><Link to="/contact" className="home-button">Ask a question <ArrowRight size={17}/></Link></div>
        <div className="topics-hero-art"><div className="topics-orbit"/><div className="topics-art-center"><Brain size={50}/><span>AI, made<br/>approachable</span></div><span className="topics-tag tag-one">Understand</span><span className="topics-tag tag-two">Experiment</span><span className="topics-tag tag-three">Build</span><Sparkles className="topics-spark" size={24}/></div>
      </section>
      <section className="topics-list page-wrap px-4">
        <div className="topics-heading"><div><p className="home-eyebrow">Explore the learning path</p><h2>Choose a place<br/><em>to begin.</em></h2></div><p>There’s no single right way to learn AI. Pick a topic, follow your curiosity, and come back when you’re ready for the next step.</p></div>
        <div className="topics-grid">{areas.map(({icon:Icon,label,title,text},index)=><article className="topics-card" key={title}><div className="topics-card-top"><span>0{index+1}</span><Icon size={22}/></div><p className="topic-eyebrow">{label}</p><h3>{title}</h3><p className="topics-card-copy">{text}</p><Link to="/contact" className="topic-link">Ask about this <ArrowRight size={15}/></Link></article>)}</div>
      </section>
      <section className="topics-bottom"><div className="page-wrap topics-bottom-inner"><div><p className="home-eyebrow">Keep moving forward</p><h2>Small steps.<br/><em>Useful skills.</em></h2><p>Have a question or an idea for a topic? We’re always glad to hear what you’re learning.</p></div><Link to="/contact" className="home-button">Get in touch <ArrowRight size={17}/></Link></div></section>
    </main>
  )
}
