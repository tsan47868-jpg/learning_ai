import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUp, BookOpen, Download, History, ImagePlus, MessageCircle, RotateCcw, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Streamdown } from 'streamdown'
import { useTutorChat } from '#/lib/tutor-ai-hook'
import type { TutorChatMessages } from '#/lib/tutor-ai-hook'
import InlineDiagram from '#/components/InlineDiagram'
import { parseTutorDiagram } from '#/lib/tutor-diagram'
import InlineImage from '#/components/InlineImage'
import InlineDoc from '#/components/InlineDoc'
import { downloadTextFile, safeFilename, stripSpecialBlocks, toWordDocument } from '#/lib/tutor-export'

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

function formatChatDate(timestamp: number) {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return 'Saved chat'
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    + ' · ' + date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

function renderMessageContent(content: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const fence = /```(diagram|image|doc|json|html|drawing)\s*([\s\S]*?)```/gi
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = fence.exec(content))) {
    const before = content.slice(lastIndex, match.index)
    if (before.trim()) nodes.push(<Streamdown key={`text-${lastIndex}`}>{before}</Streamdown>)
    const kind = match[1].toLowerCase()
    if (kind === 'diagram' || (kind === 'json' && isDiagramJson(match[2]))) {
      nodes.push(<InlineDiagram key={`diagram-${match.index}`} source={match[2]} />)
    } else if (kind === 'image') {
      nodes.push(<InlineImage key={`image-${match.index}`} prompt={parseImagePrompt(match[2])} />)
    } else if (kind === 'doc') {
      nodes.push(<InlineDoc key={`doc-${match.index}`} source={match[2]} />)
    } else if (kind === 'json') {
      nodes.push(<Streamdown key={`code-${match.index}`}>{match[0]}</Streamdown>)
    } else {
      nodes.push(<InlineDiagram key={`diagram-${match.index}`} source={match[2]} language={kind} />)
    }
    lastIndex = match.index + match[0].length
  }
  let after = content.slice(lastIndex)
  // Hide a still-streaming, unclosed block instead of showing its raw JSON.
  const incomplete = after.match(/```(?:diagram|image|doc|json|html|drawing)\s*[\s\S]*$/i)
  if (incomplete) after = after.slice(0, incomplete.index)
  if (after.trim()) nodes.push(<Streamdown key={`text-${lastIndex}`}>{after}</Streamdown>)
  return nodes
}

function isDiagramJson(source: string) {
  try {
    return Boolean(parseTutorDiagram(JSON.parse(source.trim())))
  } catch {
    return false
  }
}

function parseImagePrompt(source: string) {
  try {
    const value = JSON.parse(source.trim()) as { prompt?: unknown }
    if (typeof value.prompt === 'string' && value.prompt.trim()) return value.prompt.trim().slice(0, 900)
  } catch {
    // Fall back to the raw block text so a simple prompt still works.
  }
  return source.trim().replace(/^prompt:\s*/i, '').slice(0, 900) || 'A clear illustration of the topic discussed.'
}

function TutorPage() {
  const [history, setHistory] = useState<SavedConversation[]>([])
  const [historyReady, setHistoryReady] = useState(false)
  const [activeChatId, setActiveChatId] = useState('learning-ai-tutor')
  const savedActiveChat = history.find((conversation) => conversation.id === activeChatId)
  const { messages, sendMessage, isLoading } = useTutorChat(activeChatId, savedActiveChat?.messages)
  const [input, setInput] = useState('')
  const [extraImages, setExtraImages] = useState<Record<string, string>>({})
  const [historyOpen, setHistoryOpen] = useState(false)
  const historyMenuRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    if (!historyOpen) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!historyMenuRef.current?.contains(event.target as Node)) setHistoryOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setHistoryOpen(false)
    }
    document.addEventListener('click', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('click', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [historyOpen])

  const submit = (text = input) => {
    if (!text.trim() || isLoading) return
    sendMessage(text.trim())
    setInput('')
  }
  const openChat = (id: string) => {
    if (id === activeChatId || isLoading) return
    setActiveChatId(id)
    setInput('')
    setExtraImages({})
    setHistoryOpen(false)
  }
  const removeChat = (id: string) => {
    setHistory((current) => current.filter((conversation) => conversation.id !== id))
    if (id === activeChatId) {
      setActiveChatId(createConversationId())
      setInput('')
      setExtraImages({})
    }
  }
  const startNewChat = () => {
    setActiveChatId(createConversationId())
    setInput('')
    setExtraImages({})
    setHistoryOpen(false)
  }

  return (
    <main className="tutor-page">
      <section className="tutor-shell">
        <header className="tutor-heading">
          <Link to="/" className="tutor-home-link" aria-label="Back to Learning AI">AI</Link>
          <div className="tutor-mark"><Sparkles size={21} /></div>
          <div className="tutor-title"><p>LEARNING AI · PERSONAL GUIDE</p><h1>Your AI tutor</h1></div>
          <div className="tutor-history-menu" ref={historyMenuRef}>
            <button
              type="button"
              className="tutor-history-trigger"
              onClick={() => setHistoryOpen((open) => !open)}
              aria-expanded={historyOpen}
              aria-haspopup="menu"
              aria-label="Chat histories"
              disabled={isLoading}
            >
              <History size={16} /><span>Chats</span>
              {history.length > 0 && <em>{history.length}</em>}
            </button>
            {historyOpen && (
              <div className="tutor-history-panel" role="menu" aria-label="Chat histories">
                <div className="tutor-history-panel-head"><span>Chat histories</span><span>{history.length} saved</span></div>
                {history.length === 0 ? (
                  <p className="tutor-history-empty">Your conversations will appear here once you start chatting.</p>
                ) : (
                  <ul className="tutor-history-list">
                    {history.map((conversation) => (
                      <li key={conversation.id} className={conversation.id === activeChatId ? 'is-active' : ''}>
                        <button type="button" role="menuitem" className="tutor-history-item" onClick={() => openChat(conversation.id)}>
                          <MessageCircle size={14} />
                          <span className="tutor-history-item-text">
                            <strong>{conversation.title}</strong>
                            <small>{formatChatDate(conversation.updatedAt)}</small>
                          </span>
                        </button>
                        <button type="button" className="tutor-history-delete" onClick={() => removeChat(conversation.id)} aria-label={`Delete chat: ${conversation.title}`} title="Delete chat">
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
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
            ) : messages.map(({ id, role, parts }) => {
              const text = parts
                .filter((part) => part.type === 'text')
                .map((part) => part.content || '')
                .join('\n')
              const note = stripSpecialBlocks(text)
              const title = note.split('\n').find((line) => /^#{1,3}\s/.test(line))?.replace(/^#{1,3}\s*/, '') || conversationTitle(messages)
              const illustration = extraImages[id]
              return (
            <article key={id} className={`tutor-message ${role === 'assistant' ? 'from-tutor' : 'from-learner'}`}>
              <span className="message-label">{role === 'assistant' ? 'YOUR TUTOR' : 'YOU'}</span>
              <div className="message-content">{parts.map((part, index) => {
                if (part.type !== 'text' || !part.content) return null
                return <div key={index}>{renderMessageContent(part.content)}</div>
              })}</div>
              {illustration && <InlineImage prompt={illustration} />}
              {role === 'assistant' && note && (
                <div className="message-actions">
                  <button type="button" onClick={() => downloadTextFile(`${safeFilename(title)}.md`, note, 'text/markdown')} aria-label="Save this answer as a Markdown document"><Download size={14} /> Save .md</button>
                  <button type="button" onClick={() => downloadTextFile(`${safeFilename(title)}.doc`, toWordDocument(title, note), 'application/msword')} aria-label="Save this answer as a Word document"><Download size={14} /> Save for Word</button>
                  <button type="button" onClick={() => setExtraImages((current) => ({ ...current, [id]: note.slice(0, 900) }))} disabled={Boolean(illustration)} aria-label="Generate an illustration for this answer"><ImagePlus size={14} /> {illustration ? 'Illustration added' : 'Illustrate'}</button>
                </div>
              )}
            </article>
            )
            })}
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
