# AI Chatbot + Code Review Agent: Development Plan

## Overview
Transform the existing project into a simple AI chatbot alongside the existing code review agent. The chatbot provides a minimal UI (terminal-first with an optional light web UI) and shares the same AI stack (`ai`, `@ai-sdk/google`) for consistency.

## Goals
- Provide a simple, reliable chatbot experience with streaming responses.
- Keep the codebase small and idiomatic to Bun + TypeScript.
- Reuse the existing AI stack and patterns already present in `index.ts` and `prompts.ts`.
- Maintain a clean, reviewable workflow with clear rules and commit messages.

## Scope
- Add a new chatbot feature in parallel to the existing `codeReviewAgent`.
- Offer two usage modes:
  - Terminal CLI (primary, minimal work).
  - Optional lightweight web UI powered by `Bun.serve()`.
- Keep prompts and tool usage explicit and organized.

## Architecture & Folder Structure
Current structure is flat and small; we’ll keep it simple.

- `index.ts` — Entrypoint for the code review agent (existing).
- `prompts.ts` — Centralized system prompts (existing).
- `tools.ts` — Reusable AI tool(s) for code review (existing).
- `chatbot.ts` — New: exports `chatbotAgent()` that streams responses for user messages.
- `server.ts` — New (optional): minimal `Bun.serve()` web UI for the chatbot.
- `public/` — New (optional): static `index.html` + minimal CSS for the chatbot UI.

Note: We can keep the terminal chatbot within `chatbot.ts` and only add `server.ts`/`public/` if desired.

## Suggested Function Signatures
- `chatbotAgent(message: string, options?: { system?: string, model?: string }): Promise<void>`
  - Streams assistant output to `stdout`.
- `startChatbotServer(port?: number): Promise<void>`
  - Starts a minimal HTTP server that serves a static UI and a `/chat` endpoint for streaming.

## Prompts & Symbols
- System prompt (chatbot):
  - "You are a helpful AI assistant. Answer clearly and concisely. Prefer examples and short step-by-step guidance when helpful."
- Symbols (context anchors you’ll use during development):
  - `@code` — to reference snippets directly from files.
  - `#file` — to reference a specific file like `#file:prompts.ts` for quick in-editor context.
  - `@thread` — to keep iterative changes grounded in this conversation history.
  - `@todo` — for inline task markers.
- Prompt templates:
  - User prompt template (CLI): `"User: ${message}\nAssistant:"`
  - User prompt template (Web): JSON payload `{ message: string }` to `/chat`.

## Security & Performance Considerations
- Use streaming (`streamText`) for responsiveness with longer replies.
- Cap token usage in the model config if needed for cost/perf control.
- Sanitize/validate input for the server endpoint to avoid crashes.
- Avoid exposing any API keys in client code; proxy requests via server.
- Limit tools accessible to the chatbot (no file system tools by default).

## Implementation Steps
1. Create `chatbot.ts` implementing `chatbotAgent()` using `ai` + `@ai-sdk/google` with streaming (mirror pattern in `index.ts`).
2. Add minimal CLI runner to invoke `chatbotAgent()` with a provided message (e.g., via `bun run chatbot "hello"`).
3. Optional: Add `server.ts` with `Bun.serve()` serving:
   - `GET /` static `public/index.html`.
   - `POST /chat` which streams model output using `text/event-stream` or chunked transfer.
4. Optional: Add `public/index.html` with a simple input box and streaming display.
5. Test streaming, error handling, and input validation.
6. Refactor for clarity (extract prompt, consolidate common AI config, avoid duplication across `index.ts` and `chatbot.ts`).

## Refactor & Review Workflow
- Run a local diff to verify the refactor does not alter behavior:
  - `git diff -n 20` (or similar) before and after refactor.
- Ask AI to refactor for clarity/performance (focus on eliminating duplication and improving naming).
- Simulate code review:
  - Use the existing `codeReviewAgent` with a prompt targeting the changed directory.
  - Ask for correctness, readability, and maintainability feedback.

## Example In-Editor Context Commands
- `@code chatbot.ts` — inspect streaming logic.
- `#file:prompts.ts` — ensure prompts are consistent.
- `@thread` — maintain iteration context during tweaks.

## Deliverables
- `chatbot.ts` (terminal feature)
- Optionally `server.ts` + `public/index.html`
- This `PLAN.md`
- `.cursorrules`

## Suggested Conventional Commit Messages
- feat(chatbot): add streaming chatbot agent using ai-sdk google model
- chore(scripts): add bun script to run chatbot from cli
- feat(web): add minimal Bun server and static chatbot UI
- refactor(ai): extract shared model config and system prompts
- docs(plan): add AI dev workflow plan and prompts
- style(ui): polish chatbot UI and improve accessibility
- fix(server): handle invalid request payloads and streaming edge cases
- test(chatbot): add basic smoke tests for cli and server endpoints

## How to Run (once implemented)
- CLI: `bun run chatbot "Hello!"`
- Server: `bun run dev` then open `http://localhost:3000`
