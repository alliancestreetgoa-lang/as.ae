#!/usr/bin/env node

/**
 * On-page SEO hygiene checker.
 *
 * Reads an already-built `out/` static export (does NOT run the build
 * itself) and fails loudly if any rendered page violates one of these
 * general SEO rules:
 *
 *   A. Title uniqueness — no two pages may share a byte-identical
 *      <title> value.
 *   B. H1 count — every page must have exactly one <h1> tag (zero or
 *      more than one is a failure).
 *   C. Image alt-text presence — every <img> tag must have an `alt`
 *      attribute present (an empty `alt=""` is valid for decorative
 *      images; only a fully missing `alt` attribute is a failure).
 *   D. JSON-LD shape validity — every <script type="application/ld+json">
 *      block must parse as JSON, and every object within it (or every
 *      element, if the block is an array) must have a "@type" key.
 *
 * This is separate from scripts/verify-build.mjs, which only checks
 * staging/production domain-config concerns (indexability, canonical/
 * sitemap/JSON-LD origin agreement). This script checks general on-page
 * SEO hygiene instead, and applies identically regardless of which
 * domain the build targets.
 *
 * Checks every `index.html` under out/ except `out/404/index.html`, which
 * Next's static export auto-generates as a byte-identical duplicate of
 * `out/_not-found/index.html` (a static-hosting fallback, not a real
 * route) — see NON_PAGE_INDEX_FILES below.
 *
 * Usage:
 *   node scripts/verify-seo.mjs
 *
 * Requires a prior `next build` (see the verify:seo npm script, or run
 * `npm run build` yourself first) — like verify-build.mjs, this script
 * does not build anything itself.
 *
 * Collects every failure across all checks before exiting, rather than
 * stopping at the first one, so a single run tells you everything that's
 * wrong.
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "out");

// --- generic fs helpers ---------------------------------------------------

function walkFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full));
    } else if (entry.isFile()) {
      results.push(full);
    }
  }
  return results;
}

function readText(file) {
  return readFileSync(file, "utf8");
}

/**
 * `out/404/index.html` is not a real route — it does not appear in Next's
 * "Route (app)" build listing. With `output: "export"`, Next.js
 * automatically duplicates the `_not-found` page's rendered HTML there as a
 * static-hosting fallback (so hosts that look for a literal `404.html`
 * serve the not-found page). It is byte-identical to `out/_not-found/`, so
 * checking both would be a false-positive title/H1 duplicate — the actual
 * not-found *page* is `_not-found`, which is included below.
 */
const NON_PAGE_INDEX_FILES = new Set(["404/index.html"]);

/** Every `index.html` file under out/ — the set of real rendered pages to check. */
function pageFiles() {
  return walkFiles(OUT_DIR)
    .filter((file) => file.endsWith("index.html"))
    .filter((file) => !NON_PAGE_INDEX_FILES.has(relative(OUT_DIR, file)));
}

// --- HTML extraction helpers (hand-rolled regex, no parser dependency) ---

/** Returns the inner content of every <script type="application/ld+json">...</script> block. */
function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    blocks.push(m[1]);
  }
  return blocks;
}

/** Returns the text content of the <title> tag, or null if absent. */
function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim() : null;
}

/** Returns the number of <h1 ...> opening tags in the HTML. */
function countH1s(html) {
  const matches = html.match(/<h1[\s>]/gi);
  return matches ? matches.length : 0;
}

/** Returns every <img ...> tag found in the HTML, verbatim. */
function extractImgTags(html) {
  const re = /<img[^>]*>/gi;
  return html.match(re) ?? [];
}

/** True if a tag string has an `alt` attribute present at all (empty alt="" counts as present). */
function hasAltAttribute(imgTag) {
  return /\balt\s*=\s*["']/i.test(imgTag);
}

// --- Check A: title uniqueness --------------------------------------------

function checkTitleUniqueness(pages) {
  const failures = [];
  const seen = new Map(); // title -> first relPath that used it

  for (const { relPath, html } of pages) {
    const title = extractTitle(html);
    if (title === null) {
      failures.push(`[title-uniqueness] out/${relPath}: no <title> tag found.`);
      continue;
    }
    const firstSeenAt = seen.get(title);
    if (firstSeenAt) {
      failures.push(
        `[title-uniqueness] out/${relPath} and out/${firstSeenAt} share the same <title>: "${title}"`
      );
    } else {
      seen.set(title, relPath);
    }
  }

  return failures;
}

// --- Check B: exactly one <h1> per page -----------------------------------

function checkH1Count(pages) {
  const failures = [];

  for (const { relPath, html } of pages) {
    const count = countH1s(html);
    if (count !== 1) {
      failures.push(`[h1-count] out/${relPath}: expected exactly 1 <h1>, found ${count}.`);
    }
  }

  return failures;
}

// --- Check C: every <img> must have an alt attribute ----------------------

function checkImageAltText(pages) {
  const failures = [];

  for (const { relPath, html } of pages) {
    for (const imgTag of extractImgTags(html)) {
      if (!hasAltAttribute(imgTag)) {
        failures.push(
          `[image-alt-text] out/${relPath}: <img> tag missing an alt attribute: ${imgTag.slice(0, 200)}`
        );
      }
    }
  }

  return failures;
}

// --- Check D: JSON-LD blocks must parse and every item must have @type ---

function checkJsonLdShape(pages) {
  const failures = [];

  for (const { relPath, html } of pages) {
    const blocks = extractJsonLdBlocks(html);
    blocks.forEach((block, blockIndex) => {
      let parsed;
      try {
        parsed = JSON.parse(block);
      } catch (err) {
        failures.push(
          `[json-ld-shape] out/${relPath}: JSON-LD block ${blockIndex + 1} failed to parse: ${err.message}`
        );
        return;
      }

      if (Array.isArray(parsed)) {
        parsed.forEach((item, itemIndex) => {
          if (!item || typeof item !== "object" || !("@type" in item)) {
            failures.push(
              `[json-ld-shape] out/${relPath}: JSON-LD block ${blockIndex + 1}, item ${itemIndex + 1} is missing "@type".`
            );
          }
        });
      } else if (parsed && typeof parsed === "object") {
        if (!("@type" in parsed)) {
          failures.push(`[json-ld-shape] out/${relPath}: JSON-LD block ${blockIndex + 1} is missing "@type".`);
        }
      } else {
        failures.push(
          `[json-ld-shape] out/${relPath}: JSON-LD block ${blockIndex + 1} is neither an object nor an array.`
        );
      }
    });
  }

  return failures;
}

// --- main ------------------------------------------------------------------

function main() {
  if (!existsSync(OUT_DIR) || !statSync(OUT_DIR).isDirectory()) {
    console.error(
      `Error: ${relative(ROOT, OUT_DIR) || "out/"} not found. This script verifies an already-built export — run \`next build\` first (see the verify:seo npm script).`
    );
    process.exit(1);
  }

  const pages = pageFiles().map((file) => ({
    relPath: relative(OUT_DIR, file),
    html: readText(file),
  }));

  const failures = [
    ...checkTitleUniqueness(pages),
    ...checkH1Count(pages),
    ...checkImageAltText(pages),
    ...checkJsonLdShape(pages),
  ];

  if (failures.length > 0) {
    console.error(`\n✗ verify-seo: ${failures.length} check(s) failed:\n`);
    failures.forEach((failure, i) => console.error(`${i + 1}. ${failure}\n`));
    process.exit(1);
  }

  console.log(`✓ verify-seo: all checks passed.`);
}

main();
