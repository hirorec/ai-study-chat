"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { messages, sendMessage, status, setMessages, error, stop } = useChat();
  const [input, setInput] = useState("");
  const [temperature, setTemperature] = useState(0.7);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input }, { body: { temperature } });
    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-10 px-4 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI チャット</h1>
        <button
          onClick={() => setMessages([])}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          会話をリセット
        </button>
      </div>

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
        {(status === "streaming" || status === "submitted") && (
          <div className="p-3 rounded-lg bg-gray-100 self-start text-gray-500">
            AIが考え中...
          </div>
        )}
        {error && (
          <div className="p-3 rounded-lg bg-red-100 text-red-600 self-start whitespace-pre-line">
            エラーが発生しました: {error.message}
          </div>
        )}
        <div ref={messagesEndRef} suppressHydrationWarning={true} />
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-600">
        <label>Temperature: {temperature}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          className="flex-1"
        />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
              setInput("");
            }
          }}
          placeholder="メッセージを入力... (Enter で送信 / Shift+Enter で改行)"
          rows={2}
          className="flex-1 border rounded-lg px-3 py-2 resize-none"
        />
        <button
          type="button"
          onClick={status === "streaming" ? stop : handleSubmit}
          className={`px-4 py-2 rounded-lg text-white ${
            status === "streaming"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          } disabled:opacity-50`}
        >
          {status === "streaming" ? "停止" : "送信"}
        </button>
      </form>
    </div>
  );
}
