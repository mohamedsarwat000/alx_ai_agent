import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { CHATBOT_SYSTEM_PROMPT } from "./prompts";

const PORT = Number(process.env.PORT || 3000);

function json(res: ResponseInit & { status?: number }, data: unknown) {
  return new Response(JSON.stringify(data), {
    status: res.status ?? 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(res.headers || {}),
    },
  });
}

function notFound() {
  return new Response("Not Found", { status: 404 });
}

function okTextStream(headers: Record<string, string> = {}) {
  return {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  } as ResponseInit;
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Serve static UI
    if (req.method === "GET" && url.pathname === "/") {
      return new Response(Bun.file("public/index.html"));
    }

    // Simple health check
    if (req.method === "GET" && url.pathname === "/health") {
      return json({}, { ok: true });
    }

    // Chat endpoint: POST /chat { message: string }
    if (req.method === "POST" && url.pathname === "/chat") {
      try {
        const contentType = req.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          return json({ status: 400 }, { error: "Expected application/json" });
        }
        const body = (await req.json().catch(() => ({}))) as { message?: unknown };
        const message = typeof body.message === "string" ? body.message.trim() : "";
        if (!message) {
          return json({ status: 400 }, { error: "Missing 'message' in body" });
        }

        const result = streamText({
          model: google("models/gemini-2.5-flash"),
          system: CHATBOT_SYSTEM_PROMPT,
          prompt: message,
        });

        const { readable, writable } = new TransformStream();
        (async () => {
          const writer = writable.getWriter();
          const encoder = new TextEncoder();
          try {
            for await (const chunk of result.textStream) {
              await writer.write(encoder.encode(chunk));
            }
          } finally {
            await writer.close();
          }
        })();

        return new Response(readable, okTextStream());
      } catch (err) {
        console.error("/chat error", err);
        return json({ status: 500 }, { error: "Internal Server Error" });
      }
    }

    return notFound();
  },
});

console.log(`🚀 Chatbot server running at http://localhost:${PORT}`);
