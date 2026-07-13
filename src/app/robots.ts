import type { MetadataRoute } from "next";

// Canonical site URL — this is a GitHub Pages *project* site, so it can't
// serve robots.txt at the true origin root (that belongs to the account's
// root github.io site). Crawlers that only check the origin root won't see
// this; it still works for anyone/anything that fetches this exact path,
// and is ready to go the moment a custom domain is pointed here.
const SITE_URL = "https://alliancestreetgoa-lang.github.io/as.ae";

// Explicit allow for the crawlers that power AI-generated answers, in
// addition to the default allow-all below — see chatbot/README.md and the
// ai-seo audit for context. None of these are blocked today; this just makes
// the intent explicit and future-proofs against an accidental Disallow.
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Bingbot",
];

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
