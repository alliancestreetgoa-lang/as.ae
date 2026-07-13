# Alliance Street chat backend

A tiny [Cloudflare Worker](https://workers.cloudflare.com/) that lets the website's
chat widget talk to **Claude (Opus 4.8)** without ever exposing your Anthropic API key.
The key is stored as a Worker **secret**; the static site only knows the Worker's URL.

```
website (ChatWidget)  ──POST /  ──►  this Worker  ──►  api.anthropic.com
   no API key                     holds the key
```

## 1. Prerequisites

- A free [Cloudflare account](https://dash.cloudflare.com/sign-up)
- An [Anthropic API key](https://console.anthropic.com/) with billing enabled
- Node.js installed (for `npx wrangler`)

## 2. Deploy the Worker

From this `chatbot/` folder:

```bash
# Log in to Cloudflare (opens a browser)
npx wrangler login

# Store your Anthropic key as a secret (paste it when prompted — it is never committed)
npx wrangler secret put ANTHROPIC_API_KEY

# Deploy
npx wrangler deploy
```

Wrangler prints your Worker URL, e.g.:

```
https://alliance-chat.<your-subdomain>.workers.dev
```

## 3. Point the website at it

Set the endpoint at build time (recommended) or hardcode it.

**Option A — build-time env var** (in the site's `.env` / CI):

```
NEXT_PUBLIC_CHAT_ENDPOINT=https://alliance-chat.<your-subdomain>.workers.dev
```

**Option B — hardcode** in `src/lib/chat-config.ts`:

```ts
export const CHAT_ENDPOINT = "https://alliance-chat.<your-subdomain>.workers.dev";
```

Rebuild and redeploy the site (merge to `master` triggers the Pages deploy).
The chat button appears bottom-right on every page. Until the endpoint is set,
the widget still opens but replies with a "not connected yet" note.

## 4. Give it your GPT's brain (persona + knowledge)

To make the website bot behave like your custom GPT, put its content in
[`knowledge/`](knowledge/) and rebuild:

1. Paste your GPT's **Instructions** into `knowledge/instructions.md`.
2. Drop your **knowledge files** (`.md` / `.txt`) into `knowledge/` — e.g.
   `Master Knowledge Base.md`, `FAQ.md`, `Sales Playbook.md`, `Case Study Library.md`,
   `Topic Taxonomy.md`, `AI Prompt.txt`. (PDFs: use the `.md` versions.)
3. Regenerate and redeploy:

```bash
cd chatbot
node build-knowledge.mjs   # bundles knowledge/ → knowledge.generated.js
npx wrangler deploy
```

The knowledge is sent to Claude as **cached context** (read at ~10% cost after
the first call). A confidentiality guardrail is appended automatically:
client cases are used as anonymized precedent, and the bot won't dump raw files
or instructions on request.

Set your GPT's **conversation starters** in `src/lib/chat-config.ts`
(`CHAT_SUGGESTIONS`) on the website side.

## 5. Other knobs

- **Model / cost** — `worker.js` uses `claude-opus-4-8`. For a faster, cheaper bot,
  change `MODEL` to `claude-haiku-4-5` (recommended for a knowledge/FAQ bot).
- **Allowed sites (CORS)** — add your custom domain to `ALLOWED_ORIGINS` in `worker.js`.

## 6. Protect against abuse (recommended)

This endpoint calls a paid API, so cap usage before going live:

- Add a **Cloudflare Rate Limiting** rule on the Worker route (e.g. 20 req/min per IP),
  or gate with **Cloudflare Turnstile**.
- Keep `max_tokens` modest (currently 1024) and the history capped (already done in `worker.js`).
- Watch spend in the Anthropic Console; set a monthly budget/limit there.
