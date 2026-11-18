import { useState } from 'react'
import { Minus, Plus, Scan, WandSparkles } from 'lucide-react'

const STARTER_DRAWING = `<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; font: 16px 'Segoe Print', 'Comic Sans MS', cursive; color: #214b42; background: #fffefa; }
  #ai-board { display: grid; gap: 34px; max-width: 470px; margin: auto; }
  .ai-node { position: relative; padding: 18px; border: 1px solid #a8cbbb; border-radius: 16px; background: linear-gradient(135deg,#f5fbf5,#e8f3e9); text-align: center; box-shadow: 0 8px 20px #214b4210; }
  .ai-node:nth-child(even) { background: linear-gradient(135deg,#fffaf0,#fbf3df); }
  .ai-node:not(:last-child)::after { content: ''; position: absolute; left: calc(50% - 1px); bottom: -23px; width: 2px; height: 15px; background: #68a18e; }
  .ai-node:not(:last-child)::before { content: ''; position: absolute; left: calc(50% - 6px); bottom: -30px; border: 5px solid transparent; border-top-color: #68a18e; }
  small { display: block; margin-bottom: 5px; color: #598c7e; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
</style>
<div id="ai-board">
  <div class="ai-node"><small>Start</small>Your question</div>
  <div class="ai-node"><small>Understand</small>Key idea</div>
  <div class="ai-node"><small>See it</small>A clear example</div>
  <div class="ai-node"><small>Try it</small>Build understanding</div>
</div>`

interface TutorDrawingBoardProps {
  drawing?: string
  onMapQuestion?: () => void
  hasQuestion: boolean
}

function makeBoardDocument(drawing: string) {
  const boardContent = /id=['"]ai-board['"]/i.test(drawing) ? drawing : `<div id="ai-board">${drawing}</div>`
  const boardStyle = `#ai-board{display:grid!important;grid-template-columns:1fr!important;gap:34px!important;max-width:470px!important;margin:12px auto!important}#ai-board .ai-node{position:relative!important;display:block!important;margin:0!important}#ai-board .ai-node:not(:last-child)::after{content:''!important;display:block!important;position:absolute!important;left:calc(50% - 1px)!important;bottom:-23px!important;width:2px!important;height:15px!important;background:#68a18e!important}#ai-board .ai-node:not(:last-child)::before{content:''!important;display:block!important;position:absolute!important;left:calc(50% - 6px)!important;bottom:-30px!important;border:5px solid transparent!important;border-top-color:#68a18e!important}`
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src 'none'; connect-src 'none'; script-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"><style>html,body{min-height:100%;margin:0}body{padding:12px;box-sizing:border-box;background:#fffefa}</style></head><body>${boardContent}<style>body,body *{font-family:'Segoe Print','Comic Sans MS',cursive!important}${boardStyle}</style></body></html>`
}

export default function TutorDrawingBoard({ drawing, onMapQuestion, hasQuestion }: TutorDrawingBoardProps) {
  const [zoom, setZoom] = useState(100)
  const activeDrawing = drawing || STARTER_DRAWING

  return (
    <aside className="drawing-board" aria-label="AI learning drawing board">
      <header className="drawing-board-header">
        <div className="drawing-board-title">
          <span><WandSparkles size={17} /></span>
          <div><p>AI-CREATED VISUAL</p><h2>Drawing board</h2></div>
        </div>
        <div className="drawing-board-tools" aria-label="Drawing zoom controls">
          <button type="button" onClick={() => setZoom((value) => Math.max(70, value - 10))} aria-label="Zoom out"><Minus size={15} /></button>
          <span>{zoom}%</span>
          <button type="button" onClick={() => setZoom((value) => Math.min(150, value + 10))} aria-label="Zoom in"><Plus size={15} /></button>
          <button type="button" onClick={() => setZoom(100)} aria-label="Reset zoom"><Scan size={15} /></button>
        </div>
      </header>
      <div className="drawing-board-caption">
        {drawing ? 'The tutor drew this to explain its answer' : 'Ask your tutor anything to create a drawing'}
      </div>
      <div className="drawing-board-paper">
        <iframe
          className="drawing-board-frame"
          title="AI-generated CSS drawing"
          sandbox=""
          srcDoc={makeBoardDocument(activeDrawing)}
          style={{ width: `${zoom}%` }}
        />
      </div>
      <footer className="drawing-board-footer">
        <span><i /> {drawing ? 'Drawn from the latest answer' : 'Your AI drawing appears here'}</span>
        <button type="button" onClick={onMapQuestion} disabled={!hasQuestion || !onMapQuestion}>Redraw this answer <WandSparkles size={14} /></button>
      </footer>
    </aside>
  )
}
