# ⚠️ DO NOT RUN — Git history cleanup runbook ⚠️

## 🛑 STOP — READ THIS BEFORE ANYTHING ELSE 🛑

**THIS DOCUMENT IS A MANUAL RUNBOOK, NOT A SCRIPT. NOTHING IN THIS
REPOSITORY AUTOMATES, TRIGGERS, OR SCHEDULES ANY PART OF THE PROCEDURE
DESCRIBED BELOW. IT MUST NOT BE RUN — BY A PERSON, BY AN AI SYSTEM, BY A
CI JOB, OR BY ANY OTHER AUTOMATION — WITHOUT THE REPOSITORY OWNER'S
EXPLICIT, SEPARATE, WRITTEN APPROVAL, GIVEN AT THE TIME THE WORK IS ABOUT
TO HAPPEN. A CODE REVIEWER'S APPROVAL, A PULL REQUEST MERGE, OR AN AI
AGENT'S OWN JUDGMENT DOES NOT COUNT AS THIS APPROVAL.**

---

## Purpose

This document exists so that, if and when the repository owner decides to
purge real, unredacted client personal and financial detail from this
repo's git history, there is a single accurate reference for what that
involves, who it affects, and what has to be true before it starts. It
does not perform that purge itself.

## Scope: what needs to be removed, and where it is

Before the anonymization work landed, this repository's history contains
commits that introduced real, unredacted client knowledge-base content —
real names and financial details tied to identifiable individuals. The
specific commits that first introduced that content are (short SHAs, safe
to reference — they are not themselves personal data):

- `c106469`
- `3ec96bf`
- `e1386c7`

These commits, and any commit reachable from them that touches the old
`chatbot/knowledge/` files or `chatbot/knowledge.generated.js` as they
existed at that point in history, contain real client names and financial
details in their historical blob content — meaning the content is present
in the git object database even though no branch's current working tree
shows it. Subsequent commits replaced this content with anonymized
versions, and the current working tree and every commit made after the
anonymization work is clean, but merging or rewriting forward from a clean
state does not remove anything from history — the original blobs remain
reachable from the old commits for as long as those commits exist in the
repository (including in any clone, fork, or reflog).

## What "cleanup" actually means

Removing content from git history is not a matter of deleting or amending
a commit — every commit after the offending ones would also need to
change, because each commit's identity (its SHA) is derived from its
content and its parent's SHA. This is fundamentally a **history rewrite**:
producing a new, alternate history in which the offending content never
appears in any reachable commit, and then replacing the current history
with that rewritten one everywhere it's stored.

## Recommended tooling

**Primary: `git filter-repo`.** This is the tool the Git project itself
now recommends for history rewrites (superseding the older, officially
deprecated `git filter-branch`). At a high level, it works by walking
every commit in the repository, rewriting the specified paths and/or
content patterns out of every historical blob and tree, and producing a
new set of commits with new SHAs — effectively a parallel history with the
sensitive content structurally absent, not just removed from the tip.

**Alternative: BFG Repo-Cleaner.** A purpose-built, narrower tool aimed
specifically at stripping unwanted files or text strings from history
quickly, generally simpler to reach for than `filter-repo` when the need
is "delete these specific files/strings everywhere they ever appeared"
rather than a more general history transformation. Same fundamental effect
as `filter-repo` — a rewritten history with new commit SHAs.

Both tools require a fresh, complete clone to operate on (conventionally a
"mirror" clone, which includes all refs, not just the default branch), and
both produce a rewritten history that must then be pushed to the remote
in place of the old one — which requires a force-push, since the rewritten
history is not a fast-forward of the original. The general shape of the
work — clone, run the chosen tool against it with the specific paths and
content patterns to purge, inspect the result, and only then force-push it
to replace the remote's history — is described here in prose deliberately;
the actual tool invocations, flags, and target patterns should be worked
out and reviewed at the time this is actually approved and performed, not
lifted from this document as a ready-to-run script.

## Collaborator and remote impact — read this before agreeing to proceed

A history rewrite is a breaking, repository-wide event, not a targeted
patch. Specifically:

- **Every existing local clone becomes stale and diverged.** Anyone who
  has ever cloned this repository has a copy of the old history. After a
  rewrite, their local `main`/`master` (and any other branch) no longer
  shares a common ancestor with the rewritten remote history in the normal
  sense — a plain `git pull` will not reconcile the two. Each such clone
  needs to be discarded and re-cloned fresh, not merged or rebased forward.
- **Any open pull request or branch not yet merged breaks.** Its base
  history no longer exists on the remote in the same form; it would need
  to be recreated against the new history, or the branch would need to be
  reset onto the rewritten history and force-pushed itself.
- **Anyone with a fork needs to re-fork or hard-reset their fork.** A fork
  is itself a full clone; it carries the same staleness problem as any
  other local clone, and GitHub does not automatically propagate a
  history rewrite from the upstream repository into forks.
- **GitHub's own cached references to old commit SHAs can persist.**
  Pull request pages, issue comments, and commit-link references that
  mention a pre-rewrite commit SHA may continue to resolve to (or, in some
  cases, 404 on) the pre-rewrite commit even after the rewrite, because
  GitHub retains some historical objects and UI references independently
  of what the current default branch points to. A history rewrite should
  not be assumed to scrub every trace of the old SHAs from GitHub's UI.

## Required prerequisites before running anything

None of the following steps are optional, and none should be skipped
because the process feels well understood or low-risk:

1. **A full repository backup**, taken first, before any rewrite tooling
   touches the repository — including all branches, tags, and ideally the
   reflog, so the pre-rewrite state can be recovered if something goes
   wrong mid-procedure.
2. **A complete inventory of every person and system with a local clone or
   fork** of this repository, so each of them can be explicitly told the
   rewrite is happening and instructed to re-clone rather than pull.
3. **A coordinated maintenance window**, communicated in advance, during
   which no one is expected to push to or rely on the repository's current
   history — a history rewrite performed while others are actively pushing
   compounds the divergence problem significantly.
4. **Explicit sign-off from the actual repository owner** — not a code
   reviewer, not this agent, not any AI system, and not implied by the
   existence of this document. The owner must separately and explicitly
   approve the specific rewrite at the time it is about to be performed.

## Why this isn't just done automatically

Given how disruptive and irreversible-in-practice a history rewrite is —
every collaborator's clone breaks, open work in flight can be lost if
mishandled, and even a technically successful rewrite doesn't fully scrub
GitHub's own UI — this is treated as a deliberate, rare, human-approved
event, never a routine or automated one. That is the entire reason this
document exists as prose and reference material rather than as a script:
so a human makes an informed, specific decision each time, instead of a
tool or an agent deciding for them.

---

## 🛑 REMINDER: DO NOT RUN THIS PROCEDURE WITHOUT EXPLICIT, SEPARATE, WRITTEN APPROVAL FROM THE REPOSITORY OWNER 🛑

**Nothing in this repository automates or triggers any part of this
procedure. This document is reference material for a manual, human-led
decision — not an instruction to execute.**
