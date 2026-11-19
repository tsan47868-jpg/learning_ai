export interface TutorDiagramNode {
  id: string
  label: string
  detail?: string
  kind?: 'start' | 'process' | 'decision' | 'result'
}

export interface TutorDiagramEdge {
  from: string
  to: string
  label?: string
}

export interface TutorDiagram {
  title: string
  nodes: TutorDiagramNode[]
  edges: TutorDiagramEdge[]
}

export interface DiagramPoint {
  x: number
  y: number
}

export interface DiagramLayout {
  width: number
  height: number
  nodeWidth: number
  nodeHeight: number
  positions: Record<string, DiagramPoint>
}

const MAX_NODES = 16
const MAX_EDGES = 32
const MAX_LABEL_LENGTH = 72

function boundedText(value: unknown, maxLength = MAX_LABEL_LENGTH) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export function parseTutorDiagram(value: unknown): TutorDiagram | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Record<string, unknown>
  if (!Array.isArray(candidate.nodes) || !Array.isArray(candidate.edges)) return null

  const usedIds = new Set<string>()
  const nodes: TutorDiagramNode[] = candidate.nodes
    .slice(0, MAX_NODES)
    .flatMap((rawNode, index) => {
      if (!rawNode || typeof rawNode !== 'object') return []
      const node = rawNode as Record<string, unknown>
      const id = boundedText(node.id, 40) || `step-${index + 1}`
      const label = boundedText(node.label)
      if (!label || usedIds.has(id)) return []
      usedIds.add(id)
      const kind = ['start', 'process', 'decision', 'result'].includes(String(node.kind))
        ? (node.kind as TutorDiagramNode['kind'])
        : 'process'
      return [{ id, label, detail: boundedText(node.detail, 110), kind }]
    })

  if (!nodes.length) return null
  const nodeIds = new Set(nodes.map((node) => node.id))
  const edges: TutorDiagramEdge[] = candidate.edges
    .slice(0, MAX_EDGES)
    .flatMap((rawEdge) => {
      if (!rawEdge || typeof rawEdge !== 'object') return []
      const edge = rawEdge as Record<string, unknown>
      const from = boundedText(edge.from, 40)
      const to = boundedText(edge.to, 40)
      if (!nodeIds.has(from) || !nodeIds.has(to) || from === to) return []
      return [{ from, to, label: boundedText(edge.label, 36) }]
    })

  return {
    title: boundedText(candidate.title, 80) || 'Learning map',
    nodes,
    edges,
  }
}

export function layoutTutorDiagram(diagram: TutorDiagram): DiagramLayout {
  const nodeWidth = 190
  const nodeHeight = 112
  const columnGap = 112
  const rowGap = 46
  const levels = new Map(diagram.nodes.map((node) => [node.id, 0]))
  const incoming = new Set(diagram.edges.map((edge) => edge.to))

  // A few passes assign each node to the longest path from an entry point.
  for (let pass = 0; pass < diagram.nodes.length; pass += 1) {
    let changed = false
    for (const edge of diagram.edges) {
      const next = (levels.get(edge.from) ?? 0) + 1
      if (next > (levels.get(edge.to) ?? 0)) {
        levels.set(edge.to, next)
        changed = true
      }
    }
    if (!changed) break
  }

  // Keep cycles from making a diagram excessively wide.
  const maxLevel = Math.max(0, diagram.nodes.length - 1)
  const columns = new Map<number, TutorDiagramNode[]>()
  for (const node of diagram.nodes) {
    const level = incoming.has(node.id) ? Math.min(levels.get(node.id) ?? 0, maxLevel) : 0
    const column = columns.get(level) ?? []
    column.push(node)
    columns.set(level, column)
  }

  const sortedLevels = [...columns.keys()].sort((a, b) => a - b)
  const maxRows = Math.max(1, ...[...columns.values()].map((column) => column.length))
  const width = Math.max(420, 56 + sortedLevels.length * nodeWidth + Math.max(0, sortedLevels.length - 1) * columnGap)
  const height = Math.max(230, 48 + maxRows * nodeHeight + Math.max(0, maxRows - 1) * rowGap)
  const positions: Record<string, DiagramPoint> = {}

  for (const [columnIndex, level] of sortedLevels.entries()) {
    const column = columns.get(level) ?? []
    const columnHeight = column.length * nodeHeight + Math.max(0, column.length - 1) * rowGap
    const firstY = Math.max(24, (height - columnHeight) / 2)
    for (const [rowIndex, node] of column.entries()) {
      positions[node.id] = {
        x: 28 + columnIndex * (nodeWidth + columnGap),
        y: firstY + rowIndex * (nodeHeight + rowGap),
      }
    }
  }

  return { width, height, nodeWidth, nodeHeight, positions }
}
