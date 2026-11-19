import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUp, BookOpen, MessagesSquare, RotateCcw, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Streamdown } from 'streamdown'
import { useTutorChat } from '#/lib/tutor-ai-hook'
import type { TutorChatMessages } from '#/lib/tutor-ai-hook'
import TutorDrawingBoard from '#/components/TutorDrawingBoard'
import { parseTutorDiagram, type TutorDiagram } from '#/lib/tutor-diagram'

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

function conversationPreview(messages: TutorChatMessages) {
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

function parseLegacyDrawing(source: string, title: string): TutorDiagram | null {
  if (typeof DOMParser === 'undefined') return null
  const document = new DOMParser().parseFromString(source, 'text/html')
  const labels = [...document.querySelectorAll('.ai-node')]
    .map((node) => (node.textContent || '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 16)
  if (!labels.length) return null
  return parseTutorDiagram({
    title,
    nodes: labels.map((label, index) => ({ id: `legacy-${index}`, label, kind: index === 0 ? 'start' : index === labels.length - 1 ? 'result' : 'process' })),
    edges: labels.slice(1).map((_, index) => ({ from: `legacy-${index}`, to: `legacy-${index + 1}` })),
  })
}

function findLatestDiagram(messages: ReturnType<typeof useTutorChat>['messages']): TutorDiagram | undefined {
  const reversed = [...messages].reverse()
  for (const [index, message] of reversed.entries()) {
    if (message.role !== 'assistant') continue
    const text = message.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.content || '')
      .join('\n')
    for (const part of message.parts) {
      if (part.type !== 'text' || !part.content) continue
      const diagramMatch = part.content.match(/```diagram\s*([\s\S]*?)```/i)
      if (diagramMatch) {
        try {
          const parsed = parseTutorDiagram(JSON.parse(diagramMatch[1].trim()))
          if (parsed) return parsed
        } catch {
          // Ignore malformed generated diagram data and try a legacy drawing.
        }
      }
      const legacyMatch = part.content.match(/```(?:html|drawing)\s*([\s\S]*?)```/i)
      if (legacyMatch) {
        const question = reversed.slice(index + 1).find((previous) => previous.role === 'user')
        const title = question?.parts.filter((item) => item.type === 'text').map((item) => item.content || '').join(' ').slice(0, 80) || 'Learning map'
        const legacyDiagram = parseLegacyDrawing(legacyMatch[1], title)
        if (legacyDiagram) return legacyDiagram
      }
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
    return parseTutorDiagram({
      title: 'How the idea fits together',
      nodes: labels.map((label, index) => ({ id: `step-${index}`, label, kind: index === 0 ? 'start' : index === labels.length - 1 ? 'result' : 'process' })),
      edges: labels.slice(1).map((_, index) => ({ from: `step-${index}`, to: `step-${index + 1}` })),
    }) || undefined
  }
  return undefined
}

function TutorPage() {
  const [history, setHistory] = useState<SavedConversation[]>([])
  const [historyReady, setHistoryReady] = useState(false)
  const [activeChatId, setActiveChatId] = useState('learning-ai-tutor')
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false)
  const savedActiveChat = history.find((conversation) => conversation.id === activeChatId)
  const { messages, sendMessage, isLoading } = useTutorChat(activeChatId, savedActiveChat?.messages)
  const [input, setInput] = useState('')
  const [diagram, setDiagram] = useState<TutorDiagram>()
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
    setDiagram(findLatestDiagram(conversation.messages))
    setActiveChatId(conversation.id)
    setMobileHistoryOpen(false)
  }
  const latestQuestion = [...messages]
    .reverse()
    .filter((message) => message.role === 'user')
    .map((message) => message.parts.filter((part) => part.type === 'text').map((part) => part.content || '').join(' ').trim())
    .find((text) => text && !/^(?:Create (?:a new editable diagram|a fresh CSS drawing)|Please redraw the visual for my question,)/i.test(text))
  const completedDiagram = findLatestDiagram(messages)
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
                const text = part.content.replace(/```diagram\s*[\s\S]*?```/i, '').trim()
                return text ? <Streamdown key={index}>{text}</Streamdown> : null
              })}</div>
            </article>
            ))}
            {isLoading && <div className="tutor-thinking"><span /><span /><span /> Thinking through this with you…</div>}
          </div>
          <TutorDrawingBoard
            diagram={diagram}
            hasQuestion={Boolean(latestQuestion) && !isLoading}
            onMapQuestion={() => latestQuestion && sendMessage(`Please redraw the visual for my question, “${latestQuestion}”, with a clearer layout or a different example. Keep it editable. Return one fenced diagram code block containing only valid JSON with this structure: {"title":"short title","nodes":[{"id":"stable-id","label":"short node title","detail":"optional short explanation","kind":"start|process|decision|result"}],"edges":[{"from":"node-id","to":"node-id","label":"optional short label"}]}. Use 3–8 nodes, include all edge endpoints, choose a clear flow, and keep labels concise. Then briefly explain the diagram.`)}
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
