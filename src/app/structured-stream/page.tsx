"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, parsePartialJson } from "ai";
import { useEffect, useState } from "react";

type Spot = {
  name?: string;
  category?: string;
  description?: string;
  recommendedFor?: string;
};

type PartialSpotResponse = {
  city?: string;
  spots?: Spot[];
  bestSeason?: string;
};

export default function StructuredStreamPage() {
  const [city, setCity] = useState("");
  const [searchedCity, setSearchedCity] = useState("");
  const [partialData, setPartialData] = useState<PartialSpotResponse | null>(
    null,
  );

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/structured-stream",
    }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    setSearchedCity(city);
    await sendMessage({
      text: `${city}のおすすめ観光スポットを教えてください`,
    });
    setCity("");
  };

  // 最後のアシスタントメッセージからパーシャルデータを取得
  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");

  useEffect(() => {
    if (!lastAssistant) return;

    for (const part of lastAssistant.parts) {
      if (part.type === "text" && part.text) {
        parsePartialJson(part.text).then(({ value, state }) => {
          if (state === "successful-parse" || state === "repaired-parse") {
            setPartialData(value as PartialSpotResponse);
          }
        });
      }
    }
  }, [lastAssistant]);

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">
        観光スポット検索（ストリーミング構造化出力）
      </h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="都市名を入力（例: 東京、京都）"
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "検索中..." : "検索"}
        </button>
      </form>

      {partialData && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {searchedCity} のおすすめスポット
            {isLoading && (
              <span className="text-sm text-gray-400 ml-2 animate-pulse">
                生成中...
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            ベストシーズン: {partialData.bestSeason ?? "..."}
          </p>

          <div className="flex flex-col gap-4">
            {partialData.spots?.map((spot, i) => (
              <div
                key={i}
                className={`border rounded-lg p-4 transition-opacity ${
                  spot.name ? "opacity-100" : "opacity-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{spot.name ?? "..."}</h3>
                  {spot.category && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {spot.category}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-1">
                  {spot.description ?? "..."}
                </p>
                <p className="text-sm text-gray-500">
                  おすすめ: {spot.recommendedFor ?? "..."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
