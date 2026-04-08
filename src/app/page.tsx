"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Home() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-10 px-4 gap-4">
      <h1 className="text-2xl font-bold">AI チャット</h1>

      <div className="flex flex-col gap-3 min-h-64">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.role === "user"
                ? "bg-blue-100 self-end"
                : "bg-gray-100 self-start"
            }`}
          >
            <span className="font-semibold">
              {message.role === "user" ? "You" : "AI"}:
            </span>{" "}
            {message.parts.map((part, i) =>
              part.type === "text" ? <span key={i}>{part.text}</span> : null,
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          disabled={status === "streaming"}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {status === "streaming" ? "..." : "送信"}
        </button>
      </form>
    </div>
  );
}
