import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, Output, streamText, UIMessage } from "ai";
import { z } from "zod";

const spotSchema = z.object({
  name: z.string().describe("観光スポット名"),
  category: z.enum(["寺社", "公園", "博物館", "展望台", "グルメ", "その他"]),
  description: z.string().describe("100文字以内の説明"),
  recommendedFor: z.string().describe("こんな人におすすめ"),
});

const responseSchema = z.object({
  city: z.string(),
  spots: z.array(spotSchema).min(3).max(5),
  bestSeason: z.string().describe("おすすめの季節"),
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: await convertToModelMessages(messages),
    output: Output.object({ schema: responseSchema }),
  });

  return result.toUIMessageStreamResponse();
}
