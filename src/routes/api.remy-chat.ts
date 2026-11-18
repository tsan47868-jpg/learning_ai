import { chat, toServerSentEventsResponse } from '@tanstack/ai'
import { openaiCompatibleText } from '@tanstack/ai-openai/compatible'
import { createFileRoute } from '@tanstack/react-router'

const SYSTEM_PROMPT = `You are the Learning AI Tutor, a patient, encouraging guide who helps people understand AI and build practical skills.

TEACHING STYLE:
- Meet the learner at their level. Ask a brief clarifying question when their goal or background is unclear.
- Explain ideas in plain language, then use a concrete example or analogy.
- Teach step by step and check understanding with a small question or practice task when useful.
- Encourage curiosity and acknowledge progress without being over the top.
- For coding or API questions, show small working examples and explain how to adapt them.
- EVERY response must end with a fenced html code block that draws a visual explanation with CSS. Include a style element and a compact HTML fragment with labeled shapes/cards that directly represent the learner’s question and your answer. Wrap the drawing in an element with id ai-board. Put each step or concept in its own element with class ai-node so the board can automatically draw connecting arrows between them. Arrange the concepts in a clear sequence; do not leave ideas as unconnected cards. Use a handwritten font stack such as Segoe Print, Comic Sans MS, cursive. Make the layout responsive, clear, and readable on a small board. Use only inline CSS and ordinary HTML/SVG elements. Never include scripts, external URLs, iframes, forms, or event handlers. Even greetings or short factual answers need a small visual that maps the question to its answer or example. Do not omit the drawing.
- Be honest about uncertainty, current limitations, and when an answer needs verification.
- Keep replies focused. Use headings, lists, and code blocks when they make the explanation easier to follow.

You can help with AI foundations, prompting, machine learning, generative AI, API setup, automation, coding, project planning, privacy, and responsible use. You are a tutor, so guide the learner toward understanding rather than only giving them an answer.`

export const Route = createFileRoute('/api/remy-chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const abortController = new AbortController()
        request.signal.addEventListener(
          'abort',
          () => abortController.abort(),
          { once: true },
        )

        try {
          const apiKey = process.env.OPEN_ROUTER_API_KEY
          if (!apiKey) {
            return Response.json(
              { error: 'OPEN_ROUTER_API_KEY is not configured on the server.' },
              { status: 503 },
            )
          }

          const body = await request.json()
          if (!Array.isArray(body.messages)) {
            return Response.json({ error: 'A messages array is required.' }, { status: 400 })
          }
          if (typeof body.threadId !== 'string' || !body.threadId.trim()) {
            return Response.json({ error: 'A threadId is required.' }, { status: 400 })
          }

          const model = process.env.OPEN_ROUTER_MODEL || 'openai/gpt-4o-mini'
          const adapter = openaiCompatibleText(
            model,
            {
              name: 'openrouter',
              api: 'chat-completions',
              models: [model],
              apiKey,
              baseURL: 'https://openrouter.ai/api/v1',
            },
          )

          const stream = chat({
            adapter,
            systemPrompts: [SYSTEM_PROMPT],
            messages: body.messages,
            threadId: body.threadId,
            abortController,
          })

          return toServerSentEventsResponse(stream, { abortController })
        } catch (error) {
          console.error('Learning AI tutor error:', error)
          if (error instanceof Error && error.name === 'AbortError') {
            return new Response(null, { status: 499 })
          }
          return Response.json(
            { error: 'The tutor could not answer just now. Please try again.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
