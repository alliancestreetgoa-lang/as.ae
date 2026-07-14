#!/usr/bin/env node

/**
 * Build-assertion script for the staging/production domain config wired up
 * by src/lib/site-config.ts (and consumed by schema.ts, seo.ts, robots.ts,
 * sitemap.ts, layout.tsx, and llms.txt/route.ts).
 *
 * Reads an already-built `out/` static export (does NOT run the build
 * itself) and fails loudly if:
 *
 *   A. A "production" build's output contains the staging domain
 *      (`shaukinsv`) anywhere other than the deliberately-pinned
 *      `out/CNAME` file.
 *   B. A "staging" build is indexable (robots.txt allows crawling, or any
 *      sampled page is missing a noindex meta tag).
 *   C. A "production" build is NOT indexable (mirror of B).
 *   D. The sitemap's <loc>, a page's <link rel="canonical">, and that page's
 *      JSON-LD "url"/"@id" values disagree on which domain they point at.
 *
 * Usage:
 *   node scripts/verify-build.mjs staging
 *   node scripts/verify-build.mjs production
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

/** Case-insensitive substring that must never appear in a production build (outside CNAME). */
const STAGING_DOMAIN_TOKEN = "shaukinsv";

/**
 * JSON-LD keys whose subtrees legitimately reference other people/orgs'
 * domains and must not be walked when collecting this site's own "url"/
 * "@id" self-references (see `collectUrlAndIdValues` and Check D below):
 *   - `subjectOf`: press-coverage references emitted by organizationSchema()
 *     (e.g. Daily Mail, Forbes article URLs) — not this site's identity.
 *   - `sameAs`: social-media profile links — also genuinely external.
 */
const EXTERNAL_REFERENCE_KEYS = new Set(["subjectOf", "sameAs"]);

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

// --- HTML/XML extraction helpers (hand-rolled regex, no parser dependency) ---

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

/** Returns the href of the <link rel="canonical"> tag, or null if absent. Attribute-order agnostic. */
function extractCanonicalHref(html) {
  const linkTagRe = /<link[^>]*>/gi;
  let m;
  while ((m = linkTagRe.exec(html))) {
    const tag = m[0];
    if (/rel=["']canonical["']/i.test(tag)) {
      const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
      if (hrefMatch) return hrefMatch[1];
    }
  }
  return null;
}

/** Returns the content attribute of <meta name="robots" ...>, or null if absent. Attribute-order agnostic. */
function extractRobotsMetaContent(html) {
  const metaTagRe = /<meta[^>]*>/gi;
  let m;
  while ((m = metaTagRe.exec(html))) {
    const tag = m[0];
    if (/name=["']robots["']/i.test(tag)) {
      const contentMatch = tag.match(/content=["']([^"']+)["']/i);
      return contentMatch ? contentMatch[1] : "";
    }
  }
  return null;
}

/**
 * Recursively collects every string value found under a "url" or "@id" key
 * anywhere in a parsed JSON-LD structure — except within the subtree of an
 * `EXTERNAL_REFERENCE_KEYS` key (`subjectOf`, `sameAs`), which is skipped
 * entirely since those fields legitimately point at other domains.
 */
function collectUrlAndIdValues(node, out) {
  if (Array.isArray(node)) {
    for (const item of node) collectUrlAndIdValues(item, out);
    return;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (EXTERNAL_REFERENCE_KEYS.has(key)) {
        continue; // known-external reference — do not collect url/@id from within it
      }
      if ((key === "url" || key === "@id") && typeof value === "string") {
        out.push({ key, value });
      } else {
        collectUrlAndIdValues(value, out);
      }
    }
  }
}

/** Extracts every <loc>...</loc> value from a sitemap.xml string, in document order. */
function extractSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

// --- Check A: production build must not leak the staging domain ----------

function checkNoDomainLeak(mode) {
  const failures = [];

  // Staging legitimately uses shaukinsv.com everywhere — nothing to assert here.
  if (mode !== "production") return failures;

  if (!existsSync(OUT_DIR)) return failures; // reported by the out/ existence check in main()

  for (const file of walkFiles(OUT_DIR)) {
    const relPath = relative(OUT_DIR, file);

    // Documented, deliberate exception: public/CNAME stays pinned to the
    // staging domain regardless of build environment (DNS has not cut over).
    if (relPath === "CNAME") continue;

    let content;
    try {
      content = readText(file);
    } catch {
      continue; // unreadable (shouldn't happen for files under out/); skip rather than crash the whole run
    }

    const lower = content.toLowerCase();
    if (!lower.includes(STAGING_DOMAIN_TOKEN)) continue;

    // Report every matching line, with enough context to act on.
    let searchFrom = 0;
    let match;
    while ((match = lower.indexOf(STAGING_DOMAIN_TOKEN, searchFrom)) !== -1) {
      const lineStart = content.lastIndexOf("\n", match) + 1;
      const lineEndIdx = content.indexOf("\n", match);
      const lineEnd = lineEndIdx === -1 ? content.length : lineEndIdx;
      const lineNumber = content.slice(0, match).split("\n").length;
      const context = content.slice(lineStart, lineEnd).trim().slice(0, 200);
      failures.push(
        `[domain-leak] out/${relPath}:${lineNumber} contains "${STAGING_DOMAIN_TOKEN}" — a production build must not reference the staging domain (out/CNAME is the one documented exception).\n    ${context}`
      );
      searchFrom = match + STAGING_DOMAIN_TOKEN.length;
    }
  }

  return failures;
}

// --- Checks B/C: staging must be non-indexable, production must be indexable ---

/** Candidate sample pages, checked in order and filtered down to the ones that actually exist in out/. */
const SAMPLE_PAGE_PATHS = ["", "banking", "faq", "about-us"];
const MIN_SAMPLE_PAGES = 2;

function existingSamplePages() {
  return SAMPLE_PAGE_PATHS.map((path) => ({
    path,
    file: join(OUT_DIR, path, "index.html"),
  })).filter(({ file }) => existsSync(file));
}

function robotsTxtIsFullDisallow(content) {
  const hasUserAgentAll = /user-agent:\s*\*/i.test(content);
  const hasDisallowRoot = /disallow:\s*\/\s*$/im.test(content);
  const hasAnyAllowRule = /^\s*allow:/im.test(content);
  return hasUserAgentAll && hasDisallowRoot && !hasAnyAllowRule;
}

function checkStagingIndexability(mode) {
  const failures = [];
  if (mode !== "staging") return failures;

  const robotsPath = join(OUT_DIR, "robots.txt");
  if (!existsSync(robotsPath)) {
    failures.push(`[staging-indexability] out/robots.txt not found.`);
  } else {
    const content = readText(robotsPath);
    if (!robotsTxtIsFullDisallow(content)) {
      failures.push(
        `[staging-indexability] out/robots.txt does not look like a full disallow. Expected "User-Agent: *" + "Disallow: /" and no "Allow:" rules. Got:\n${content
          .split("\n")
          .map((l) => `    ${l}`)
          .join("\n")}`
      );
    }
  }

  const pages = existingSamplePages();
  if (pages.length < MIN_SAMPLE_PAGES) {
    failures.push(
      `[staging-indexability] only found ${pages.length} of the sampled pages (${SAMPLE_PAGE_PATHS.join(
        ", "
      )}) in out/ — need at least ${MIN_SAMPLE_PAGES} to sample.`
    );
  }

  for (const { path, file } of pages) {
    const html = readText(file);
    const robotsMeta = extractRobotsMetaContent(html);
    const isNoindexNofollow =
      robotsMeta !== null && /noindex/i.test(robotsMeta) && /nofollow/i.test(robotsMeta);
    if (!isNoindexNofollow) {
      failures.push(
        `[staging-indexability] out/${path || "."}/index.html: expected a <meta name="robots"> tag containing "noindex" and "nofollow", got ${
          robotsMeta === null ? "no robots meta tag at all" : `content="${robotsMeta}"`
        }.`
      );
    }
  }

  return failures;
}

function checkProductionIndexability(mode) {
  const failures = [];
  if (mode !== "production") return failures;

  const robotsPath = join(OUT_DIR, "robots.txt");
  if (!existsSync(robotsPath)) {
    failures.push(`[production-indexability] out/robots.txt not found.`);
  } else {
    const content = readText(robotsPath);
    if (robotsTxtIsFullDisallow(content)) {
      failures.push(
        `[production-indexability] out/robots.txt is a full disallow (staging config) — production must allow crawling. Got:\n${content
          .split("\n")
          .map((l) => `    ${l}`)
          .join("\n")}`
      );
    }
  }

  const pages = existingSamplePages();
  if (pages.length < MIN_SAMPLE_PAGES) {
    failures.push(
      `[production-indexability] only found ${pages.length} of the sampled pages (${SAMPLE_PAGE_PATHS.join(
        ", "
      )}) in out/ — need at least ${MIN_SAMPLE_PAGES} to sample.`
    );
  }

  for (const { path, file } of pages) {
    const html = readText(file);
    const robotsMeta = extractRobotsMetaContent(html);
    const isNoindexNofollow =
      robotsMeta !== null && /noindex/i.test(robotsMeta) && /nofollow/i.test(robotsMeta);
    if (isNoindexNofollow) {
      failures.push(
        `[production-indexability] out/${path || "."}/index.html: has <meta name="robots" content="${robotsMeta}"> — production pages must not be noindex.`
      );
    }
  }

  return failures;
}

// --- Check D: sitemap / canonical / JSON-LD must agree on the same origin ---

const SCHEMA_SAMPLE_SIZE = 3;

function checkSchemaSitemapCanonicalAgreement() {
  const failures = [];

  const sitemapPath = join(OUT_DIR, "sitemap.xml");
  if (!existsSync(sitemapPath)) {
    failures.push(`[schema-consistency] out/sitemap.xml not found.`);
    return failures;
  }

  const locs = extractSitemapLocs(readText(sitemapPath));
  if (locs.length === 0) {
    failures.push(`[schema-consistency] out/sitemap.xml contains no <loc> entries.`);
    return failures;
  }

  let expectedOrigin;
  try {
    expectedOrigin = new URL(locs[0]).origin;
  } catch {
    failures.push(`[schema-consistency] sitemap's first <loc> "${locs[0]}" is not a valid URL.`);
    return failures;
  }

  const sample = locs.slice(0, SCHEMA_SAMPLE_SIZE);

  for (const loc of sample) {
    let locUrl;
    try {
      locUrl = new URL(loc);
    } catch {
      failures.push(`[schema-consistency] sitemap <loc> "${loc}" is not a valid URL.`);
      continue;
    }
    if (locUrl.origin !== expectedOrigin) {
      failures.push(
        `[schema-consistency] sitemap <loc> "${loc}" has origin "${locUrl.origin}", but the sitemap's first entry uses "${expectedOrigin}" — sitemap entries disagree with each other.`
      );
    }

    const pageFile = join(OUT_DIR, locUrl.pathname, "index.html");
    const pageLabel = `out${locUrl.pathname}index.html`;
    if (!existsSync(pageFile)) {
      failures.push(`[schema-consistency] page for sitemap entry "${loc}" not found at ${pageLabel}.`);
      continue;
    }
    const html = readText(pageFile);

    // Canonical tag.
    const canonical = extractCanonicalHref(html);
    if (!canonical) {
      failures.push(`[schema-consistency] ${pageLabel}: missing <link rel="canonical"> tag.`);
    } else if (canonical !== loc) {
      failures.push(
        `[schema-consistency] ${pageLabel}: canonical href "${canonical}" does not match sitemap <loc> "${loc}".`
      );
    }

    // JSON-LD "url" / "@id" values. Every such value is compared against the
    // expected origin unconditionally — there is no domain allowlist here.
    // `collectUrlAndIdValues` already excludes the specific fields that are
    // legitimately external (press coverage in `subjectOf`, social profiles
    // in `sameAs`) by skipping those subtrees during collection, so any
    // "url"/"@id" that reaches this point is a self-referential site URL and
    // must match. This catches a value drifting to ANY unexpected domain
    // (not just "the other known domain"), which a domain-allowlist gate
    // would silently skip as "external, out of scope".
    const blocks = extractJsonLdBlocks(html);
    if (blocks.length === 0) {
      failures.push(`[schema-consistency] ${pageLabel}: no JSON-LD <script type="application/ld+json"> blocks found.`);
    }
    for (const block of blocks) {
      let parsed;
      try {
        parsed = JSON.parse(block);
      } catch (err) {
        failures.push(`[schema-consistency] ${pageLabel}: a JSON-LD block failed to parse: ${err.message}`);
        continue;
      }
      const values = [];
      collectUrlAndIdValues(parsed, values);
      for (const { key, value } of values) {
        let valueUrl;
        try {
          valueUrl = new URL(value);
        } catch {
          failures.push(`[schema-consistency] ${pageLabel}: JSON-LD "${key}" value "${value}" is not a valid absolute URL.`);
          continue;
        }
        if (valueUrl.origin !== expectedOrigin) {
          failures.push(
            `[schema-consistency] ${pageLabel}: JSON-LD "${key}" value "${value}" has origin "${valueUrl.origin}", expected "${expectedOrigin}" (per sitemap <loc> "${loc}").`
          );
        }
      }
    }
  }

  return failures;
}

// --- main ------------------------------------------------------------------

function main() {
  const mode = process.argv[2];
  if (mode !== "staging" && mode !== "production") {
    console.error('Usage: node scripts/verify-build.mjs <staging|production>');
    process.exit(1);
  }

  if (!existsSync(OUT_DIR) || !statSync(OUT_DIR).isDirectory()) {
    console.error(
      `Error: ${relative(ROOT, OUT_DIR) || "out/"} not found. This script verifies an already-built export — run \`next build\` first (see the verify:staging / verify:production npm scripts).`
    );
    process.exit(1);
  }

  const failures = [
    ...checkNoDomainLeak(mode),
    ...checkStagingIndexability(mode),
    ...checkProductionIndexability(mode),
    ...checkSchemaSitemapCanonicalAgreement(mode),
  ];

  if (failures.length > 0) {
    console.error(`\n✗ verify-build (${mode}): ${failures.length} check(s) failed:\n`);
    failures.forEach((failure, i) => console.error(`${i + 1}. ${failure}\n`));
    process.exit(1);
  }

  console.log(`✓ verify-build (${mode}): all checks passed.`);
}

main();
