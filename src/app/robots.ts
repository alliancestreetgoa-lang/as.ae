import type { MetadataRoute } from "next";

// Served from the custom domain root (shaukinsv.com), so this is now at the
// true spec-correct robots.txt location.
const SITE_URL = "https://shaukinsv.com";

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
