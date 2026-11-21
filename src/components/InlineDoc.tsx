import { Download, FileText } from 'lucide-react'
import { Streamdown } from 'streamdown'
import { downloadTextFile, safeFilename, toWordDocument } from '#/lib/tutor-export'

interface InlineDocProps {
  source: string
}

function parseDoc(source: string) {
  try {
    const value = JSON.parse(source.trim()) as { title?: unknown; markdown?: unknown }
    const title = typeof value.title === 'string' ? value.title.trim().slice(0, 80) : ''
    const markdown = typeof value.markdown === 'string' ? value.markdown.trim().slice(0, 12000) : ''
    return title && markdown ? { title, markdown } : null
  } catch {
    return null
  }
}

export default function InlineDoc({ source }: InlineDocProps) {
  const doc = parseDoc(source)
  if (!doc) return null

  return (
    <figure className="message-doc">
      <figcaption className="message-doc-header">
        <span><FileText size={15} /> <b>{doc.title}</b></span>
        <span className="message-doc-actions">
          <button type="button" onClick={() => downloadTextFile(`${safeFilename(doc.title)}.md`, doc.markdown, 'text/markdown')}>
            <Download size={13} /> .md
          </button>
          <button type="button" onClick={() => downloadTextFile(`${safeFilename(doc.title)}.doc`, toWordDocument(doc.title, doc.markdown), 'application/msword')}>
            <Download size={13} /> Word
          </button>
        </span>
      </figcaption>
      <div className="message-doc-body"><Streamdown>{doc.markdown}</Streamdown></div>
    </figure>
  )
}
