# Confidential knowledge handling

How this repository keeps real, non-anonymized client and business detail
out of git and out of the chatbot's public bundle, and what that protection
does and doesn't actually cover.

## Where private production knowledge lives today

If a real deployment needs knowledge content that hasn't been anonymized
for publication, it goes in `chatbot/knowledge/private/`. This is a real,
gitignored local directory — not just a documentation convention — and
it's wired directly into `chatbot/build-knowledge.mjs`: any `.md`,
`.markdown`, or `.txt` file dropped there is picked up and merged into the
generated knowledge bundle automatically, with no code changes required.

Only `chatbot/knowledge/private/README.md` and
`chatbot/knowledge/private/.gitkeep` are committed, so the directory exists
in a fresh clone. Everything else under `private/` is excluded by the
repo-root `.gitignore`.

Publication-approved content — reviewed as safe to publish, with no real
client names, company names, or other identifying details — lives in
`chatbot/knowledge/public/` and is committed normally.

## What this actually guarantees — and what it doesn't

**Protects against:**

- **Accidental git commits.** Because `private/` is gitignored, running
  `git add`/`git commit` (including broad commands like `git add -A`) will
  not pick up real content dropped there, even by mistake. This is the
  primary failure mode this setup is designed to prevent: someone working
  locally with real client detail, forgetting it's sensitive, and shipping
  it into history the way earlier commits in this repo's history did.
- **Known-confidential content landing in `public/` by mistake.** The
  build-time and CI scanners hash-match a curated blocklist of specific,
  previously-identified confidential terms. If someone copies real content
  into `public/` instead of `private/` — deliberately or by habit — a
  block-tier match aborts the build and fails CI before it can ship.

**Does NOT protect against:**

- **Device loss or theft.** Files in `private/` are ordinary local files on
  disk. If the machine (or a backup of it) is lost, stolen, or otherwise
  compromised, this setup provides no protection — it is not encryption
  and not access control.
- **Someone deliberately bypassing the gitignore.** `.gitignore` is a
  convention enforced by git's own tooling, not a hard security boundary.
  `git add -f` (force-add) or directly editing `.git` state can still
  commit an ignored file. Nothing here prevents a determined or careless
  actor from doing that.
- **Exfiltration by other means.** Copying files off the machine outside
  of git (email, cloud sync, screenshots, USB, etc.) is entirely outside
  this system's scope.
- **Content the scanner doesn't know about.** The block tier only catches
  terms already on the curated blocklist. The warn tier (generic
  PII-shape heuristics — honorific+name, email, phone, currency-adjacent
  capitalized word pairs, a short list of common first names) is
  informational only by default and does not fail the build or CI unless
  run with `--strict`.

In short: this is a defense against **accidental disclosure** — the class
of mistake that produced the real PII currently sitting in this repo's
pre-anonymization git history (see the companion document,
[`git-history-cleanup-DO-NOT-RUN-WITHOUT-APPROVAL.md`](./git-history-cleanup-DO-NOT-RUN-WITHOUT-APPROVAL.md)).
It is not a full security boundary and should not be treated as one.

## Defense-in-depth model, end to end

Three independent layers, each catching what the layer before it might
miss:

1. **Structural (directory isolation).** `chatbot/build-knowledge.mjs`
   only reads knowledge content from `chatbot/knowledge/public/` and
   `chatbot/knowledge/private/`. It refuses to run at all — aborting with
   an error before touching either directory — if it finds a stray
   `.md`/`.markdown`/`.txt` file at the old flat `chatbot/knowledge/`
   root, which would otherwise silently bypass the public/private split
   entirely.

2. **Content-level (the scanner).** `scripts/scan-confidential-data.mjs`
   runs over every file about to be bundled, in two tiers:
   - **block** — a curated list of specific, known-confidential
     names/companies, each stored in `scripts/confidential-blocklist.json`
     as a SHA-256 hash rather than plaintext (so the blocklist file itself
     never carries a plaintext list of real names). A match here hard-fails
     the build (`knowledge.generated.js` is not written) and hard-fails CI.
   - **warn** — generic PII-shape heuristics (not tied to any specific
     known name) that print for human review but don't block by default,
     since they're expected to produce false positives on legitimate
     content.

   This same scanner is called from inside `build-knowledge.mjs` as a
   pre-write gate, so it runs on every local build, not only in CI.

3. **CI (independent backstop).** A dedicated `confidential-scan` job in
   `.github/workflows/ci.yml` re-runs the identical scanner on every push
   and pull request, independently of whether anyone remembered to build
   locally. This catches the case where content changes without a local
   `node build-knowledge.mjs` ever having been run — the CI job scans the
   files directly, not just the generated bundle.

Each layer is independently sufficient to catch a specific class of
mistake; together they mean a single missed step (forgetting to run the
build gate locally, or misplacing a file at the wrong path) doesn't result
in confidential content shipping.

## Considering later: a non-local-file approach

The current `private/` directory is a local-file design: it works well for
a single maintainer building and deploying from one machine, but it isn't
built for a scenario with a large private knowledge set, multiple people
deploying, or a genuinely separate second production environment.

If that need arises, a hardened alternative worth considering is moving
private knowledge out of the local filesystem entirely — for example, a
secrets-manager-backed store, or a Cloudflare KV/R2-backed fetch-at-deploy-
time approach, so the private content never touches a contributor's local
disk as a plain file at all. This is flagged here as an option to consider
later, not a requirement or a commitment to build it now — the current
`private/` directory is sufficient for the present single-deployment setup.
