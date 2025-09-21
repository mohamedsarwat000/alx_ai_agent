import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { CHATBOT_SYSTEM_PROMPT } from "./prompts";

/**
 * Core chatbot agent that streams AI responses to stdout
 * @param message - The user's input message
 * @param options - Optional configuration for system prompt and model
 * @param options.system - Custom system prompt (defaults to CHATBOT_SYSTEM_PROMPT)
 * @param options.model - Model ID to use (defaults to "models/gemini-2.5-flash")
 */
async function chatbotAgent(message: string, options?: { system?: string; model?: string }) {
  const system = options?.system ?? CHATBOT_SYSTEM_PROMPT;
  const modelId = options?.model ?? "models/gemini-2.5-flash";

  const result = streamText({
    model: google(modelId),
    system,
    prompt: message,
  });

  // Stream response chunks directly to stdout for real-time display
  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }
}

// Export for testing and reuse
export { chatbotAgent };

/**
 * CLI entry point for the chatbot
 * Processes command line arguments and invokes the chatbot agent
 */
async function main() {
  const [, , ...args] = process.argv;
  const message = args.join(" ").trim();
  
  if (!message) {
    console.error("Usage: bun run chatbot.ts \"your message here\"");
    console.error("Example: bun run chatbot.ts \"What is TypeScript?\"");
    process.exit(1);
  }
  
  try {
    await chatbotAgent(message);
    console.log(); // Add newline after response
  } catch (error) {
    console.error("\nError:", error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}
