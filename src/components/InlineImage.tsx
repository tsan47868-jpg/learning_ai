import { useEffect, useState } from 'react'
import { ImageOff, RefreshCw, Sparkles } from 'lucide-react'

interface InlineImageProps {
  prompt: string
}

type ImageState =
  | { status: 'loading' }
  | { status: 'ready'; url: string }
  | { status: 'error'; message: string }

// Reuse generated images while the app is open so revisiting a reply does not pay twice.
const imageCache = new Map<string, string>()

export default function InlineImage({ prompt }: InlineImageProps) {
  const [state, setState] = useState<ImageState>(() => {
    const cached = imageCache.get(prompt)
    return cached ? { status: 'ready', url: cached } : { status: 'loading' }
  })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const cached = imageCache.get(prompt)
    if (cached) {
      setState({ status: 'ready', url: cached })
      return
    }
    const controller = new AbortController()
    setState({ status: 'loading' })
    fetch('/api/remy-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))
        if (!response.ok || typeof data.image !== 'string') {
          throw new Error(data.error || 'The image could not be generated.')
        }
        return data.image as string
      })
      .then((url) => {
        imageCache.set(prompt, url)
        setState({ status: 'ready', url })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({ status: 'error', message: error instanceof Error ? error.message : 'The image could not be generated.' })
      })
    return () => controller.abort()
  }, [prompt, attempt])

  return (
    <figure className="message-image">
      <figcaption className="message-image-caption"><Sparkles size={13} /> Illustration</figcaption>
      {state.status === 'loading' && (
        <div className="message-image-status"><span className="message-image-spinner" /> Drawing an illustration…</div>
      )}
      {state.status === 'error' && (
        <div className="message-image-status is-error">
          <ImageOff size={16} />
          <span>{state.message}</span>
          <button type="button" onClick={() => setAttempt((value) => value + 1)} aria-label="Try generating the image again">
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}
      {state.status === 'ready' && (
        <img className="message-image-picture" src={state.url} alt={prompt} loading="lazy" />
      )}
    </figure>
  )
}
