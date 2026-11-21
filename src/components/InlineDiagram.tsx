import { useId, useMemo } from 'react'
import { layoutTutorDiagram, parseTutorDiagram, type TutorDiagram } from '#/lib/tutor-diagram'

interface InlineDiagramProps {
  source: string
  language?: string
}

const NODE_COLORS: Record<string, { fill: string; stroke: string }> = {
  start: { fill: '#e6f3e9', stroke: '#77a891' },
  process: { fill: '#fffefa', stroke: '#a8cbbb' },
  decision: { fill: '#fff5dd', stroke: '#c69a4b' },
  result: { fill: '#eaf1fb', stroke: '#89a7cf' },
}

function wrapLabel(label: string, maxLength = 22) {
  const words = label.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > maxLength && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines.slice(0, 3)
}

function parseLegacyDrawing(source: string): TutorDiagram | null {
  if (typeof DOMParser === 'undefined') return null
  const document = new DOMParser().parseFromString(source, 'text/html')
  const labels = [...document.querySelectorAll('.ai-node')]
    .map((node) => (node.textContent || '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 16)
  if (!labels.length) return null
  return parseTutorDiagram({
    title: 'Learning map',
    nodes: labels.map((label, index) => ({
      id: `legacy-${index}`,
      label,
      kind: index === 0 ? 'start' : index === labels.length - 1 ? 'result' : 'process',
    })),
    edges: labels.slice(1).map((_, index) => ({ from: `legacy-${index}`, to: `legacy-${index + 1}` })),
  })
}

function parseInlineDiagram(source: string, language: string) {
  if (language === 'diagram') {
    try {
      return parseTutorDiagram(JSON.parse(source.trim()))
    } catch {
      return null
    }
  }
  // Older answers used HTML drawings with .ai-node elements.
  return parseLegacyDrawing(source)
}

export default function InlineDiagram({ source, language = 'diagram' }: InlineDiagramProps) {
  const markerId = `inline-diagram-arrow-${useId().replace(/:/g, '')}`
  const diagram = useMemo(() => parseInlineDiagram(source, language), [source, language])
  const layout = useMemo(() => diagram ? layoutTutorDiagram(diagram) : null, [diagram])

  if (!diagram || !layout) return null

  return (
    <figure className="message-diagram" aria-label={`Diagram: ${diagram.title}`}>
      <figcaption className="message-diagram-caption">
        <span aria-hidden="true">✳</span> {diagram.title}
      </figcaption>
      <div className="message-diagram-scroll">
        <svg
          className="message-diagram-svg"
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={diagram.title}
        >
          <defs>
            <marker id={markerId} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#78a18e" />
            </marker>
          </defs>
          {diagram.edges.map((edge, index) => {
            const from = layout.positions[edge.from]
            const to = layout.positions[edge.to]
            if (!from || !to) return null
            const x1 = from.x + layout.nodeWidth / 2
            const y1 = from.y + layout.nodeHeight / 2
            const x2 = to.x + layout.nodeWidth / 2
            const y2 = to.y + layout.nodeHeight / 2
            const dx = x2 - x1
            const dy = y2 - y1
            const distance = Math.max(Math.hypot(dx, dy), 1)
            const insetX = (dx / distance) * (layout.nodeWidth * 0.43)
            const insetY = (dy / distance) * (layout.nodeHeight * 0.43)
            const startX = x1 + insetX
            const startY = y1 + insetY
            const endX = x2 - insetX
            const endY = y2 - insetY
            return (
              <g key={`${edge.from}-${edge.to}-${index}`}>
                <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#78a18e" strokeWidth="2" markerEnd={`url(#${markerId})`} />
                {edge.label && <text x={(startX + endX) / 2} y={(startY + endY) / 2 - 7} textAnchor="middle" className="diagram-edge-label">{edge.label}</text>}
              </g>
            )
          })}
          {diagram.nodes.map((node) => {
            const point = layout.positions[node.id]
            if (!point) return null
            const colors = NODE_COLORS[node.kind || 'process']
            const labelLines = wrapLabel(node.label)
            const detailLines = node.detail ? wrapLabel(node.detail, 30).slice(0, 2) : []
            const labelStartY = layout.nodeHeight / 2 - ((labelLines.length - 1) * 9) - (detailLines.length ? 8 : 0)
            return (
              <g key={node.id} transform={`translate(${point.x} ${point.y})`}>
                {node.kind === 'decision' ? (
                  <polygon points={`${layout.nodeWidth / 2},0 ${layout.nodeWidth},${layout.nodeHeight / 2} ${layout.nodeWidth / 2},${layout.nodeHeight} 0,${layout.nodeHeight / 2}`} fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
                ) : (
                  <rect x="1" y="1" width={layout.nodeWidth - 2} height={layout.nodeHeight - 2} rx={node.kind === 'start' || node.kind === 'result' ? 30 : 15} fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
                )}
                <text x={layout.nodeWidth / 2} y={labelStartY} textAnchor="middle" className="diagram-node-label">
                  {labelLines.map((line, index) => <tspan key={index} x={layout.nodeWidth / 2} dy={index ? 19 : 0}>{line}</tspan>)}
                  {detailLines.map((line, index) => <tspan key={`detail-${index}`} x={layout.nodeWidth / 2} dy={index ? 14 : 19} className="diagram-node-detail">{line}</tspan>)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </figure>
  )
}
