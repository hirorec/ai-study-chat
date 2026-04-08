import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export async function POST(req: Request) {
  const {
    messages,
    temperature,
  }: { messages: UIMessage[]; temperature: number } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system:
      "あなたは親切な日本語アシスタントです。簡潔でわかりやすい回答を心がけてください。",
    messages: await convertToModelMessages(messages),
    temperature,
    onFinish: ({ usage }) => {
      console.log(
        `tokens - input: ${usage.inputTokens}, output: ${usage.outputTokens}`,
      );
    },
  });

  return result.toUIMessageStreamResponse();
}
