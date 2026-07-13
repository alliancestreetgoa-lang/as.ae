# Knowledge base

Put your custom-GPT content here, then run `node ../build-knowledge.mjs` (from
`chatbot/`) and redeploy the Worker (`npx wrangler deploy`).

## Files

- **`instructions.md`** — paste your GPT's **Instructions** box here. This becomes
  the assistant's system prompt (a confidentiality guardrail is appended
  automatically). If this file is missing, a generic default is used.

- **Everything else** (`*.md`, `*.markdown`, `*.txt`) — your **knowledge files**,
  e.g.:
  - `Master Knowledge Base.md`
  - `FAQ.md`
  - `Sales Playbook.md`
  - `Case Study Library.md`
  - `Topic Taxonomy.md`
  - `AI Prompt.txt`

  These are concatenated (each prefixed with its filename) and sent to Claude as
  cached context on every request, so the bot answers from them.

## PDFs

You don't need the PDFs — the `.md` versions you already have cover the same
content. If you only have a PDF, export/convert it to Markdown or plain text and
drop it in here.

## After adding files

```bash
cd chatbot
node build-knowledge.mjs   # regenerates knowledge.generated.js
npx wrangler deploy        # pushes the updated bot live
```
