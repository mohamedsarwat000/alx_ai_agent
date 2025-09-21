# Usage Guide

This guide covers how to use both the code review agent and the chatbot features.

## Prerequisites

1. **Install Bun**: https://bun.sh/
2. **Get Google AI API Key**: https://aistudio.google.com/app/apikey
3. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env and add your API key
   ```

## Code Review Agent

The code review agent analyzes git diffs and provides detailed feedback.

### Basic Usage

```bash
bun run index.ts
```

### Customizing the Review

Edit the prompt in `index.ts`:

```typescript
await codeReviewAgent(
  "Review the code changes in '../my-project' directory, focus on security and performance",
);
```

### Example Output

```
🔍 Code Review Results:

📁 src/utils.ts
✅ Good: Clean function naming and clear logic flow
⚠️  Consider: Add input validation for the `processData` function
🐛 Issue: Potential null pointer exception on line 23

📁 src/api.ts  
✅ Good: Proper error handling implementation
💡 Suggestion: Extract the validation logic into a separate utility
```

## Chatbot

The chatbot provides two interfaces: CLI and Web UI.

### CLI Chatbot

**Single message:**
```bash
bun run chat "What is TypeScript?"
```

**Interactive mode:**
```bash
# Start a conversation
bun run chat "Hello, I need help with React hooks"
# Response streams in real-time
```

### Web UI Chatbot

**Start the server:**
```bash
bun run dev
```

**Open browser:**
```
http://localhost:3000
```

**Features:**
- Real-time streaming responses
- Dashboard sidebar with navigation
- Chat history (session-based)
- Responsive design

## Advanced Configuration

### Custom System Prompts

Edit `prompts.ts` to customize AI behavior:

```typescript
export const CHATBOT_SYSTEM_PROMPT = `You are a specialized coding assistant...`;
```

### Model Selection

Change the model in your code:

```typescript
// In chatbot.ts or server.ts
const modelId = "models/gemini-2.5-flash"; // or gemini-pro
```

### Server Configuration

Environment variables:

```bash
PORT=8080                    # Custom port
LOG_LEVEL=warn              # Reduce logging
DEFAULT_MODEL=gemini-pro    # Different model
```

## Testing

Run the test suite:

```bash
bun test
```

**Test files:**
- `tests/chatbot.test.ts` - Core chatbot functionality
- `tests/server.test.ts` - Server utilities and validation

## Troubleshooting

### Common Issues

**"API key not found"**
```bash
# Check your environment
echo $GOOGLE_GENERATIVE_AI_API_KEY

# Or set it directly
export GOOGLE_GENERATIVE_AI_API_KEY="your_key_here"
```

**"Port already in use"**
```bash
# Use a different port
PORT=3001 bun run dev
```

**"Module not found"**
```bash
# Reinstall dependencies
bun install
```

### Debug Mode

Enable verbose logging:

```bash
LOG_LEVEL=info bun run dev
```

## API Reference

### Chatbot Agent Function

```typescript
async function chatbotAgent(
  message: string, 
  options?: { 
    system?: string;  // Custom system prompt
    model?: string;   // Model ID
  }
): Promise<void>
```

### Server Endpoints

**GET /**
- Returns the chat UI HTML

**POST /chat**
- Body: `{ message: string }`
- Response: Streaming text/plain
- Max message length: 4000 characters

**GET /health**
- Returns: `{ ok: true }`

## Performance Tips

1. **Streaming**: Both CLI and web interfaces use streaming for responsive UX
2. **Message Length**: Keep messages under 4000 characters for best performance
3. **Concurrent Requests**: The server handles multiple simultaneous chats
4. **Memory Usage**: Chat history is stored in memory (resets on server restart)

## Security Notes

- API keys are never exposed to the client
- Input validation prevents oversized requests
- No file system access from the web interface
- CORS headers can be added for production use