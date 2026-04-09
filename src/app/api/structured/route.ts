import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
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
  const { city }: { city: string } = await req.json();

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `${city}のおすすめ観光スポットを3〜5つ紹介してください。`,
    output: Output.object({ schema: responseSchema }),
  });

  return Response.json(result.output);
}
