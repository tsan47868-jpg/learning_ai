import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUp, BookOpen, MessagesSquare, RotateCcw, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Streamdown } from 'streamdown'
import { useConferenceChat } from '#/lib/conference-ai-hook'
import type { ConferenceChatMessages } from '#/lib/conference-ai-hook'
import TutorDrawingBoard from '#/components/TutorDrawingBoard'

export const Route = createFileRoute('/tutor')({ component: TutorPage })

const suggestions = [
  'Draw a diagram showing how generative AI works',
  'Help me write my first AI prompt',
  'How do AI APIs work?',
]

const CHAT_HISTORY_KEY = 'learning-ai-tutor-history-v1'

interface SavedConversation {
  id: string
  title: string
  updatedAt: number
  messages: ConferenceChatMessages
}

function conversationTitle(messages: ConferenceChatMessages) {
  const firstUser = messages.find((message) => message.role === 'user')
  const title = firstUser?.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.content || '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  return title ? (title.length > 42 ? `${title.slice(0, 42).trim()}…` : title) : 'New conversation'
}

function conversationPreview(messages: ConferenceChatMessages) {
  const lastUser = [...messages].reverse().find((message) => message.role === 'user')
  const preview = lastUser?.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.content || '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  return preview ? `You: ${preview}` : 'Open to view this conversation'
}

function createConversationId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `tutor-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function findLatestDrawing(messages: ReturnType<typeof useConferenceChat>['messages']) {
  const reversed = [...messages].reverse()
  for (const [index, message] of reversed.entries()) {
    if (message.role !== 'assistant') continue
    const text = message.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.content || '')
      .join('\n')
    for (const part of message.parts) {
      if (part.type !== 'text' || !part.content) continue
      const match = part.content.match(/```(?:html|drawing)\s*([\s\S]*?)```/i)
      if (match) return match[1].trim()
    }

    const question = reversed.slice(index + 1).find((previous) => previous.role === 'user')
    const questionText = question?.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.content || '')
      .join(' ')
    const cleanAnswer = text
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/[#*_>`]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    const sentences = cleanAnswer.match(/[^.!?]+[.!?]?/g)?.map((sentence) => sentence.trim()).filter(Boolean) || []
    const labels = [
      questionText ? `Question: ${questionText}` : 'Your question',
      sentences[0] || 'Core idea',
      sentences[1] || 'See how the idea works',
      sentences[2] || 'Apply it with an example',
    ].map((label) => label.replace(/[\[\]"'|<>]/g, '').replace(/\s+/g, ' ').slice(0, 52).trim())
    const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    return `<style>
      *{box-sizing:border-box}.ai-map{font:16px 'Segoe Print','Comic Sans MS',cursive;color:#214b42;max-width:470px;margin:12px auto;display:grid;gap:12px}.ai-step{position:relative;padding:17px 19px;border:1px solid #a8cbbb;border-radius:15px;background:linear-gradient(135deg,#f5fbf5,#e8f3e9);text-align:center;box-shadow:0 8px 20px #214b4210}.ai-step:nth-child(even){background:linear-gradient(135deg,#fffaf0,#fbf3df)}.ai-step b{display:block;margin-bottom:5px;color:#598c7e;font-size:12px;letter-spacing:.08em;text-transform:uppercase}
    </style><div id="ai-board">${labels.map((label, index) => `<div class="ai-node ai-step"><b>${['Question', 'Key idea', 'How it works', 'Example'][index]}</b>${escapeHtml(label)}</div>`).join('')}</div>`
  }
  return undefined
}

function TutorPage() {
  const [history, setHistory] = useState<SavedConversation[]>([])
  const [historyReady, setHistoryReady] = useState(false)
  const [activeChatId, setActiveChatId] = useState('learning-ai-tutor')
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false)
  const savedActiveChat = history.find((conversation) => conversation.id === activeChatId)
  const { messages, sendMessage, isLoading } = useConferenceChat(activeChatId, savedActiveChat?.messages)
  const [input, setInput] = useState('')
  const [diagram, setDiagram] = useState<string>()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CHAT_HISTORY_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as SavedConversation[]
        if (Array.isArray(parsed)) {
          setHistory(parsed.filter((item) => item && typeof item.id === 'string' && Array.isArray(item.messages)))
          if (parsed[0]?.id) setActiveChatId(parsed[0].id)
        }
      }
    } catch {
      window.localStorage.removeItem(CHAT_HISTORY_KEY)
    }
    setHistoryReady(true)
  }, [])

  useEffect(() => {
    if (historyReady) window.localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history))
  }, [history, historyReady])

  useEffect(() => {
    if (!historyReady || isLoading || !messages.length) return
    const savedConversation: SavedConversation = {
      id: activeChatId,
      title: conversationTitle(messages),
      updatedAt: Date.now(),
      messages,
    }
    setHistory((current) => [savedConversation, ...current.filter((item) => item.id !== activeChatId)])
  }, [activeChatId, historyReady, isLoading, messages])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const submit = (text = input) => {
    if (!text.trim() || isLoading) return
    sendMessage(text.trim())
    setInput('')
  }
  const startNewChat = () => {
    setDiagram(undefined)
    setActiveChatId(createConversationId())
    setMobileHistoryOpen(false)
  }
  const openConversation = (conversation: SavedConversation) => {
    if (isLoading) return
    setDiagram(findLatestDrawing(conversation.messages))
    setActiveChatId(conversation.id)
    setMobileHistoryOpen(false)
  }
  const latestQuestion = [...messages].reverse().find((message) => message.role === 'user')?.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.content)
    .join(' ')
  const completedDiagram = findLatestDrawing(messages)
  useEffect(() => {
    if (!isLoading && completedDiagram) setDiagram(completedDiagram)
  }, [completedDiagram, isLoading])

  return (
    <main className="tutor-page">
      <section className="tutor-shell">
        <header className="tutor-heading">
          <Link to="/" className="tutor-home-link" aria-label="Back to Learning AI">AI</Link>
          <button type="button" className="tutor-mobile-history" onClick={() => setMobileHistoryOpen((open) => !open)} aria-label="Toggle chat history" aria-expanded={mobileHistoryOpen}><MessagesSquare size={18} /></button>
          <div className="tutor-mark"><Sparkles size={21} /></div>
          <div className="tutor-title"><p>LEARNING AI · PERSONAL GUIDE</p><h1>Your AI tutor</h1></div>
          <button type="button" className="tutor-reset" onClick={startNewChat} disabled={isLoading} aria-label="Start a new chat"><RotateCcw size={16} /><span>New chat</span></button>
        </header>

        {mobileHistoryOpen && <button type="button" className="tutor-mobile-backdrop" onClick={() => setMobileHistoryOpen(false)} aria-label="Close chat history" />}
        <aside className={`tutor-sidebar ${mobileHistoryOpen ? 'is-mobile-open' : ''}`}>
          <Link to="/" className="tutor-sidebar-brand"><span>AI</span><b>Learning AI</b></Link>
          <button type="button" className="tutor-sidebar-new" onClick={startNewChat} disabled={isLoading}><RotateCcw size={16} /> New chat</button>
          <div className="tutor-history-section">
            <p>RECENT CHATS</p>
            {history.length ? history.map((conversation) => <button key={conversation.id} type="button" className={conversation.id === activeChatId ? 'is-active' : ''} onClick={() => openConversation(conversation)} disabled={isLoading} title={`Open conversation: ${conversation.title}`} aria-label={`Open conversation: ${conversation.title}`}><span>{conversation.title}</span><small className="tutor-history-preview">{conversationPreview(conversation.messages)}</small><small className="tutor-history-date">{conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleDateString() : ''}</small></button>) : <span className="tutor-history-empty">Your chats will appear here.</span>}
          </div>
          <div className="tutor-sidebar-section">
            <p>EXPLORE A TOPIC</p>
            {[
              ['AI foundations', 'Explain the basic ideas behind artificial intelligence.'],
              ['Prompting', 'Show me how to write a clear prompt, with an example.'],
              ['AI APIs', 'Explain how an AI API works from my app to the answer.'],
              ['Automations', 'Show me how AI can fit into a simple automation.'],
            ].map(([label, question]) => <button key={label} type="button" onClick={() => submit(question)} disabled={isLoading}>{label}<span>↗</span></button>)}
          </div>
          <div className="tutor-sidebar-note"><Sparkles size={16} /><p>Your tutor will explain the idea and draw a visual for every answer.</p></div>
          <Link to="/talks" className="tutor-sidebar-footer">Browse learning guides <span>↗</span></Link>
        </aside>

        <div className="tutor-conversation-layout">
          <div className="tutor-transcript" ref={scrollRef} aria-live="polite">
            {!messages.length ? (
            <div className="tutor-welcome">
              <span className="welcome-icon"><BookOpen size={28} /></span>
              <p className="welcome-kicker">A good place to start</p>
              <h2>What would you like<br />to understand today?</h2>
              <p className="welcome-copy">Ask a question, explore an idea, or work through a project. I’ll explain things clearly and help you learn one step at a time.</p>
              <div className="tutor-suggestions">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => submit(suggestion)}>{suggestion}<ArrowUp size={14} /></button>)}</div>
            </div>
            ) : messages.map(({ id, role, parts }) => (
            <article key={id} className={`tutor-message ${role === 'assistant' ? 'from-tutor' : 'from-learner'}`}>
              <span className="message-label">{role === 'assistant' ? 'YOUR TUTOR' : 'YOU'}</span>
              <div className="message-content">{parts.map((part, index) => {
                if (part.type !== 'text' || !part.content) return null
                const text = part.content.replace(/```(?:html|drawing)\s*[\s\S]*?```/i, '').trim()
                return text ? <Streamdown key={index}>{text}</Streamdown> : null
              })}</div>
            </article>
            ))}
            {isLoading && <div className="tutor-thinking"><span /><span /><span /> Thinking through this with you…</div>}
          </div>
          <TutorDrawingBoard
            drawing={diagram}
            hasQuestion={Boolean(latestQuestion) && !isLoading}
            onMapQuestion={() => latestQuestion && sendMessage(`Create a fresh CSS drawing for your latest explanation. Return it in one fenced html code block with a style element, one root element id ai-board, and each connected concept in its own element with class ai-node. Arrange them in a sequence so the board can draw arrows between the ideas. Then briefly explain the drawing.`)}
          />
        </div>

        <form className="tutor-composer" onSubmit={(event) => { event.preventDefault(); submit() }}>
          <label className="sr-only" htmlFor="tutor-message">Message your AI tutor</label>
          <textarea id="tutor-message" rows={1} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit() } }} placeholder="Ask anything about AI…" disabled={isLoading} />
          <button type="submit" disabled={!input.trim() || isLoading} aria-label="Send message"><ArrowUp size={19} /></button>
          <p>Enter to send · Shift + Enter for a new line</p>
        </form>
      </section>
    </main>
  )
}
