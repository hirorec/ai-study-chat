"use client";

import { useState } from "react";

type Spot = {
  name: string;
  category: string;
  description: string;
  recommendedFor: string;
};

type SpotResponse = {
  city: string;
  spots: Spot[];
  bestSeason: string;
};

export default function StructuredPage() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState<SpotResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/structured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });

      if (!res.ok) throw new Error("APIリクエストに失敗しました");

      const data: SpotResponse = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">
        観光スポット検索（構造化出力）
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
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "検索中..." : "検索"}
        </button>
      </form>

      {error && (
        <div className="p-3 bg-red-100 text-red-600 rounded-lg mb-4">
          {error}
        </div>
      )}

      {result && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {result.city} のおすすめスポット
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            ベストシーズン: {result.bestSeason}
          </p>

          <div className="flex flex-col gap-4">
            {result.spots.map((spot, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{spot.name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    {spot.category}
                  </span>
                </div>
                <p className="text-gray-700 mb-1">{spot.description}</p>
                <p className="text-sm text-gray-500">
                  おすすめ: {spot.recommendedFor}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
