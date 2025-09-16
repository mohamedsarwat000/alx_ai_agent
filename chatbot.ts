import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { CHATBOT_SYSTEM_PROMPT } from "./prompts";

async function chatbotAgent(message: string, options?: { system?: string; model?: string }) {
  const system = options?.system ?? CHATBOT_SYSTEM_PROMPT;
  const modelId = options?.model ?? "models/gemini-2.5-flash";

  const result = streamText({
    model: google(modelId),
    system,
    prompt: message,
  });

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }
}

async function main() {
  const [, , ...args] = process.argv;
  const message = args.join(" ").trim();
  if (!message) {
    console.error("Usage: bun run chatbot.ts \"your message here\"");
    process.exit(1);
  }
  await chatbotAgent(message);
}

if (import.meta.main) {
  main();
}
