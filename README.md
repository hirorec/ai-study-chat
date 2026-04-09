# AI Study Chat

Vercel AI SDK の基礎を学ぶためのハンズオンプロジェクト。  
`useChat` / `streamText` を使ったストリーミングチャットを中心に、AI SDK の主要機能を一通り実装しています。

## デモ

https://ai-study-chat.vercel.app/

## 機能一覧

| ページ | パス | 概要 |
|--------|------|------|
| AI チャット | `/` | ストリーミングチャット、Tool Calling（時刻取得・計算・天気）、Temperature調整 |
| 構造化出力 | `/structured` | `generateText` + `Output.object()` でJSONレスポンスを取得 |
| ストリーミング構造化出力 | `/structured-stream` | `streamText` + `Output.object()` でパーシャルJSONをリアルタイム表示 |
| マルチモーダル | `/multimodal` | 画像 + テキストをAIに送信して回答を得る |

## 学習トピック

- ストリーミングチャット (`useChat`, `streamText`, `convertToModelMessages`)
- UI/UX（ローディング表示、自動スクロール、Enter送信、停止ボタン）
- システムプロンプト、Temperature制御
- Tool Calling（ツール定義・実行・結果表示）
- 構造化出力（Zodスキーマ、`Output.object()`）
- ストリーミング構造化出力（`parsePartialJson` によるパーシャル表示）
- マルチモーダル入力（画像プレビュー、`sendMessage` の `files` オプション）
- エラーハンドリング、トークン使用量の確認

## 技術スタック

- **Next.js** 16 (App Router)
- **Vercel AI SDK** v6 (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`)
- **Tailwind CSS** v4
- **TypeScript**
- **Zod** v4

## セットアップ

```bash
npm install
```

`.env.local` を作成し、OpenAI API キーを設定:

```
OPENAI_API_KEY=sk-...
```

開発サーバーを起動:

```bash
npm run dev
```

http://localhost:3000 でアクセスできます。

## デプロイ

GitHub リポジトリと Vercel を連携し、環境変数 `OPENAI_API_KEY` を設定してデプロイ。
