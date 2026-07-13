// Endpoint of your deployed chat backend (the Cloudflare Worker in /chatbot).
// Set it at build time via NEXT_PUBLIC_CHAT_ENDPOINT, or hardcode the URL here
// after you deploy the worker (e.g. "https://alliance-chat.<you>.workers.dev").
export const CHAT_ENDPOINT =
  process.env.NEXT_PUBLIC_CHAT_ENDPOINT ?? "";

// First message the assistant shows when the panel opens.
export const CHAT_GREETING =
  "Hi! I'm the Alliance Street assistant — trained on the Fast Track to Zero Tax UAE structuring practice. Ask me about UAE company formation, banking, tax structuring, or real estate, or I can point you to the team for a live consultation.";

// Quick-start prompts shown as chips under the greeting. Rephrased from the
// GPT's team-facing starters ("a prospect says...") into visitor-facing ones —
// same underlying knowledge, just addressed to someone asking for themselves.
export const CHAT_SUGGESTIONS = [
  "What's the Small Business Relief threshold and how does it work?",
  "Walk me through a case similar to a UK property landlord with a £2M portfolio.",
  "How does the UAE structure work, and is it right for my business?",
];
