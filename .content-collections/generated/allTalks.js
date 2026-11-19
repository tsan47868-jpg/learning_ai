
export default [
  {
    "title": "AI Foundations: How Models Actually Work",
    "speaker": "Marie Dubois",
    "duration": "90 minutes",
    "image": "talks/ai-foundations-how-models-actually-work.jpg",
    "topics": [
      "AI Basics",
      "Machine Learning",
      "Generative AI"
    ],
    "content": "Marie Dubois opens the learning path with the session everything else builds on: what an AI model really is, what it can do, and where it quietly goes wrong. No math background required — just curiosity and a willingness to unlearn a few things you have read online.\n\n## What You'll Learn\n\n**Models, Not Magic**\nMarie explains what happens when a model \"answers\" a question: it predicts likely text from patterns it saw during training. That single idea resolves most myths — why AI can sound confident while being wrong, and why it never truly \"looks things up\" unless you build that in.\n\n**Training vs. Using**\nYou will see the difference between training a model and prompting one, why most learners only ever do the second, and what that means for the answers you get. Analogy: training is writing the textbook; prompting is asking a student a question.\n\n**Where the Limits Are**\nMarie walks through the failure modes you will meet in real work — stale knowledge, invented details, brittle reasoning on long tasks — and the habit that catches them: treating the output as a draft, never as a source.\n\n**A Shared Vocabulary**\nTokens, parameters, context windows, hallucination. By the end you will use these words precisely, which turns every later conversation about AI from intimidating to ordinary.\n\n## Who Should Attend\n\nComplete beginners, curious professionals, and anyone who has used a chatbot but never understood what was happening behind it. No technical background needed.\n\n*\"You do not need to understand engines to drive — but you should know what is under the hood, and when to check the oil.\"* — Marie Dubois",
    "_meta": {
      "filePath": "ai-foundations-how-models-actually-work.md",
      "fileName": "ai-foundations-how-models-actually-work.md",
      "directory": ".",
      "extension": "md",
      "path": "ai-foundations-how-models-actually-work"
    },
    "slug": "ai-foundations-how-models-actually-work"
  },
  {
    "title": "Automate Your Repetitive Work",
    "speaker": "Kenji Nakamura",
    "duration": "90 minutes",
    "image": "talks/automate-your-repetitive-work.jpg",
    "topics": [
      "Automation",
      "Workflows",
      "Productivity"
    ],
    "content": "Kenji Nakamura has spent a career making boring work disappear. In this session he shows how to find the tasks worth automating, design workflows that survive real life, and add AI exactly where it helps — without building something fragile you will quietly abandon in a month.\n\n## What You'll Learn\n\n**Pick the Right Task**\nNot everything repetitive is worth automating. Kenji shares his filter: frequent, rule-based, reversible, and low-judgment. If a task fails one of those tests, it probably wants a human, a checklist, or no change at all.\n\n**Map Before You Build**\nBefore touching a tool, you will sketch a workflow as a simple chain: trigger, steps, decisions, outcome. Kenji shows why this ten-minute habit prevents the classic failure of automating the wrong thing very efficiently.\n\n**Where AI Fits**\nAI earns its place in the steps that need judgment on messy input — summarizing, classifying, drafting, extracting. Kenji demonstrates each pattern on a realistic example: turning a messy inbox into a prioritized action list.\n\n**Keep a Human in the Loop**\nKenji's rule for first versions: automate the suggestion, not the action. Approval steps, logs, and an off-switch come first; full autonomy is something a workflow earns.\n\n## Who Should Attend\n\nAnyone who repeats the same digital tasks weekly — operations, marketing, admin, support, or solo builders. No coding required for the core patterns.\n\n*\"Automate the dull parts, keep the judgement parts, and measure the hours you get back.\"* — Kenji Nakamura",
    "_meta": {
      "filePath": "automate-your-repetitive-work.md",
      "fileName": "automate-your-repetitive-work.md",
      "directory": ".",
      "extension": "md",
      "path": "automate-your-repetitive-work"
    },
    "slug": "automate-your-repetitive-work"
  },
  {
    "title": "Build a Useful AI Chatbot",
    "speaker": "André Costa",
    "duration": "120 minutes",
    "image": "talks/build-a-useful-ai-chatbot.jpg",
    "topics": [
      "Build with AI",
      "Projects",
      "Prototyping"
    ],
    "content": "André Costa's signature session: in one afternoon you build a chatbot that answers real questions about something you care about — and deploy it where other people can use it. The goal is not a demo. It is a small, finished, useful thing.\n\n## What You'll Learn\n\n**Start With the Question, Not the Code**\nAndré begins where successful projects begin: who will use this, what will they ask, and what does a good answer look like? You will write five real questions before writing any code — and those questions become your test set.\n\n**Grounding: Giving the Bot Your Knowledge**\nA general chatbot knows everything and your context. You will add your own documents or pages, keep answers tied to them, and add the honest fallback: \"I don't have that information.\" Simple retrieval, explained without jargon.\n\n**The Conversation Loop**\nYou will build the parts that make a bot feel usable: remembering the current conversation, handling a message that arrived empty, staying on topic, and knowing when to hand off to a person.\n\n**Ship It and Iterate**\nAndré deploys the bot so it has a real URL, then walks through what changes once strangers use it — the questions you never imagined, and how each one becomes a small improvement.\n\n## Who Should Attend\n\nPeople who have completed the foundations sessions and want a project to show for it. Some coding helps, but André provides a complete starter template either way.\n\n*\"Ship the smallest version that helps someone. Everything you learn next comes from using it.\"* — André Costa",
    "_meta": {
      "filePath": "build-a-useful-ai-chatbot.md",
      "fileName": "build-a-useful-ai-chatbot.md",
      "directory": ".",
      "extension": "md",
      "path": "build-a-useful-ai-chatbot"
    },
    "slug": "build-a-useful-ai-chatbot"
  },
  {
    "title": "Evaluate and Improve AI Output",
    "speaker": "Priya Sharma",
    "duration": "75 minutes",
    "image": "talks/evaluate-and-improve-ai-output.jpg",
    "topics": [
      "Evaluation",
      "Quality",
      "Iteration"
    ],
    "content": "Priya Sharma teaches the skill that separates AI users from AI professionals: judging output systematically instead of shrugging at it. If you have ever thought \"this is… fine, I guess\" — this session gives you a better answer than guesswork.\n\n## What You'll Learn\n\n**Define \"Good\" Before You Test**\nPriya shows how to turn a vague wish (\"the summary should be good\") into checkable criteria: coverage, accuracy, tone, length. Ten minutes of definition saves hours of re-rolling and hoping.\n\n**Build a Tiny Test Set**\nYou will collect ten real inputs and record what a correct output looks like for each. This becomes your personal benchmark — the same idea professional teams use, sized for one person.\n\n**Spot the Failure Patterns**\nPriya catalogs the recurring ways models fail — confident wrong facts, drifted format, ignored instructions, sycophantic agreement — and the specific check that catches each one.\n\n**Iterate With Evidence**\nArmed with failures, you will fix prompts where it actually helps, add examples where wording is the problem, and accept when the model is simply the wrong tool for the job.\n\n## Who Should Attend\n\nPractical AI users who ship real work and want to trust it more — writers, analysts, developers, and team leads. Beginner-friendly statistics-free approach.\n\n*\"You cannot improve what you have never measured. And you do not need a lab to measure ten examples.\"* — Priya Sharma",
    "_meta": {
      "filePath": "evaluate-and-improve-ai-output.md",
      "fileName": "evaluate-and-improve-ai-output.md",
      "directory": ".",
      "extension": "md",
      "path": "evaluate-and-improve-ai-output"
    },
    "slug": "evaluate-and-improve-ai-output"
  },
  {
    "title": "Keep Exploring: Choosing Tools and Learning Next",
    "speaker": "Priya Sharma",
    "duration": "60 minutes",
    "image": "talks/keep-exploring-choosing-tools-and-learning-next.jpg",
    "topics": [
      "Keep Exploring",
      "Tooling",
      "Learning Path"
    ],
    "content": "The AI tool landscape changes monthly, and Priya Sharma's final session is about navigating it without drowning. Learn to evaluate new tools calmly, decide what is worth adopting, and build a learning routine that keeps up without burning you out.\n\n## What You'll Learn\n\n**Filter the Noise**\nNew models and tools launch constantly, each with a demo that looks miraculous. Priya shares a durable filter — start from the task you have, not the feature being marketed — that survives every release cycle.\n\n**A One-Page Tool Evaluation**\nYou will practice a quick scorecard: does it fit your actual task, what does it cost, where does your data go, and can you leave easily? Five questions that end most \"should we adopt this?\" debates.\n\n**Adopt Deliberately**\nPriya shows how to trial a tool safely on something unimportant, decide with a real week of use instead of first impressions, and keep an exit path so no single tool owns your workflow.\n\n**A Learning Routine That Lasts**\nFinally: how professionals keep current — a handful of trusted sources, one project in progress at all times, and the discipline of ignoring the rest without guilt.\n\n## Who Should Attend\n\nAnyone completing the learning path who wants to continue independently. Ideal as a closing session — you leave with a scorecard, a routine, and a next step.\n\n*\"The goal was never to know every tool. It is to never be lost when the tools change.\"* — Priya Sharma",
    "_meta": {
      "filePath": "keep-exploring-choosing-tools-and-learning-next.md",
      "fileName": "keep-exploring-choosing-tools-and-learning-next.md",
      "directory": ".",
      "extension": "md",
      "path": "keep-exploring-choosing-tools-and-learning-next"
    },
    "slug": "keep-exploring-choosing-tools-and-learning-next"
  },
  {
    "title": "Prompting for Reliable Results",
    "speaker": "Marie Dubois",
    "duration": "60 minutes",
    "image": "talks/prompting-for-reliable-results.jpg",
    "topics": [
      "Prompting",
      "Practical Skills",
      "Workflows"
    ],
    "content": "A good prompt is not magic words — it is a clear brief. In this session Marie Dubois turns prompting from superstition into a repeatable skill you can apply to any model, in any tool, starting today.\n\n## What You'll Learn\n\n**The Anatomy of a Prompt**\nMarie breaks every effective prompt into four parts: the role you give the model, the context it needs, the task you actually want, and the shape of the output. Once you can name these parts, you stop guessing and start constructing.\n\n**Context Is the Whole Game**\nMost weak answers come from questions the model could not answer well. Marie shows how a few sentences of context — who the audience is, what you already tried, what \"good\" looks like — change results more than any clever phrasing.\n\n**Show the Output You Want**\nOne worked example outperforms three paragraphs of description. You will practice giving examples, specifying format and length, and asking for the response you need the first time.\n\n**Iterate Instead of Restarting**\nRather than rewriting from scratch, learn to push a response: \"shorter,\" \"more formal,\" \"just the steps.\" Marie demonstrates a full iteration loop from vague request to usable result in four turns.\n\n## Who Should Attend\n\nAnyone who uses AI for writing, planning, research, or code and wants steadier results. Beginner-friendly, with plenty for experienced users to sharpen.\n\n*\"The model is not the variable you cannot control. Your clarity is the variable you can.\"* — Marie Dubois",
    "_meta": {
      "filePath": "prompting-for-reliable-results.md",
      "fileName": "prompting-for-reliable-results.md",
      "directory": ".",
      "extension": "md",
      "path": "prompting-for-reliable-results"
    },
    "slug": "prompting-for-reliable-results"
  },
  {
    "title": "Responsible AI in Practice",
    "speaker": "Isabella Martinez",
    "duration": "90 minutes",
    "image": "talks/responsible-ai-in-practice.jpg",
    "topics": [
      "Responsible Use",
      "Privacy",
      "Human Review"
    ],
    "content": "Isabella Martinez replaces vague advice about \"using AI responsibly\" with habits you can apply on Monday morning. This session is about the practical decisions — what to feed a model, what to check, and when to keep a human firmly in the loop.\n\n## What You'll Learn\n\n**Privacy: What Leaves Your System**\nIsabella shows how to think about what you paste into AI tools — customer data, personal details, company secrets — and simple alternatives: anonymize first, summarize instead of sharing, and know your tool's data policy before you type.\n\n**Accuracy: Verify What Matters**\nNot every output deserves the same scrutiny. Isabella introduces a risk-based check: low-stakes brainstorming needs a glance; anything factual, financial, medical, or public needs a source and a second look. You will build your own quick verification habit.\n\n**Bias and Fairness in Real Decisions**\nUsing a hiring screening example, Isabella demonstrates how bias enters through data and task design, and the safeguards that catch it — diverse test cases, human review on consequential decisions, and documented criteria.\n\n**Keep Judgment Where It Belongs**\nThe closing framework: automate drafting and sorting, but keep responsibility — the decision and the signature — with a person who can explain them.\n\n## Who Should Attend\n\nEveryone using AI in real work, especially team leads, and anyone asked to write or review an AI usage policy. No technical background required.\n\n*\"Responsible is not a paragraph in a policy. It is the small decision you make every time before you hit send.\"* — Isabella Martinez",
    "_meta": {
      "filePath": "responsible-ai-in-practice.md",
      "fileName": "responsible-ai-in-practice.md",
      "directory": ".",
      "extension": "md",
      "path": "responsible-ai-in-practice"
    },
    "slug": "responsible-ai-in-practice"
  },
  {
    "title": "Set Up Your First AI API",
    "speaker": "Hans Mueller",
    "duration": "105 minutes",
    "image": "talks/set-up-your-first-ai-api.jpg",
    "topics": [
      "AI API Setup",
      "Integration",
      "Configuration"
    ],
    "content": "Hans Mueller walks you from a blank terminal to a working AI feature. This is the session where \"someday I'll build with AI\" becomes a request you made yourself, with a response your own code received — keys, errors, and all.\n\n## What You'll Learn\n\n**Keys, Models, and Requests**\nHans explains the three concepts that trip up every beginner: API keys (how you authenticate), model names (what you call), and request shape (what you send). You will create a key, make a first call, and read the response line by line.\n\n**Your First Working Example**\nYou will build a minimal, complete example: a script that sends a prompt and prints the answer. Hans keeps the code short on purpose — every line is something he can explain.\n\n**Errors Are Information**\nRate limits, invalid keys, timeouts, model-not-found: Hans triggers each one deliberately and shows what it means. Most \"AI is broken\" moments are a status code telling you exactly what to fix.\n\n**Cost, Limits, and Safety**\nYou will learn to track token usage, estimate spend before it surprises you, and handle keys safely — environment variables, never committed code, and rotation when one leaks.\n\n## Who Should Attend\n\nDevelopers new to AI APIs and technical beginners who know a little programming. Bring a laptop; leave with a working request and the confidence to read the docs alone.\n\n*\"Every integration expert has seen the same error messages as you. The difference is they know the error is halfway to the answer.\"* — Hans Mueller",
    "_meta": {
      "filePath": "set-up-your-first-ai-api.md",
      "fileName": "set-up-your-first-ai-api.md",
      "directory": ".",
      "extension": "md",
      "path": "set-up-your-first-ai-api"
    },
    "slug": "set-up-your-first-ai-api"
  }
]