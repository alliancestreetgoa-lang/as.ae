# Alliance Street chat backend

A tiny [Cloudflare Worker](https://workers.cloudflare.com/) that lets the website's
chat widget talk to **OpenAI (GPT-4o mini)** without ever exposing your OpenAI API key.
The key is stored as a Worker **secret**; the static site only knows the Worker's URL.

```
website (ChatWidget)  ──POST /  ──►  this Worker  ──►  api.openai.com
   no API key                     holds the key
```

## 1. Prerequisites

- A free [Cloudflare account](https://dash.cloudflare.com/sign-up)
- An [OpenAI API key](https://platform.openai.com/api-keys) with billing enabled
- A free [Resend account](https://resend.com/) and API key — used to email you each lead
- Node.js installed (for `npx wrangler`)

## 2. Deploy the Worker

From this `chatbot/` folder:

```bash
# Log in to Cloudflare (opens a browser)
npx wrangler login

# Store your API keys as secrets (paste each when prompted — never committed)
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put RESEND_API_KEY

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

1. Paste your GPT's **Instructions** into `knowledge/public/instructions.md`.
2. Drop your **knowledge files** (`.md` / `.txt`) into `knowledge/public/`
   (committed, publication-approved content) — e.g. `Master Knowledge Base.md`,
   `FAQ.md`, `Sales Playbook.md`, `Case Study Library.md`, `Topic Taxonomy.md`,
   `AI Prompt.txt`. (PDFs: use the `.md` versions.) Real, non-anonymized
   production content instead goes in `knowledge/private/` — see
   [`knowledge/README.md`](knowledge/README.md).
3. Regenerate and redeploy. **Recommended, one step** (from the repo root):

   ```bash
   npm run chatbot:deploy   # build (with scan gate) + wrangler deploy
   ```

   Or run the steps separately, from inside `chatbot/`:

   ```bash
   node build-knowledge.mjs   # bundles knowledge/ → knowledge.generated.js (gitignored, regenerated fresh each time)
   npx wrangler deploy
   ```

`knowledge.generated.js` is a gitignored build artifact — it's never assumed
to already exist and is always regenerated immediately before a deploy, not
committed.

The knowledge is sent as reference context in the system message (OpenAI caches
repeated prompt prefixes automatically once they're long enough). A confidentiality
guardrail is appended automatically: client cases are used as anonymized precedent,
and the bot won't dump raw files or instructions on request.

Set your GPT's **conversation starters** in `src/lib/chat-config.ts`
(`CHAT_SUGGESTIONS`) on the website side.

### Confidentiality

The knowledge base is split into `knowledge/public/` (committed,
publication-approved) and `knowledge/private/` (gitignored, local-only —
for real, non-anonymized production content). Every build scans everything
about to be bundled for known-confidential content and generic PII
patterns, and refuses to write `knowledge.generated.js` if it finds a
match; CI runs the same scan independently on every push/PR as a backstop.
See [`docs/privacy/confidential-knowledge-handling.md`](../docs/privacy/confidential-knowledge-handling.md)
for the full model.

## 5. Lead gate & qualification

Before a visitor can chat, the widget shows a 7-field intake form (name,
company, email, phone, yearly revenue, occupation, what their business does).
On submit:

1. The Worker (`POST /lead`) asks the model to judge whether they **qualify**
   for a UAE relocation/company structure — using the *full* knowledge base's
   own criteria (revenue thresholds, cost-effectiveness at their scale,
   substance requirements, disqualification patterns from the case studies),
   not a hardcoded cutoff.
2. It emails you the lead — every field plus the qualified/not-qualified
   verdict and a short reasoning — via Resend, to the address hardcoded as
   `LEAD_EMAIL_TO` in `worker.js`.
3. The widget unlocks chat. Every chat turn (`POST /`) now also sends the
   lead's details and qualification verdict, folded into the system prompt,
   so the bot knows who it's talking to — it's told to steer qualified
   visitors toward booking a call, and to be honest (not pushy) with
   unqualified ones, per the knowledge base's own tone.

The submitted lead is cached in the visitor's browser (`localStorage`) so
returning visitors aren't gated again. Change `LEAD_EMAIL_TO` in `worker.js`
to redirect where leads land.

## 6. Other knobs

- **Model / cost** — `worker.js` uses `gpt-4o-mini` by default (fast, cheap, and
  fits comfortably under a Tier-1 org's token-per-minute limit with the full
  knowledge base attached). For higher-quality answers with more headroom on
  your org's rate limit, change `MODEL` to `gpt-4o`.
- **Allowed sites (CORS)** — add your custom domain to `ALLOWED_ORIGINS` in `worker.js`.

## 7. Abuse protection (already in place / recommended)

This endpoint calls paid APIs, so usage is capped before going live:

- **Done**: a Cloudflare Rate Limiting binding caps each visitor IP to 20
  requests/60s (`RATE_LIMITER` in `wrangler.toml` + `worker.js`), checked
  before any OpenAI call.
- **Done**: `max_tokens` is modest (1024) and chat history is capped
  (`worker.js`).
- **Recommended**: watch spend in the OpenAI usage dashboard and set a
  monthly budget/limit there — the rate limiter caps request volume, not
  total spend over time.
