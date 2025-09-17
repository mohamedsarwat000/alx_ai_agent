# ALX AI Agent – Code Review Agent + Simple Chatbot

This project is a small, Bun + TypeScript codebase showcasing two AI-powered capabilities:

- Code Review Agent (terminal streaming) based on a focused code review system prompt and a Git diff tool.
- Simple AI Chatbot with:
  - CLI interface (streaming to stdout)
  - Minimal Web UI served via `Bun.serve()`

The stack uses `ai` and `@ai-sdk/google` to stream responses from a Google model.

## Features

- Code review agent in `index.ts` with `SYSTEM_PROMPT` from `prompts.ts`.
- Git diff tool in `tools.ts` exposed as `getFileChangesInDirectoryTool`.
- Chatbot CLI in `chatbot.ts` using `CHATBOT_SYSTEM_PROMPT`.
- Minimal web server in `server.ts` and basic UI in `public/index.html`.
- Project guidance via `.cursorrules` and the full development plan in `PLAN.md`.

## Requirements

- Bun (latest): https://bun.sh/
- Node.js (optional, not required to run, but useful for tooling)
- A Google Generative AI API key

## Setup

1) Install dependencies (Bun will use `package.json`):

```bash
bun install
```

2) Set your Google key (PowerShell example on Windows):

```powershell
$env:GOOGLE_GENERATIVE_AI_API_KEY = "YOUR_API_KEY_HERE"
```

Alternatively, create a `.env` file in the project root and add:

```env
GOOGLE_GENERATIVE_AI_API_KEY=YOUR_API_KEY_HERE
```

Ensure your environment loads `.env` when running (Bun supports this if configured in your shell; otherwise set the variable in your session).

## Scripts

Defined in `package.json`:

- `bun run chat "message"` – Run the CLI chatbot once with a prompt.
- `bun run dev` – Start the minimal web server at `http://localhost:3000`.

## Usage

### 1) Code Review Agent (existing)

The code review agent streams review text for a target directory. See `index.ts` and adjust the prompt:

```ts
await codeReviewAgent(
  "Review the code changes in '../my-agent' directory, make your reviews and suggestions file by file",
);
```

Run with Bun:

```bash
bun run index.ts
```

### 2) Chatbot – CLI

```bash
bun run chat "Hello from CLI"
```

The response will stream to `stdout`.

### 3) Chatbot – Web UI

```bash
bun run dev
# Open http://localhost:3000
```

Type a message and you’ll see the response stream in the UI.

## Project Structure

```
├─ index.ts            # Code Review Agent entry (streams reviews)
├─ chatbot.ts          # CLI Chatbot entry (streams assistant output)
├─ server.ts           # Minimal Bun server + /chat endpoint
├─ public/
│  └─ index.html       # Simple chat UI
├─ prompts.ts          # SYSTEM_PROMPT and CHATBOT_SYSTEM_PROMPT
├─ tools.ts            # getFileChangesInDirectoryTool (git diff)
├─ PLAN.md             # AI dev workflow plan for this feature
├─ .cursorrules        # Cursor AI rules for this repo
├─ package.json        # Dependencies and Bun scripts
└─ tsconfig.json       # TypeScript config
```

## Development Workflow

This repo includes an AI-enhanced workflow plan in `PLAN.md`. Highlights:

- Choose a focused feature (here: add a chatbot alongside the code review agent).
- Plan and document folder structure, prompts, and function signatures.
- Implement with context anchors (e.g., `@code`, `#file`, `@thread`).
- Refactor for readability/maintainability; run `git diff` before/after changes.
- Optionally simulate a code review using the code review agent.

See `.cursorrules` for high-level guidance the AI should follow in this repo (streaming-first, single-responsibility files, security with keys, conventional commits, and DRY prompts/config).

## Security & Performance

- Never expose API keys in client-side code. The web UI posts to the server, which calls the model.
- Inputs to `/chat` are validated; non-JSON or empty messages receive a 400 error.
- Streaming is used for responsiveness.
- If needed, cap tokens in model configs for cost and latency management.

## Troubleshooting

- If you see no output:
  - Ensure `GOOGLE_GENERATIVE_AI_API_KEY` is set in your environment.
  - Verify your network connectivity and model availability.
  - Check your console for any runtime errors in `server.ts` or `chatbot.ts`.

- If TypeScript errors occur:
  - Make sure you’re running with Bun’s TypeScript support.
  - Inspect `prompts.ts` and `server.ts` for any recent edits.

## Commit Guidelines

Use Conventional Commits. Examples:

- `feat(chatbot): add streaming CLI chatbot agent`
- `feat(web): add minimal Bun server and static chatbot UI`
- `chore(prompts): add chatbot system prompt and fix template literal`
- `chore(scripts): add chat and dev bun scripts`
- `docs(plan): add AI dev workflow plan and Cursor rules`

## License

MIT (or as applicable for your course work). If you’re submitting as coursework, follow your program’s guidelines.