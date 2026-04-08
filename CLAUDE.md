# CLAUDE.md

## プロジェクト全体の目的
[キャリア資産戦略メモ](https://docs.google.com/document/d/1W84iqUG9Tl7PgdzKJugH5me_Umo7VFfE/edit) に基づいて
3-3. 月別学習ロードマップの学習を目的とする。


## 注意事項
- Vercel AI SDK は破壊的変更が多い。コードを提案する前に必ず `node_modules/@ai-sdk/react/dist/index.d.ts` および `node_modules/ai/dist/index.d.ts` の型定義を確認し、最新の API を使用すること。
- ドキュメントや学習資料のサンプルコードは古いバージョン (v5以前) のままの場合があるため、鵜呑みにしない。

## 本プロジェクトの目的
Vercel AI SDK基礎を学ぶ。
公式ドキュメントを読みながらuseChat / streamTextを使ったシンプルなストリーミングチャットを1本完成させる。OpenAI APIキー取得・Vercelデプロイまで完了させること。

ハンズオンで学習できるように会話形式でプロジェクト作成から実装までを行う。

ステップバイステップで学習できるように、AIが全てのタスクを自動で行わない
「xxxというファイルを作成してください」
「xxxというメソッドを追加して以下のコードを反映してください」
等、会話形式で機能ごとにAIが指示してくれるようにしたい。
