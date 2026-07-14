#!/usr/bin/env node

/**
 * Confidential-data scanner for the chatbot knowledge base (and, as
 * defense-in-depth, the public pages that were the subject of Phase 0's
 * anonymization cleanup).
 *
 * Two detection tiers:
 *
 * - block (scripts/confidential-blocklist.json): a curated list of real
 *   client/company identifiers, each stored as a SHA-256 hash of its
 *   normalized text — never as plaintext, so a public repo never carries a
 *   list of real names under a filename that says "confidential". A
 *   block-tier match fails the build and CI. See normalizeText()/hashText()
 *   below for the exact hashing scheme; it must stay in lockstep with
 *   whatever produced scripts/confidential-blocklist.json.
 *
 * - warn (hardcoded in this file): generic, non-identifying heuristics —
 *   common English first names too generic to safely hash-block, an
 *   honorific+name shape, an email shape, a phone-number shape, and a
 *   currency-amount-adjacent capitalized-word-pair shape. These are printed
 *   but do not fail the build by default (pass --strict to make them fail
 *   too). False positives are expected and fine at this tier.
 *
 * Allowlist (scripts/confidential-scan-allowlist.json, optional — an empty
 * `[]` if nothing is suppressed yet) lets a human suppress a specific known
 * finding. Schema, one object per suppression:
 *   {
 *     "file": "relative/or/absolute/path/to/file.md",
 *     "pattern": "regex source tested against the finding's matched text
 *                 (warn-tier) or the blocklist entry id (block-tier)",
 *     "reason": "why this specific finding is a false positive / approved",
 *     "approvedBy": "who signed off on the suppression"
 *   }
 * Suppressions are never silent in the sense that they live in a
 * human-reviewed, git-tracked file — but they are applied without further
 * comment at scan time.
 *
 * Usage:
 *   node scripts/scan-confidential-data.mjs [--paths a,b,c] [--strict]
 *
 * Also exports scanPaths(paths) for reuse from chatbot/build-knowledge.mjs,
 * which calls it as a pre-write gate over the exact set of files about to be
 * bundled into knowledge.generated.js.
 */

import { readFile } from "node:fs/promises";
import { existsSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BLOCKLIST_PATH = join(ROOT, "scripts", "confidential-blocklist.json");
const ALLOWLIST_PATH = join(ROOT, "scripts", "confidential-scan-allowlist.json");

// ---- Warn-tier heuristics -------------------------------------------------

// Common English first names flagged by the original privacy audit as too
// generic to safely hash-block (they collide with ordinary English words /
// are extremely common names) but still worth a human glance in context.
const WARN_FIRST_NAMES = [
  "Tim",
  "Paul",
  "James",
  "Daniel",
  "Michael",
  "Chris",
  "Adam",
  "Lane",
  "Axel",
  "Louise",
  "Anthony",
  "Tony",
];
const WARN_NAME_RE = new RegExp(`\\b(${WARN_FIRST_NAMES.join("|")})\\b`, "g");

const HONORIFIC_RE = /\b(?:Mr|Mrs|Ms|Dr)\.?\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/g;

const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

// UK/international phone-number-shaped sequences (loose on purpose).
const PHONE_RE =
  /(?:\+\d{1,3}[\s.-]?)?(?:\(0\)|\(\d{2,4}\))?[\s.-]?\d{3,5}[\s.-]?\d{3,4}[\s.-]?\d{0,4}\b/g;

const CURRENCY_TOKEN_RE = /[£$]|^AED$/i;
const CAP_WORD_RE = /^[A-Z][a-z]+$/;

/**
 * Strip leading/trailing punctuation (quotes, brackets, sentence
 * punctuation) from a whitespace-split word. Shared by both detection tiers
 * so a blocklisted phrase immediately followed by a comma/period or wrapped
 * in parentheses still normalizes to the same word the hash was computed
 * from — see findBlockMatchesInLine() below.
 */
function stripPunctuation(w) {
  return w.replace(/^[("'“‘]+|[.,;:!?)"'”’]+$/g, "");
}

/**
 * Loose heuristic: two consecutive capitalized words within ~5 words of a
 * currency symbol / AED token on the same line. Expected to over-trigger
 * (e.g. on section headings) — that's acceptable at warn tier.
 */
function findCurrencyNamePairs(line) {
  const rawWords = line.split(/\s+/).filter(Boolean);
  const words = rawWords.map(stripPunctuation);
  const isCurrency = (w) => CURRENCY_TOKEN_RE.test(w) || /^[£$]\d/.test(w);
  const isCapWord = (w) => CAP_WORD_RE.test(w);
  const found = [];
  for (let i = 0; i < words.length; i++) {
    if (!isCurrency(words[i])) continue;
    const lo = Math.max(0, i - 5);
    const hi = Math.min(words.length - 2, i + 5);
    for (let j = lo; j <= hi; j++) {
      if (isCapWord(words[j]) && isCapWord(words[j + 1])) {
        found.push(`${words[j]} ${words[j + 1]}`);
      }
    }
  }
  return found;
}

function findWarnMatchesInLine(line) {
  const matches = [];

  for (const re of [WARN_NAME_RE, HONORIFIC_RE, EMAIL_RE, PHONE_RE]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(line))) {
      matches.push({ ruleId: warnRuleId(re), matchedText: m[0], column: m.index + 1 });
      if (m[0].length === 0) re.lastIndex++; // guard against zero-length loops
    }
  }

  for (const pair of findCurrencyNamePairs(line)) {
    matches.push({ ruleId: "warn:currency-name-pair", matchedText: pair, column: undefined });
  }

  return matches;
}

function warnRuleId(re) {
  if (re === WARN_NAME_RE) return "warn:generic-first-name";
  if (re === HONORIFIC_RE) return "warn:honorific-name";
  if (re === EMAIL_RE) return "warn:email";
  if (re === PHONE_RE) return "warn:phone";
  return "warn:unknown";
}

// ---- Block-tier (hash-based) ----------------------------------------------

/** Must match the normalization used to produce confidential-blocklist.json. */
function normalizeText(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function hashText(text) {
  return createHash("sha256").update(normalizeText(text)).digest("hex");
}

async function loadBlocklistMap() {
  const map = new Map();
  let raw;
  try {
    raw = await readFile(BLOCKLIST_PATH, "utf8");
  } catch (err) {
    console.error(`Error: could not read blocklist at ${BLOCKLIST_PATH}: ${err.message}`);
    process.exit(1);
  }
  let entries;
  try {
    entries = JSON.parse(raw);
  } catch (err) {
    console.error(`Error: could not parse blocklist JSON at ${BLOCKLIST_PATH}: ${err.message}`);
    process.exit(1);
  }
  for (const entry of entries) {
    if (entry.algo !== "sha256" || !entry.hash) continue;
    map.set(entry.hash.toLowerCase(), entry);
  }
  return map;
}

async function loadAllowlist() {
  if (!existsSync(ALLOWLIST_PATH)) return [];
  let raw;
  try {
    raw = await readFile(ALLOWLIST_PATH, "utf8");
  } catch (err) {
    console.error(`Error: could not read allowlist at ${ALLOWLIST_PATH}: ${err.message}`);
    process.exit(1);
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error: could not parse allowlist JSON at ${ALLOWLIST_PATH}: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Every 1-6 consecutive-word window on the line, hashed and checked against
 * the blocklist. Intentionally brute-force: 42 short entries against
 * typical knowledge-file line lengths is fast enough, and a smarter
 * substring-matching algorithm isn't worth the complexity here.
 *
 * NOTE: the window is capped at 6 words (see `len <= 6` below). A blocklist
 * entry whose normalized phrase is longer than 6 words will NEVER match —
 * this is an undocumented-until-now limit, not a bug. If a future entry
 * needs a longer phrase, either raise this cap (cost scales linearly with
 * it) or split the entry into a shorter, still-uniquely-identifying phrase.
 */
function findBlockMatchesInLine(line, blocklistMap) {
  // Strip leading/trailing punctuation from each word before building
  // candidate windows, so a blocklisted phrase immediately followed by a
  // comma/period or wrapped in parentheses still hashes to the same value
  // as the clean phrase the blocklist hash was computed from.
  const words = line
    .split(/\s+/)
    .filter(Boolean)
    .map(stripPunctuation)
    .filter(Boolean);
  const found = [];
  for (let start = 0; start < words.length; start++) {
    for (let len = 1; len <= 6 && start + len <= words.length; len++) {
      const candidate = words.slice(start, start + len).join(" ");
      const hash = hashText(candidate);
      const entry = blocklistMap.get(hash);
      // Only "block" severity entries are enforced as hard blocks here. Any
      // other severity value (e.g. a future "warn") is intentionally
      // skipped by this tier rather than silently treated as a block.
      if (entry && entry.severity === "block") {
        found.push({ ruleId: entry.id, matchedText: candidate });
      }
    }
  }
  return found;
}

// ---- Allowlist filtering ---------------------------------------------------

function isAllowlisted(file, ruleId, matchedText, allowlist) {
  return allowlist.some((entry) => {
    if (!entry.file || !entry.pattern) return false;
    const entryAbs = isAbsolute(entry.file) ? entry.file : resolve(ROOT, entry.file);
    if (resolve(entryAbs) !== resolve(file)) return false;
    let re;
    try {
      re = new RegExp(entry.pattern);
    } catch {
      return false;
    }
    return re.test(matchedText ?? "") || re.test(ruleId ?? "");
  });
}

// ---- Core scan --------------------------------------------------------------

/**
 * @param {string[]} paths absolute file paths to scan.
 * @returns {Promise<{ blocks: object[], warns: object[] }>}
 */
export async function scanPaths(paths) {
  const [blocklistMap, allowlist] = await Promise.all([loadBlocklistMap(), loadAllowlist()]);

  const blocks = [];
  const warns = [];

  for (const file of paths) {
    let text;
    try {
      text = await readFile(file, "utf8");
    } catch (err) {
      console.error(`Warning: could not read ${file} for scanning: ${err.message}`);
      continue;
    }

    const lines = text.split(/\r\n|\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      const lineNo = i + 1;

      for (const m of findBlockMatchesInLine(line, blocklistMap)) {
        if (isAllowlisted(file, m.ruleId, m.matchedText, allowlist)) continue;
        blocks.push({ file, line: lineNo, ruleId: m.ruleId });
      }

      for (const m of findWarnMatchesInLine(line)) {
        if (isAllowlisted(file, m.ruleId, m.matchedText, allowlist)) continue;
        warns.push({
          file,
          line: lineNo,
          column: m.column,
          matchedText: m.matchedText,
          ruleId: m.ruleId,
        });
      }
    }
  }

  return { blocks, warns };
}

// ---- File collection (CLI only) --------------------------------------------

function walkDir(dir, extRe = /\.(md|markdown|txt)$/i) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkDir(full, extRe));
    } else if (extRe.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function hasRealPrivateContent(dir) {
  if (!existsSync(dir)) return false;
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return false;
  }
  return entries.some((name) => !["README.md", ".gitkeep"].includes(name));
}

function defaultPaths() {
  const paths = [];

  paths.push(...walkDir(join(ROOT, "chatbot", "knowledge", "public")));

  const privateDir = join(ROOT, "chatbot", "knowledge", "private");
  if (hasRealPrivateContent(privateDir)) {
    paths.push(...walkDir(privateDir));
  }

  const generated = join(ROOT, "chatbot", "knowledge.generated.js");
  if (existsSync(generated)) paths.push(generated);

  for (const rel of [
    "src/app/case-studies/page.tsx",
    "src/app/faq/page.tsx",
    "src/lib/content.ts",
  ]) {
    const full = join(ROOT, rel);
    if (existsSync(full)) paths.push(full);
  }

  return paths;
}

// ---- CLI --------------------------------------------------------------------

async function runCli() {
  const args = process.argv.slice(2);
  const strict = args.includes("--strict");
  const pathsFlagIndex = args.indexOf("--paths");

  let paths;
  if (pathsFlagIndex !== -1 && args[pathsFlagIndex + 1]) {
    paths = args[pathsFlagIndex + 1]
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => (isAbsolute(p) ? p : resolve(ROOT, p)))
      .flatMap((p) => {
        try {
          if (statSync(p).isDirectory()) return walkDir(p);
        } catch {
          return [];
        }
        return [p];
      });
  } else {
    paths = defaultPaths();
  }

  const { blocks, warns } = await scanPaths(paths);

  const rel = (f) => relative(ROOT, f);

  console.log(`Scanned ${paths.length} file(s).`);
  console.log(`  blocks: ${blocks.length}`);
  console.log(`  warns:  ${warns.length}`);

  if (blocks.length) {
    console.log("\nBLOCK-tier findings (must fix before this content can ship):");
    for (const b of blocks) {
      console.log(`  ${rel(b.file)}:${b.line}  [${b.ruleId}]`);
    }
  }

  if (warns.length) {
    console.log("\nWARN-tier findings (review; not blocking unless --strict):");
    for (const w of warns) {
      console.log(`  ${rel(w.file)}:${w.line}  [${w.ruleId}]  "${w.matchedText}"`);
    }
  }

  if (blocks.length > 0 || (strict && warns.length > 0)) {
    process.exit(1);
  }
  process.exit(0);
}

const isMain = resolve(process.argv[1] ?? "") === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  runCli().catch((err) => {
    console.error("Error: scan failed:", err);
    process.exit(1);
  });
}
