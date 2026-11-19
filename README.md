# Learning AI

A website for learning about AI — part guide site, part hands-on tutor. It pairs a marketing-style learning path with an AI tutor chat that answers questions and draws an editable diagram for every answer.

Built with [TanStack Start](https://tanstack.com/start) (file-based routing), React 19, Tailwind CSS v4, and [TanStack AI](https://ai.tanstack.com) for streaming chat.

## Features

### AI tutor (`/tutor`)
- Streaming chat with a patient, step-by-step teaching style
- **Editable diagrams**: every tutor reply ends with a fenced ` ```diagram ` JSON block that is parsed and rendered as a node/edge diagram you can interact with (legacy ` ```html ` / ` ```drawing ` blocks are still supported)
- Conversation history saved in `localStorage` (key: `learning-ai-tutor-history-v1`) with a sidebar of recent chats
- Suggested prompts and topic shortcuts for starting out

### Site
- Home page with a practical learning path, Build → Grow → Scale journey, and FAQ
- `/talks` — hub of learning areas (AI foundations, automation, APIs, building, responsible use)
- `/talks/:slug` — detail pages rendered from markdown content
- `/speakers`, `/speakers/:slug`, `/schedule` — conference pages kept from the original starter example
- About, Contact, Terms, Privacy, and Cookies pages
- Header with light / dark / auto theme toggle (persisted)

### Content
- Speakers and talks are markdown files managed by [content-collections](https://www.content-collections.dev/) with Zod schemas (see `content-collections.ts`)
- Storybook 10 with Vitest browser tests for component work

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | TanStack Start, TanStack Router (file-based), React 19, TypeScript |
| Build | Vite 8, `npm` |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`), custom tokens/pages in `src/styles.css` |
| AI | `@tanstack/ai`, `@tanstack/ai-react`, OpenRouter via `@tanstack/ai-openai/compatible` |
| Content | `@content-collections/core` + Zod, `marked`, `streamdown` |
| UI | `lucide-react`, `class-variance-authority`, `tailwind-merge` |
| Testing | Storybook 10, Vitest (browser mode, Playwright) |

## Getting started

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:3000)
npm run dev
```

### Environment variables

Create a `.env.local` file:

```bash
# Required: key used by the AI tutor
OPEN_ROUTER_API_KEY=your-openrouter-key

# Optional: model to use (defaults to openai/gpt-4o-mini)
OPEN_ROUTER_MODEL=openai/gpt-4o-mini
```

The tutor works without a key only up to the API route, which returns a `503` if `OPEN_ROUTER_API_KEY` is missing.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run generate-routes` | Run a Vite build (regenerates `src/routeTree.gen.ts`) |
| `npm run storybook` | Storybook on port 6006 |
| `npm run build-storybook` | Build Storybook |

## Routes

| Route | Description |
| --- | --- |
| `/` | Home: hero, learning path, journey stages, FAQ |
| `/talks` | Learning areas hub |
| `/talks/:slug` | Talk/session detail (from `content/talks/*.md`) |
| `/tutor` | AI tutor chat with editable diagrams |
| `/speakers` | Speakers grid (starter example content) |
| `/speakers/:slug` | Speaker profile (starter example content) |
| `/schedule` | Conference schedule (starter example content) |
| `/about`, `/contact`, `/terms`, `/privacy`, `/cookies` | Static pages |
| `/api/remy-chat` | Server route: SSE chat endpoint (POST) |

## Project structure

```
learning-ai/
├── content/
│   ├── speakers/          # Speaker markdown files
│   └── talks/             # Talk/session markdown files
├── src/
│   ├── routes/            # File-based routes (TanStack Router)
│   │   ├── __root.tsx     # Root layout
│   │   ├── tutor.tsx      # AI tutor page
│   │   └── api.remy-chat.ts  # Chat API (SSE)
│   ├── components/        # UI (Header, Footer, TutorDrawingBoard, RemyAssistant, …)
│   ├── lib/               # Chat hook, diagram parsing, utilities
│   ├── stories/           # Storybook stories
│   ├── styles.css         # Tailwind entry + design tokens + page styles
│   └── routeTree.gen.ts   # Generated route tree — do not edit by hand
├── content-collections.ts # Zod schemas for speaker/talk content
├── vite.config.ts         # Vite plugins (TanStack Start, Tailwind, content-collections)
└── tsr.config.json        # TanStack Router config
```

## How the AI tutor works

1. **Client** — `src/routes/tutor.tsx` uses the `useConferenceChat` hook (`src/lib/conference-ai-hook.ts`), which wraps `useChat` from `@tanstack/ai-react` and streams server-sent events from `/api/remy-chat`.
2. **Server** — `src/routes/api.remy-chat.ts` validates the request, builds an OpenRouter-backed text adapter, and streams the model response with `chat()` + `toServerSentEventsResponse()`. The system prompt defines the teaching style and the diagram protocol.
3. **Diagrams** — each reply must end with one fenced block:

   ````markdown
   ```diagram
   {"title":"…","nodes":[{"id":"…","label":"…","kind":"start|process|decision|result"}],"edges":[{"from":"…","to":"…"}]}
   ```
   ````

   `src/lib/tutor-diagram.ts` parses and validates it; `src/components/TutorDrawingBoard.tsx` renders it. If a reply has no diagram, the page derives a simple one from the answer text. Use the **redraw** action on the board to ask for a clearer layout.
4. **History** — conversations are saved to `localStorage` and restored on load; each chat gets a title from the first user message.

## Adding content

Create a markdown file in `content/talks/`:

```markdown
---
title: "Session Title"
speaker: "Chef Name"
duration: "90 minutes"
image: "talks/session-image.jpg"
topics:
  - "Topic 1"
  - "Topic 2"
---

Session description here...
```

Or a speaker in `content/speakers/`:

```markdown
---
name: "Chef Name"
title: "Executive Pastry Chef"
specialty: "French Pastry"
restaurant: "Restaurant Name"
location: "City, Country"
headshot: "speakers/chef-name.jpg"
awards:
  - "Award 1"
---

Bio content here...
```

Slugs are generated from `title` (talks) or `name` (speakers). Schemas live in `content-collections.ts`.

## Styling

- Tailwind CSS v4 is wired up through `@tailwindcss/vite`; the entry point and custom design tokens are in `src/styles.css`.
- The theme toggle cycles light → dark → auto (system) and persists the choice in `localStorage` under `theme`.
- Page-specific styles (home, tutor, topics) live alongside the tokens in `src/styles.css`.

## Origin

This project was scaffolded from the TanStack Start starter with the **Storybook** and **events** (pastry conference) add-ons — see `.cta.json`. The conference pages, components (`RemyAssistant`, `SpeakerCard`, `TalkCard`), and content in `content/` are starter material that has since been adapted for Learning AI.

## Learn more

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [TanStack AI](https://ai.tanstack.com)
- [Tailwind CSS](https://tailwindcss.com)
- [content-collections](https://www.content-collections.dev/)
