import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUp, BookOpen, RotateCcw, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Streamdown } from 'streamdown'
import { useTutorChat } from '#/lib/tutor-ai-hook'
import type { TutorChatMessages } from '#/lib/tutor-ai-hook'
import InlineDiagram from '#/components/InlineDiagram'

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
  messages: TutorChatMessages
}

function conversationTitle(messages: TutorChatMessages) {
  const firstUser = messages.find((message) => message.role === 'user')
  const title = firstUser?.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.content || '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  return title ? (title.length > 42 ? `${title.slice(0, 42).trim()}…` : title) : 'New conversation'
}

function createConversationId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `tutor-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function renderMessageContent(content: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const fence = /```(diagram|html|drawing)\s*([\s\S]*?)```/gi
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = fence.exec(content))) {
    const before = content.slice(lastIndex, match.index)
    if (before.trim()) nodes.push(<Streamdown key={`text-${lastIndex}`}>{before}</Streamdown>)
    nodes.push(<InlineDiagram key={`diagram-${match.index}`} source={match[2]} language={match[1].toLowerCase()} />)
    lastIndex = match.index + match[0].length
  }
  let after = content.slice(lastIndex)
  // Hide a still-streaming, unclosed diagram fence instead of showing raw JSON.
  const incomplete = after.match(/```(?:diagram|html|drawing)\s*[\s\S]*$/i)
  if (incomplete) after = after.slice(0, incomplete.index)
  if (after.trim()) nodes.push(<Streamdown key={`text-${lastIndex}`}>{after}</Streamdown>)
  return nodes
}

function TutorPage() {
  const [history, setHistory] = useState<SavedConversation[]>([])
  const [historyReady, setHistoryReady] = useState(false)
  const [activeChatId, setActiveChatId] = useState('learning-ai-tutor')
  const savedActiveChat = history.find((conversation) => conversation.id === activeChatId)
  const { messages, sendMessage, isLoading } = useTutorChat(activeChatId, savedActiveChat?.messages)
  const [input, setInput] = useState('')
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
    setActiveChatId(createConversationId())
  }

  return (
    <main className="tutor-page">
      <section className="tutor-shell">
        <header className="tutor-heading">
          <Link to="/" className="tutor-home-link" aria-label="Back to Learning AI">AI</Link>
          <div className="tutor-mark"><Sparkles size={21} /></div>
          <div className="tutor-title"><p>LEARNING AI · PERSONAL GUIDE</p><h1>Your AI tutor</h1></div>
          <button type="button" className="tutor-reset" onClick={startNewChat} disabled={isLoading} aria-label="Start a new chat"><RotateCcw size={16} /><span>New chat</span></button>
        </header>

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
                return <div key={index}>{renderMessageContent(part.content)}</div>
              })}</div>
            </article>
            ))}
            {isLoading && <div className="tutor-thinking"><span /><span /><span /> Thinking through this with you…</div>}
          </div>
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
