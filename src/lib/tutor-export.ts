import { marked } from 'marked'
import { parseTutorDiagram } from './tutor-diagram'

export function stripSpecialBlocks(content: string) {
  return content
    .replace(/```(?:diagram|image|doc|html|drawing)\s*[\s\S]*?```/gi, '')
    .replace(/```json\s*([\s\S]*?)```/gi, (block, body: string) => {
      try {
        return parseTutorDiagram(JSON.parse(body.trim())) ? '' : block
      } catch {
        return block
      }
    })
    .trim()
}

export function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function safeFilename(title: string) {
  return title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 48).toLowerCase() || 'learning-note'
}

export function toWordDocument(title: string, markdown: string) {
  const body = marked.parse(markdown, { async: false }) as string
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font:11pt Calibri,Arial,sans-serif;color:#1c2b26;line-height:1.5}h1,h2,h3{font-family:Georgia,serif;color:#214b42}pre{background:#f3f6f2;padding:8pt;border:1px solid #dce6df}code{font-family:Consolas,monospace}blockquote{border-left:3px solid #77a891;padding-left:10pt;color:#557067}</style>
</head><body><h1>${title}</h1>${body}</body></html>`
}
