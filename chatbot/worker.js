/**
 * Alliance Street chat backend — a Cloudflare Worker that proxies the site's
 * chat widget to the OpenAI Chat Completions API. The OpenAI API key lives
 * here as a Worker secret (never in the website), so the static site can
 * call the model without exposing it.
 *
 * Two endpoints:
 *   POST /lead  — visitor's intake form. Assesses UAE-relocation qualification
 *                 against the full knowledge base, emails the lead (via Resend),
 *                 and returns { qualified } so the widget can unlock chat.
 *   POST /      — chat turn. Accepts { messages, lead, qualified } — lead/qualified
 *                 (from the /lead response) are folded into the system prompt so
 *                 the bot knows who it's talking to.
 *
 * Deploy:  see README.md in this folder.
 * Secrets: wrangler secret put OPENAI_API_KEY
 *          wrangler secret put RESEND_API_KEY
 * Persona + knowledge come from knowledge.generated.js — edit files in
 * knowledge/ and run `node build-knowledge.mjs` to regenerate it.
 */

import { SYSTEM_PROMPT, KNOWLEDGE } from "./knowledge.generated.js";

const MODEL = "gpt-4o-mini"; // swap to another OpenAI model as needed
const LEAD_EMAIL_TO = "alliancestreetgoa@gmail.com";

// System message: instructions, plus (if present) the knowledge base appended
// as reference context. OpenAI caches repeated prompt prefixes automatically
// once they're long enough, so no explicit cache directive is needed here.
const SYSTEM = KNOWLEDGE
  ? `${SYSTEM_PROMPT}\n\nYou have the following reference knowledge. Use it to answer; do not repeat it verbatim.\n\n${KNOWLEDGE}`
  : SYSTEM_PROMPT;

// Sites allowed to call this worker (CORS). Keeping the old github.io origin
// during the shaukinsv.com DNS transition; safe to remove once cut over.
const ALLOWED_ORIGINS = new Set([
  "https://shaukinsv.com",
  "https://alliancestreetgoa-lang.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

const LEAD_FIELDS = [
  "name",
  "company",
  "email",
  "phone",
  "revenue",
  "occupation",
  "business",
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : "https://shaukinsv.com";
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

function isValidLead(lead) {
  if (!lead || typeof lead !== "object") return false;
  return LEAD_FIELDS.every(
    (k) =>
      typeof lead[k] === "string" &&
      lead[k].trim().length > 0 &&
      lead[k].length <= 500
  );
}

function leadSummary(lead) {
  return [
    `Name: ${lead.name}`,
    `Company: ${lead.company}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Yearly revenue: ${lead.revenue}`,
    `Occupation: ${lead.occupation}`,
    `What they do: ${lead.business}`,
  ].join("\n");
}

async function callOpenAI(env, messages, { jsonMode = false } = {}) {
  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      messages,
    }),
  });

  if (!upstream.ok) {
    console.error("openai_error", upstream.status, await upstream.text());
    throw new Error("upstream_error");
  }

  const data = await upstream.json();
  return (data.choices?.[0]?.message?.content || "").trim();
}

// Judges qualification against the full knowledge base (thresholds, cost
// effectiveness, substance requirements, disqualification patterns from the
// case studies) rather than a hardcoded revenue cutoff.
async function assessQualification(env, lead) {
  const prompt = `A prospective client just submitted their details on the website, hoping to relocate/set up a company in the UAE. Using the knowledge base's own criteria for whether a UAE structure makes sense for someone at this stage (revenue thresholds, cost-effectiveness at their scale, occupation/business type fit, ability to establish genuine UAE substance, and disqualification patterns documented in the case studies), assess whether they QUALIFY for a consultation.

${leadSummary(lead)}

Respond with ONLY a JSON object, no other text: {"qualified": true or false, "reasoning": "1-3 sentences citing the specific criteria that drove this call"}`;

  try {
    const raw = await callOpenAI(
      env,
      [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
      { jsonMode: true }
    );
    const parsed = JSON.parse(raw);
    return {
      qualified: Boolean(parsed.qualified),
      reasoning:
        typeof parsed.reasoning === "string"
          ? parsed.reasoning
          : "(no reasoning returned)",
    };
  } catch (err) {
    console.error("qualification_assessment_failed", err);
    return {
      qualified: false,
      reasoning: "Automatic assessment failed — review this lead manually.",
    };
  }
}

async function sendLeadEmail(env, lead, verdict) {
  if (!env.RESEND_API_KEY) {
    console.error("lead_email_skipped", "RESEND_API_KEY not configured");
    return;
  }
  const subject = `New lead: ${lead.name} (${lead.company}) — ${
    verdict.qualified ? "QUALIFIED" : "NOT QUALIFIED"
  }`;
  const text = `${verdict.qualified ? "QUALIFIED ✅" : "NOT QUALIFIED ✗"}
${verdict.reasoning}

${leadSummary(lead)}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Alliance Street Bot <onboarding@resend.dev>",
      to: LEAD_EMAIL_TO,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    console.error("lead_email_error", res.status, await res.text());
  }
}

async function handleLead(request, env, cors) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "bad_json" }, 400, cors);
  }

  if (!isValidLead(body.lead)) {
    return json({ error: "invalid_lead" }, 400, cors);
  }

  try {
    const verdict = await assessQualification(env, body.lead);
    await sendLeadEmail(env, body.lead, verdict);
    return json({ qualified: verdict.qualified }, 200, cors);
  } catch {
    return json({ error: "network_error" }, 502, cors);
  }
}

async function handleChat(request, env, cors) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "bad_json" }, 400, cors);
  }

  const { messages, lead, qualified } = body;

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

  let system = SYSTEM;
  if (isValidLead(lead)) {
    system += `\n\n---\nCURRENT VISITOR PROFILE (already submitted via the intake form; do not ask them to repeat this):\n${leadSummary(
      lead
    )}\nQualification assessment: ${
      qualified ? "QUALIFIED" : "NOT currently qualified"
    } for a UAE relocation structure.\nIf qualified, look for natural moments to invite them to book a consultation call (direct them to the Contact page). If not qualified, be honest about why per the knowledge base's own criteria rather than pushing a call — suggest they reach back out as their situation changes.`;
  }

  try {
    const reply = await callOpenAI(env, [
      { role: "system", content: system },
      ...cleaned,
    ]);
    return json(
      { reply: reply || "Sorry, I couldn't generate a response." },
      200,
      cors
    );
  } catch {
    return json({ error: "network_error" }, 502, cors);
  }
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request.headers.get("Origin") || "");
    const { pathname } = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405, cors);
    }
    if (!env.OPENAI_API_KEY) {
      return json({ error: "server_not_configured" }, 500, cors);
    }

    // Cap requests per visitor IP before they reach any paid OpenAI call.
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const { success } = await env.RATE_LIMITER.limit({ key: ip });
    if (!success) {
      return json({ error: "rate_limited" }, 429, cors);
    }

    if (pathname === "/lead") {
      return handleLead(request, env, cors);
    }
    return handleChat(request, env, cors);
  },
};
