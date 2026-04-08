import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, tool, UIMessage } from "ai";
import { z } from "zod";

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
    tools: {
      getCurrentTime: tool({
        description: "現在の日時を取得する",
        inputSchema: z.object({}),
        execute: async () => {
          return new Date().toLocaleString("ja-JP");
        },
      }),
      calculate: tool({
        description: "四則演算を計算する",
        inputSchema: z.object({
          expression: z.string().describe("計算式（例: 1 + 2 * 3）"),
        }),
        execute: async ({ expression }) => {
          const result = Function(`"use strict"; return (${expression})`)();
          return `${expression} = ${result}`;
        },
      }),
      getWeather: tool({
        description: "指定した都市の天気を取得する",
        inputSchema: z.object({
          city: z.string().describe("都市名（例: 東京、大阪）"),
        }),
        execute: async ({ city }) => {
          // 実際はAPIを叩く。今回はモックデータを返す
          const mockWeather: Record<string, string> = {
            東京: "晴れ、気温22℃",
            大阪: "曇り、気温19℃",
            札幌: "雪、気温-2℃",
            福岡: "雨、気温16℃",
          };
          return (
            mockWeather[city] ?? `${city}の天気データは取得できませんでした`
          );
        },
      }),
    },
    onFinish: ({ usage }) => {
      console.log(
        `tokens - input: ${usage.inputTokens}, output: ${usage.outputTokens}`,
      );
    },
  });

  return result.toUIMessageStreamResponse();
}
