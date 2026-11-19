import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { ArrowRight, Circle, Hand, MousePointer2, Minus, Pencil, Plus, Scan, Square, Trash2, Type, WandSparkles } from 'lucide-react'
import { layoutTutorDiagram, type DiagramPoint, type TutorDiagram } from '#/lib/tutor-diagram'

interface TutorDrawingBoardProps {
  diagram?: TutorDiagram
  onMapQuestion?: () => void
  hasQuestion: boolean
}

type BoardTool = 'select' | 'pan' | 'pen' | 'rectangle' | 'ellipse' | 'arrow' | 'text'

interface ManualMark {
  id: string
  type: Exclude<BoardTool, 'select' | 'pan'>
  start: DiagramPoint
  end: DiagramPoint
  points?: DiagramPoint[]
  text?: string
}

interface ActiveStroke extends ManualMark {
  type: Exclude<BoardTool, 'select' | 'pan' | 'text'>
  points: DiagramPoint[]
}

const STARTER_DIAGRAM: TutorDiagram = {
  title: 'How learning works',
  nodes: [
    { id: 'question', label: 'Your question', detail: 'Start with something you want to understand', kind: 'start' },
    { id: 'idea', label: 'Key idea', detail: 'Break the topic into a clear concept', kind: 'process' },
    { id: 'example', label: 'See it in action', detail: 'Connect the idea to a concrete example', kind: 'process' },
    { id: 'practice', label: 'Try it yourself', detail: 'Use what you learned', kind: 'result' },
  ],
  edges: [
    { from: 'question', to: 'idea' },
    { from: 'idea', to: 'example' },
    { from: 'example', to: 'practice' },
  ],
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

const NODE_COLORS: Record<string, { fill: string; stroke: string }> = {
  start: { fill: '#e6f3e9', stroke: '#77a891' },
  process: { fill: '#fffefa', stroke: '#a8cbbb' },
  decision: { fill: '#fff5dd', stroke: '#c69a4b' },
  result: { fill: '#eaf1fb', stroke: '#89a7cf' },
}

const DRAW_TOOLS = [
  { id: 'select', label: 'Select and move', icon: MousePointer2 },
  { id: 'pan', label: 'Pan the infinite board', icon: Hand },
  { id: 'pen', label: 'Freehand pen', icon: Pencil },
  { id: 'rectangle', label: 'Rectangle', icon: Square },
  { id: 'ellipse', label: 'Ellipse', icon: Circle },
  { id: 'arrow', label: 'Arrow', icon: ArrowRight },
  { id: 'text', label: 'Text note', icon: Type },
] as const

export default function TutorDrawingBoard({ diagram, onMapQuestion, hasQuestion }: TutorDrawingBoardProps) {
  const activeDiagram = diagram || STARTER_DIAGRAM
  const layout = useMemo(() => layoutTutorDiagram(activeDiagram), [activeDiagram])
  const [zoom, setZoom] = useState(100)
  const [tool, setTool] = useState<BoardTool>('select')
  const [marks, setMarks] = useState<ManualMark[]>([])
  const [activeStroke, setActiveStroke] = useState<ActiveStroke | null>(null)
  const [positions, setPositions] = useState<Record<string, DiagramPoint>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [camera, setCamera] = useState(() => ({ x: 0, y: 0, width: layout.width, height: layout.height }))
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null)
  const panRef = useRef<{ pointerX: number; pointerY: number; x: number; y: number; scaleX: number; scaleY: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    setPositions({})
    setSelectedId(null)
    setMarks([])
    setActiveStroke(null)
    setZoom(100)
    setCamera({ x: 0, y: 0, width: layout.width, height: layout.height })
  }, [diagram])

  const getPoint = (id: string) => positions[id] || layout.positions[id]
  const pointFromEvent = (event: ReactPointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    const screenMatrix = svg?.getScreenCTM()
    if (!svg || !screenMatrix) return { x: 0, y: 0 }
    const pointer = svg.createSVGPoint()
    pointer.x = event.clientX
    pointer.y = event.clientY
    const point = pointer.matrixTransform(screenMatrix.inverse())
    return { x: point.x, y: point.y }
  }

  const beginDrag = (event: ReactPointerEvent<SVGGElement>, id: string) => {
    if (tool !== 'select') return
    if (event.button !== 0) return
    event.preventDefault()
    event.stopPropagation()
    const pointer = pointFromEvent(event as unknown as ReactPointerEvent<SVGSVGElement>)
    const point = getPoint(id)
    dragRef.current = { id, offsetX: pointer.x - point.x, offsetY: pointer.y - point.y }
    svgRef.current?.setPointerCapture(event.pointerId)
    setSelectedId(id)
  }

  const beginPan = (event: ReactPointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    const screenMatrix = svg?.getScreenCTM()
    if (!screenMatrix) return
    event.preventDefault()
    panRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: camera.x,
      y: camera.y,
      scaleX: screenMatrix.a || 1,
      scaleY: screenMatrix.d || 1,
    }
    svg?.setPointerCapture(event.pointerId)
  }

  const handleCanvasPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (tool === 'pan' || event.button === 1) {
      beginPan(event)
      return
    }
    startMark(event)
  }

  const moveNode = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (panRef.current) {
      const pan = panRef.current
      setCamera((current) => ({
        ...current,
        x: pan.x - (event.clientX - pan.pointerX) / pan.scaleX,
        y: pan.y - (event.clientY - pan.pointerY) / pan.scaleY,
      }))
      return
    }
    if (activeStroke) {
      const point = pointFromEvent(event)
      setActiveStroke((stroke) => stroke ? {
        ...stroke,
        end: point,
        points: stroke.type === 'pen' ? [...stroke.points, point] : stroke.points,
      } : null)
      return
    }
    if (!dragRef.current) return
    const pointer = pointFromEvent(event)
    const { id, offsetX, offsetY } = dragRef.current
    setPositions((current) => ({
      ...current,
      [id]: {
        x: pointer.x - offsetX,
        y: pointer.y - offsetY,
      },
    }))
  }

  const startMark = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (tool === 'select' || tool === 'pan') return
    event.preventDefault()
    const point = pointFromEvent(event)
    if (tool === 'text') {
      const text = window.prompt('Add a note to the board')?.trim()
      if (text) {
        setMarks((current) => [...current, { id: `${Date.now()}-${Math.random()}`, type: 'text', start: point, end: point, text: text.slice(0, 120) }])
      }
      return
    }
    const stroke: ActiveStroke = {
      id: `${Date.now()}-${Math.random()}`,
      type: tool,
      start: point,
      end: point,
      points: [point],
    }
    setActiveStroke(stroke)
    svgRef.current?.setPointerCapture(event.pointerId)
  }

  const finishMark = () => {
    if (activeStroke) {
      const { start, end } = activeStroke
      const hasSize = Math.hypot(end.x - start.x, end.y - start.y) > 3 || activeStroke.type === 'pen'
      if (hasSize) setMarks((current) => [...current, activeStroke])
      setActiveStroke(null)
    }
    dragRef.current = null
    panRef.current = null
  }

  const changeZoom = (nextZoom: number) => {
    const clampedZoom = Math.max(40, Math.min(200, nextZoom))
    const width = layout.width * 100 / clampedZoom
    const height = layout.height * 100 / clampedZoom
    const centerX = camera.x + camera.width / 2
    const centerY = camera.y + camera.height / 2
    setZoom(clampedZoom)
    setCamera({ x: centerX - width / 2, y: centerY - height / 2, width, height })
  }

  const resetBoardView = () => {
    setZoom(100)
    setPositions({})
    setSelectedId(null)
    setCamera({ x: 0, y: 0, width: layout.width, height: layout.height })
  }

  const renderMark = (mark: ManualMark, preview = false) => {
    const x = Math.min(mark.start.x, mark.end.x)
    const y = Math.min(mark.start.y, mark.end.y)
    const width = Math.abs(mark.end.x - mark.start.x)
    const height = Math.abs(mark.end.y - mark.start.y)
    const common = { stroke: '#286b59', strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, opacity: preview ? 0.72 : 1 }
    if (mark.type === 'pen') {
      const points = mark.points?.map((point) => `${point.x},${point.y}`).join(' ') || ''
      return <polyline key={mark.id} points={points} fill="none" {...common} />
    }
    if (mark.type === 'rectangle') return <rect key={mark.id} x={x} y={y} width={width} height={height} rx="8" fill="#e6f3e966" {...common} />
    if (mark.type === 'ellipse') return <ellipse key={mark.id} cx={x + width / 2} cy={y + height / 2} rx={width / 2} ry={height / 2} fill="#fff5dd66" {...common} />
    if (mark.type === 'arrow') return <line key={mark.id} x1={mark.start.x} y1={mark.start.y} x2={mark.end.x} y2={mark.end.y} fill="none" markerEnd="url(#tutor-arrow)" {...common} />
    return <text key={mark.id} x={mark.start.x} y={mark.start.y} className="diagram-user-note">{mark.text}</text>
  }

  return (
    <aside className="drawing-board" aria-label="AI learning drawing board">
      <header className="drawing-board-header">
        <div className="drawing-board-title">
          <span><WandSparkles size={17} /></span>
          <div><p>LEARNING CANVAS</p><h2>Drawing board</h2></div>
        </div>
        <div className="drawing-board-tools" aria-label="Drawing zoom controls">
          <button type="button" onClick={() => changeZoom(zoom - 10)} aria-label="Zoom out"><Minus size={15} /></button>
          <span>{zoom}%</span>
          <button type="button" onClick={() => changeZoom(zoom + 10)} aria-label="Zoom in"><Plus size={15} /></button>
          <button type="button" onClick={resetBoardView} aria-label="Reset zoom and layout"><Scan size={15} /></button>
        </div>
      </header>
      <div className="drawing-board-caption">{diagram ? diagram.title : 'Draw freely, or ask your tutor to create a diagram'}</div>
      <div className="drawing-board-toolbox" role="toolbar" aria-label="Board drawing tools">
        {DRAW_TOOLS.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={tool === id ? 'is-active' : ''} onClick={() => setTool(id)} aria-label={label} aria-pressed={tool === id} title={label}>
            <Icon size={15} />
          </button>
        ))}
        <span className="drawing-board-tool-divider" />
        <button type="button" onClick={() => setMarks([])} disabled={!marks.length} aria-label="Clear your drawings" title="Clear your drawings"><Trash2 size={15} /></button>
      </div>
      <div className="drawing-board-paper">
        <svg
            ref={svgRef}
            className="diagram-svg"
            viewBox={`${camera.x} ${camera.y} ${camera.width} ${camera.height}`}
            preserveAspectRatio="xMidYMid meet"
            role="group"
            aria-label={`${activeDiagram.title}. Use the hand tool to pan, plus drawing tools to add to the infinite board.`}
            style={{ width: '100%', height: '100%', cursor: tool === 'pan' ? 'grab' : tool === 'select' ? 'default' : 'crosshair' }}
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={moveNode}
            onPointerUp={finishMark}
            onPointerCancel={finishMark}
            onClick={() => { if (tool === 'select') setSelectedId(null) }}
          >
            <defs>
              <pattern id="tutor-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#c7d9cc" />
              </pattern>
              <marker id="tutor-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#78a18e" />
              </marker>
            </defs>
            <rect x={camera.x} y={camera.y} width={camera.width} height={camera.height} fill="url(#tutor-grid)" pointerEvents="none" />
            {activeDiagram.edges.map((edge, index) => {
              const from = getPoint(edge.from)
              const to = getPoint(edge.to)
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
                <g key={`${edge.from}-${edge.to}-${index}`} aria-hidden="true">
                  <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#78a18e" strokeWidth="2" markerEnd="url(#tutor-arrow)" />
                  {edge.label && <text x={(startX + endX) / 2} y={(startY + endY) / 2 - 7} textAnchor="middle" className="diagram-edge-label">{edge.label}</text>}
                </g>
              )
            })}
            {activeDiagram.nodes.map((node) => {
              const point = getPoint(node.id)
              const colors = NODE_COLORS[node.kind || 'process']
              const labelLines = wrapLabel(node.label)
              const detailLines = node.detail ? wrapLabel(node.detail, 30).slice(0, 2) : []
              const labelStartY = layout.nodeHeight / 2 - ((labelLines.length - 1) * 9) - (detailLines.length ? 8 : 0)
              return (
                <g
                  key={node.id}
                  className={`diagram-node${selectedId === node.id ? ' is-selected' : ''}`}
                  transform={`translate(${point.x} ${point.y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.label}${node.detail ? `: ${node.detail}` : ''}. Drag to move.`}
                  onPointerDown={(event) => beginDrag(event, node.id)}
                  onClick={() => setSelectedId(node.id)}
                  onKeyDown={(event) => {
                    if (tool !== 'select') return
                    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return
                    event.preventDefault()
                    const delta = event.shiftKey ? 24 : 8
                    const point = getPoint(node.id)
                    setSelectedId(node.id)
                    setPositions((current) => ({
                      ...current,
                      [node.id]: {
                        x: Math.max(0, Math.min(layout.width - layout.nodeWidth, point.x + (event.key === 'ArrowRight' ? delta : event.key === 'ArrowLeft' ? -delta : 0))),
                        y: Math.max(0, Math.min(layout.height - layout.nodeHeight, point.y + (event.key === 'ArrowDown' ? delta : event.key === 'ArrowUp' ? -delta : 0))),
                      },
                    }))
                  }}
                  style={{ cursor: tool === 'pen' || tool === 'rectangle' || tool === 'ellipse' || tool === 'arrow' || tool === 'text' ? 'crosshair' : 'grab' }}
                >
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
            <g className="drawing-board-user-marks" aria-label="Your drawings">
              {marks.map((mark) => renderMark(mark))}
              {activeStroke && renderMark(activeStroke, true)}
            </g>
          </svg>
      </div>
      <footer className="drawing-board-footer">
        <span><i /> {tool === 'pan' ? 'Drag to move around the infinite board' : tool === 'select' ? 'Select a concept or choose a drawing tool' : `Using ${DRAW_TOOLS.find((item) => item.id === tool)?.label}`}</span>
        <button type="button" onClick={onMapQuestion} disabled={!hasQuestion || !onMapQuestion}>Redraw this answer <WandSparkles size={14} /></button>
      </footer>
    </aside>
  )
}
