# Knowledge base

The chatbot's brain lives here, split into two directories with very
different git treatment. Read this before adding or editing anything.

```
chatbot/knowledge/
  README.md       (this file — committed)
  public/         committed, publication-approved content
  private/        gitignored — real, non-anonymized production content
```

## `public/` — committed

Everything in `public/` is checked into git and has been reviewed as safe to
publish: no real client names, company names, or other identifying details.
The six files currently here (`instructions.md`, `Master Knowledge Base.md`,
`FAQ.md`, `Sales Playbook.md`, `Case Study Library.md`, `Topic Taxonomy.md`)
are the anonymized, publication-approved knowledge base. Case studies in
here use generic descriptors and case numbers, never real names — the
bot's own guardrail (appended by the build) reinforces this at answer time.

Treat `public/` as the default place for new content: if it's safe to
publish, it goes here.

## `private/` — gitignored, local only

`private/` is where any future real, non-anonymized production knowledge
should go. It's a real directory wired directly into the build, but almost
everything in it is gitignored — only `private/README.md` and
`private/.gitkeep` are committed (so the directory exists in a fresh
clone). Anything else you drop in `private/` stays local to your machine
and is never picked up by `git add`/`git commit`.

**Never commit real, non-anonymized content into `public/`.** If you have
real client details, put them in `private/` instead.

## `instructions.md`

Lives in `public/`. Paste your GPT's **Instructions** box here — it becomes
the assistant's system prompt (a confidentiality guardrail is appended
automatically). If this file is missing, a generic default is used.

## Build fail-safes

Running `node build-knowledge.mjs` (from `chatbot/`) does two safety checks
before it writes `knowledge.generated.js`:

1. **Legacy-location guard** — if any `.md`, `.markdown`, or `.txt` file
   (other than `README.md`) is found directly at the old flat
   `chatbot/knowledge/` root — i.e. not inside `public/` or `private/` —
   the build aborts with an error instead of silently ignoring it. This
   catches someone dropping a file at the old habitual path out of habit.
2. **Confidential-data scan** — every file about to be bundled (from
   `public/`, plus anything real in `private/`) is run through
   `scripts/scan-confidential-data.mjs` before the write. Any block-tier
   match (a known confidential name/company, matched by hash — see that
   script for details) aborts the build with a non-zero exit and
   file:line output. `knowledge.generated.js` is never written on a hit.

`knowledge.generated.js` itself is gitignored — it's a build artifact,
regenerated fresh before every deploy, never assumed to already exist.

## Adding content

**Public (safe-to-publish) content:**

```bash
# drop a .md file into public/, then from chatbot/:
node build-knowledge.mjs
```

**Private (real production) content, for a real deployment, kept local:**

```bash
# drop a .md file into private/ — same command, it merges in automatically:
node build-knowledge.mjs
```

**Run just the scanner, without a build**, e.g. to check before drafting a
new file:

```bash
# from chatbot/:
node ../scripts/scan-confidential-data.mjs

# or from the repo root:
npm run chatbot:scan
```

## PDFs

You don't need the PDFs — the `.md` versions you already have cover the
same content. If you only have a PDF, export/convert it to Markdown or
plain text and drop it in `public/` or `private/` as appropriate.

## After adding files

```bash
cd chatbot
node build-knowledge.mjs   # regenerates knowledge.generated.js
npx wrangler deploy        # pushes the updated bot live
```

Or, from the repo root, `npm run chatbot:deploy` does the build (with its
scan gate) and deploy in one step. See [`../README.md`](../README.md) for
details.

## More on confidentiality

For the full defense-in-depth model (why `private/` exists, what it does
and doesn't guarantee, how the build-time scan and CI scan fit together),
see [`../../docs/privacy/confidential-knowledge-handling.md`](../../docs/privacy/confidential-knowledge-handling.md).
