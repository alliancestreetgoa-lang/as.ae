# private/

This directory is for real, non-anonymized production knowledge — content that
should **never** be committed to git.

Everything in this directory except this `README.md` and `.gitkeep` is
gitignored (see the repo-root `.gitignore`).

If a real production deployment needs additional knowledge beyond what's in
`../public/`, drop `.md`, `.markdown`, or `.txt` files here locally. The
build script picks them up and merges them into the generated knowledge
bundle automatically — no code changes required.
