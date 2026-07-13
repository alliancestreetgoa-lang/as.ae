// Endpoint of your deployed chat backend (the Cloudflare Worker in /chatbot).
// Set it at build time via NEXT_PUBLIC_CHAT_ENDPOINT, or hardcode the URL here
// after you deploy the worker (e.g. "https://alliance-chat.<you>.workers.dev").
export const CHAT_ENDPOINT =
  process.env.NEXT_PUBLIC_CHAT_ENDPOINT ?? "";

// First message the assistant shows when the panel opens.
export const CHAT_GREETING =
  "Hi! I'm the Alliance Street assistant. Ask me about UAE company formation, banking, accounting, tax, or real estate — or I can point you to the right team.";

// Quick-start prompts shown as chips under the greeting.
export const CHAT_SUGGESTIONS = [
  "How do I set up a company in Dubai?",
  "Can you help with a UAE business bank account?",
  "What accounting & tax services do you offer?",
];
