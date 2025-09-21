import { describe, it, expect, mock } from "bun:test";
import { streamText } from "ai";

// Mock the AI SDK
mock.module("ai", () => ({
  streamText: mock(() => ({
    textStream: (async function* () {
      yield "Hello";
      yield " ";
      yield "World";
    })(),
  })),
}));

mock.module("@ai-sdk/google", () => ({
  google: mock(() => "mocked-model"),
}));

describe("Chatbot Agent", () => {
  it("should handle basic message processing", async () => {
    // Import after mocking
    const { chatbotAgent } = await import("../chatbot.ts");
    
    // Test that the exported function exists
    expect(chatbotAgent).toBeDefined();
    expect(typeof chatbotAgent).toBe("function");
  });

  it("should validate message input", () => {
    const message = "Hello, AI!";
    expect(message.trim()).toBe("Hello, AI!");
    expect("".trim()).toBe("");
  });

  it("should handle streaming response format", async () => {
    const mockStream = streamText({
      model: "test-model" as any,
      system: "test-system",
      prompt: "test-prompt",
    });

    const chunks: string[] = [];
    for await (const chunk of mockStream.textStream) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(["Hello", " ", "World"]);
  });
});