import { createFileRoute } from '@tanstack/react-router'

const MAX_PROMPT_LENGTH = 900

export const Route = createFileRoute('/api/remy-image')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const apiKey = process.env.OPEN_ROUTER_API_KEY
          if (!apiKey) {
            return Response.json(
              { error: 'OPEN_ROUTER_API_KEY is not configured on the server.' },
              { status: 503 },
            )
          }

          const body = await request.json()
          const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, MAX_PROMPT_LENGTH) : ''
          if (!prompt) {
            return Response.json({ error: 'A short image prompt is required.' }, { status: 400 })
          }

          const model = process.env.OPEN_ROUTER_IMAGE_MODEL || 'google/gemini-2.5-flash-image'
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model,
              messages: [{ role: 'user', content: prompt }],
              modalities: ['image', 'text'],
            }),
            signal: request.signal,
          })

          if (!response.ok) {
            const detail = await response.text().catch(() => '')
            if (response.status === 402) {
              return Response.json(
                { error: 'Image generation needs at least $1.00 in OpenRouter credits. Add credits at openrouter.ai/settings/credits, then try again.' },
                { status: 402 },
              )
            }
            console.error('Image generation failed:', detail.slice(0, 500))
            return Response.json(
              { error: 'The image could not be generated just now. Please try again.' },
              { status: 502 },
            )
          }

          const result = await response.json()
          const message = result?.choices?.[0]?.message
          const images = message?.images
          const imageUrl = Array.isArray(images)
            ? images.find((item: { image_url?: { url?: string } }) => item?.image_url?.url)?.image_url?.url
            : undefined
          const contentParts = Array.isArray(message?.content) ? message.content : []
          const inlineUrl = contentParts.find(
            (part: { type?: string; image_url?: { url?: string } }) =>
              part?.type === 'image_url' && part?.image_url?.url,
          )?.image_url?.url
          const url = imageUrl || inlineUrl

          if (typeof url !== 'string' || !(url.startsWith('data:image/') || url.startsWith('https://'))) {
            return Response.json(
              { error: 'The image model returned no usable image. Try a different description.' },
              { status: 502 },
            )
          }

          return Response.json({ image: url })
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') return new Response(null, { status: 499 })
          console.error('Learning AI image error:', error)
          return Response.json({ error: 'The image could not be generated just now. Please try again.' }, { status: 500 })
        }
      },
    },
  },
})
