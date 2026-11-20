import { createFileRoute, Link } from '@tanstack/react-router'
import { useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Mail, MessageCircle, Lightbulb } from 'lucide-react'
import PageHero from '#/components/PageHero'
import { useRevealOnScroll } from '#/lib/use-reveal'

export const Route = createFileRoute('/contact')({ component: ContactPage })

function ContactPage() {
  const [formNotice, setFormNotice] = useState('')
  const pageRef = useRef<HTMLElement>(null)
  useRevealOnScroll(pageRef, '.contact-section-heading, .contact-card, .contact-form-section, .contact-note, .contact-bottom-inner')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') || '')
    const email = String(form.get('email') || '')
    const topic = String(form.get('topic') || 'General question')
    const message = String(form.get('message') || '')
    const subject = encodeURIComponent(`Learning AI: ${topic}`)
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`)
    window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`
    setFormNotice('Your email app should open with your message ready to send.')
  }

  return (
    <main className="contact-page" ref={pageRef}>
      <PageHero
        wordmark="CONTACT"
        eyebrow="Questions, ideas, and hellos"
        title={<>Let’s talk<br /><em>about AI.</em></>}
        sub="Whether you’re just getting started, untangling an automation, or figuring out an API, we’d love to hear what you’re working on."
        actions={<Link to="/tutor" className="home-button">Ask the tutor instead <ArrowRight size={17} /></Link>}
        phone={{ badge: 'Say hello', title: <>Let’s talk<br />about AI</>, cta: 'Write a message' }}
      />

      <section className="contact-content page-wrap px-4">
        <div className="contact-section-heading"><div><p className="home-eyebrow">Get in touch</p><h2>How can we<br /><em>help you?</em></h2></div><p>Choose the option that fits, and tell us a little about what you need. We’ll point you in the right direction.</p></div>
        <div className="contact-options">
          <article className="contact-card"><div className="contact-icon"><Mail size={22}/></div><p className="topic-eyebrow">General questions</p><h3>Send us a note.</h3><p>Questions about the project, feedback on a guide, or an idea for a new topic? Drop us an email.</p><a href="mailto:hello@example.com" className="contact-card-link">Email Learning AI <ArrowRight size={16}/></a></article>
          <article className="contact-card contact-card-featured"><div className="contact-icon"><Lightbulb size={22}/></div><p className="topic-eyebrow">Help shape what’s next</p><h3>Suggest a topic.</h3><p>Tell us what you want to learn—AI basics, API setup, automation ideas, or a tool you’d like us to explore.</p><a href="mailto:hello@example.com?subject=Learning%20AI%20topic%20suggestion" className="contact-card-link">Share your idea <ArrowRight size={16}/></a></article>
          <article className="contact-card"><div className="contact-icon"><MessageCircle size={22}/></div><p className="topic-eyebrow">Build together</p><h3>Explore a collaboration.</h3><p>Have a project, learning resource, or practical use case you think would help the community? Let’s compare notes.</p><a href="mailto:hello@example.com?subject=Learning%20AI%20collaboration" className="contact-card-link">Start a conversation <ArrowRight size={16}/></a></article>
        </div>
        <section className="contact-form-section">
          <div className="contact-form-heading"><p className="home-eyebrow">Write us a message</p><h2>What’s on<br /><em>your mind?</em></h2><p>Share a question, idea, or challenge. We’ll be glad to hear from you.</p></div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <label>Your name<input name="name" type="text" autoComplete="name" placeholder="Name" required /></label>
              <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
            </div>
            <label>What’s this about?<select name="topic" defaultValue=""><option value="" disabled>Select a topic</option><option>AI learning</option><option>Automation</option><option>AI API setup</option><option>Topic suggestion</option><option>Collaboration</option><option>Other</option></select></label>
            <label>Your message<textarea name="message" rows={5} placeholder="Tell us a little about what you’re working on…" required /></label>
            <div className="contact-form-submit"><button type="submit" className="home-button">Prepare email <ArrowRight size={17}/></button><span>Opens your email app to send the message.</span></div>
            {formNotice && <p className="contact-form-notice" role="status">{formNotice}</p>}
          </form>
        </section>
        <div className="contact-note"><span>✳</span><p><strong>A quick note:</strong> The email address is currently a placeholder. Replace <b>hello@example.com</b> with your preferred contact address before publishing.</p></div>
      </section>
      <section className="contact-bottom green-cta"><div className="page-wrap contact-bottom-inner"><p className="home-eyebrow">Keep exploring</p><h2>Good questions lead<br /><em>to useful things.</em></h2><Link to="/talks" className="home-button">Browse AI topics <ArrowRight size={17}/></Link></div></section>
    </main>
  )
}
