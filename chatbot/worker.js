/**
 * Alliance Street chat backend — a Cloudflare Worker that proxies the site's
 * chat widget to the Claude Messages API. The Anthropic API key lives here as
 * a Worker secret (never in the website), so the static site can call Claude
 * without exposing it.
 *
 * Deploy:  see README.md in this folder.
 * Secret:  wrangler secret put ANTHROPIC_API_KEY
 * Persona + knowledge come from knowledge.generated.js — edit files in
 * knowledge/ and run `node build-knowledge.mjs` to regenerate it.
 */

import { SYSTEM_PROMPT, KNOWLEDGE } from "./knowledge.generated.js";

const MODEL = "claude-opus-4-8"; // swap to "claude-haiku-4-5" for a cheaper/faster bot

// System field: instructions, plus (if present) the knowledge base as a second
// block with prompt caching so it's read at ~10% cost after the first call.
const SYSTEM = KNOWLEDGE
  ? [
      { type: "text", text: SYSTEM_PROMPT },
      {
        type: "text",
        text: `You have the following reference knowledge. Use it to answer; do not repeat it verbatim.\n\n${KNOWLEDGE}`,
        cache_control: { type: "ephemeral", ttl: "1h" },
      },
    ]
  : SYSTEM_PROMPT;

// Sites allowed to call this worker (CORS). Add your custom domain here.
const ALLOWED_ORIGINS = new Set([
  "https://alliancestreetgoa-lang.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.has(origin)
    ? origin
    : "https://alliancestreetgoa-lang.github.io";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request.headers.get("Origin") || "");

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405, cors);
    }
    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: "server_not_configured" }, 500, cors);
    }

    let messages;
    try {
      ({ messages } = await request.json());
    } catch {
      return json({ error: "bad_json" }, 400, cors);
    }

    // Keep only valid user/assistant turns, cap history + length to bound cost.
    const cleaned = (Array.isArray(messages) ? messages : [])
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim()
      )
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

    if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== "user") {
      return json({ error: "no_user_message" }, 400, cors);
    }

    try {
      const upstream = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1024,
          system: SYSTEM,
          messages: cleaned,
        }),
      });

      if (!upstream.ok) {
        return json({ error: "upstream_error" }, 502, cors);
      }

      const data = await upstream.json();
      const reply = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();

      return json(
        { reply: reply || "Sorry, I couldn't generate a response." },
        200,
        cors
      );
    } catch {
      return json({ error: "network_error" }, 502, cors);
    }
  },
};
