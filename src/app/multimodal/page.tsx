"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

export default function MultimodalPage() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !files) return;
    await sendMessage(
      { text: input, files: files ?? undefined },
      { body: { temperature: 0.7 } },
    );
    setInput("");
    setFiles(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-10 px-4 gap-4">
      <h1 className="text-2xl font-bold">マルチモーダルチャット</h1>

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
            {message.parts.map((part, i) => {
              if (part.type === "text") {
                return <span key={i}>{part.text}</span>;
              }
              if (part.type === "file" && part.mediaType.startsWith("image/")) {
                return (
                  <img
                    key={i}
                    src={part.url}
                    alt="送信した画像"
                    className="mt-2 max-w-xs rounded"
                  />
                );
              }
              return null;
            })}
          </div>
        ))}
        {isLoading && (
          <div className="p-3 rounded-lg bg-gray-100 self-start text-gray-500">
            AIが考え中...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => setFiles(e.target.files)}
          className="text-sm"
        />
        {files && files[0] && (
          <div className="relative w-fit">
            <img
              src={URL.createObjectURL(files[0])}
              alt="プレビュー"
              className="max-w-xs max-h-32 rounded border"
            />
            <button
              type="button"
              onClick={() => {
                setFiles(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >
              x
            </button>
          </div>
        )}
        <div className="flex gap-2">
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
              }
            }}
            placeholder="画像について質問してみましょう..."
            rows={2}
            className="flex-1 border rounded-lg px-3 py-2 resize-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
}
