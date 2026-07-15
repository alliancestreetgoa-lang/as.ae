"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CHAT_ENDPOINT,
  CHAT_GREETING,
  CHAT_SUGGESTIONS,
} from "@/lib/chat-config";
import { trackEvent } from "@/lib/analytics";
import { getStoredAttribution } from "@/lib/attribution";

type Msg = { role: "user" | "assistant"; content: string };

type Lead = {
  name: string;
  company: string;
  email: string;
  phone: string;
  revenue: string;
  occupation: string;
  business: string;
};

const EMPTY_LEAD: Lead = {
  name: "",
  company: "",
  email: "",
  phone: "",
  revenue: "",
  occupation: "",
  business: "",
};

const LEAD_FIELDS: {
  key: keyof Lead;
  label: string;
  placeholder: string;
  type?: string;
}[] = [
  { key: "name", label: "Full name", placeholder: "Jane Doe" },
  { key: "company", label: "Company name", placeholder: "Acme Ltd" },
  {
    key: "email",
    label: "Email",
    placeholder: "jane@acme.com",
    type: "email",
  },
  {
    key: "phone",
    label: "Contact number",
    placeholder: "+44 7000 000000",
    type: "tel",
  },
  {
    key: "revenue",
    label: "Yearly revenue",
    placeholder: "e.g. £250,000/year",
  },
  {
    key: "occupation",
    label: "Occupation",
    placeholder: "e.g. Managing Director",
  },
  {
    key: "business",
    label: "What does your business do?",
    placeholder: "e.g. UK property rental portfolio",
  },
];

const LEAD_STORAGE_KEY = "as_chat_lead_v1";

/**
 * ChatWidget — a floating AI assistant on every page. Visitors must submit a
 * short intake form before they can chat; the Worker judges UAE-relocation
 * qualification against the full knowledge base and emails the lead, and the
 * verdict is folded into every chat turn so the bot knows who it's talking to.
 * The site is a static export, so it can't hold an API key; instead this
 * posts to CHAT_ENDPOINT (the Cloudflare Worker in /chatbot), which talks to
 * OpenAI with the key held server-side. On-brand (glass panel, red accents,
 * Fraunces header); keyboard-accessible (Esc closes, focus moves to the
 * input on open); only transform/opacity animate, gated for reduced motion.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [lead, setLead] = useState<Lead | null>(null);
  const [qualified, setQualified] = useState(false);
  const [leadForm, setLeadForm] = useState<Lead>(EMPTY_LEAD);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  const hasFiredFirstQuestion = useRef(false);
  const hasFiredFormStart = useRef(false);

  // Restore a previously-submitted lead so returning visitors aren't gated again.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LEAD_STORAGE_KEY);
      if (!raw) return;
      const saved: { lead?: Lead; qualified?: boolean } = JSON.parse(raw);
      if (saved.lead) {
        setLead(saved.lead);
        setQualified(Boolean(saved.qualified));
      }
    } catch {
      // ignore corrupt/blocked storage
    }
  }, []);

  // Focus the input when the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Fire chat_opened on every closed→open transition (both the launcher
  // button and the header toggle funnel through the same `open` state, so
  // watching the state here uniformly covers both without needing to
  // determine per-click whether it opened or closed the panel). Skipped on
  // mount because `open` starts `false`, and not fired on open→false.
  useEffect(() => {
    if (open) trackEvent({ name: "chat_opened", params: {} });
  }, [open]);

  // Esc closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the transcript pinned to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  async function submitLead(e: FormEvent) {
    e.preventDefault();
    if (leadSubmitting) return;

    if (LEAD_FIELDS.some(({ key }) => !leadForm[key].trim())) {
      setLeadError("Please fill in every field.");
      return;
    }

    if (!CHAT_ENDPOINT) {
      setLeadError(
        "The assistant isn't connected yet. Please use the Contact page instead."
      );
      return;
    }

    setLeadSubmitting(true);
    setLeadError(null);
    trackEvent({ name: "form_submit", params: { form_name: "lead_intake" } });
    try {
      const res = await fetch(`${CHAT_ENDPOINT}/lead`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lead: leadForm }),
      });
      const data: { qualified?: boolean; error?: string } = await res
        .json()
        .catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "failed");

      setLead(leadForm);
      setQualified(Boolean(data.qualified));
      const attribution = getStoredAttribution();
      trackEvent({
        name: "lead_submitted",
        params: attribution
          ? {
              utm_source: attribution.utm_source,
              utm_medium: attribution.utm_medium,
              utm_campaign: attribution.utm_campaign,
              landing_page: attribution.landing_page,
            }
          : {},
      });
      try {
        localStorage.setItem(
          LEAD_STORAGE_KEY,
          JSON.stringify({ lead: leadForm, qualified: Boolean(data.qualified) })
        );
      } catch {
        // ignore blocked storage
      }
    } catch {
      setLeadError("Something went wrong submitting your details. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  }

  function handleLeadFieldFocus() {
    if (hasFiredFormStart.current) return;
    hasFiredFormStart.current = true;
    trackEvent({ name: "form_start", params: { form_name: "lead_intake" } });
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    if (!hasFiredFirstQuestion.current) {
      hasFiredFirstQuestion.current = true;
      trackEvent({ name: "chat_first_question", params: {} });
    }

    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");

    if (!CHAT_ENDPOINT) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "The assistant isn't connected yet. Meanwhile, please reach us via the Contact page and we'll get right back to you.",
        },
      ]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next, lead, qualified }),
      });
      const data: { reply?: string; error?: string } = await res
        .json()
        .catch(() => ({}));
      const reply =
        (res.ok && data.reply) ||
        "Sorry — I couldn't reach the assistant just now. Please try again, or use the Contact page.";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "Sorry — I couldn't reach the assistant just now. Please try again, or use the Contact page.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <div className="fixed bottom-5 right-5 z-[70] flex items-center gap-3 sm:bottom-6 sm:right-6">
        {!open && (
          <button
            type="button"
            aria-label="Check your eligibility — open chat"
            onClick={() => setOpen(true)}
            className="rounded-full border border-as-line bg-white px-4 py-2.5 text-[13px] font-medium text-as-ink shadow-[0_10px_30px_-12px_rgba(16,16,20,0.4)] transition-transform duration-300 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            Check your eligibility
          </button>
        )}
        <button
          type="button"
          aria-label={open ? "Close chat" : "Chat with Alliance Street"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="group flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-as-red-bright),var(--color-as-red))] text-white shadow-[0_10px_30px_-8px_rgba(226,46,52,0.6)] transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-as-red motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <MessageSquare
            className={cn(
              "h-6 w-6 transition-all duration-200",
              open && "scale-0 opacity-0"
            )}
          />
          <X
            className={cn(
              "absolute h-6 w-6 transition-all duration-200",
              open ? "scale-100 opacity-100" : "scale-0 opacity-0"
            )}
          />
        </button>
      </div>

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Alliance Street assistant"
        aria-hidden={!open}
        {...(!open ? { inert: true } : {})}
        className={cn(
          "fixed bottom-24 right-5 z-[70] flex w-[calc(100vw-2.5rem)] max-w-[380px] origin-bottom-right flex-col overflow-hidden rounded-[22px] border border-as-line bg-white shadow-[0_24px_60px_-20px_rgba(16,16,20,0.4)] transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none sm:bottom-28 sm:right-6",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        )}
        style={{ height: "min(560px, calc(100vh - 8rem))" }}
      >
        {/* Header */}
        <div className="relative flex items-center gap-3 bg-as-ink px-5 py-4 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-as-red">
            <MessageSquare className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[17px] leading-tight">
              Alliance Street
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              Assistant · online
            </p>
          </div>
          <button
            type="button"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
            className="ml-auto rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!lead ? (
          <form
            onSubmit={submitLead}
            className="flex-1 space-y-3 overflow-y-auto bg-as-canvas px-4 py-5"
          >
            <p className="text-[14px] leading-relaxed text-as-ink">
              Tell us a bit about you and your business — we&apos;ll use this
              to point you in the right direction before we chat.
            </p>

            {LEAD_FIELDS.map(({ key, label, placeholder, type }) => (
              <label key={key} className="block text-[13px] text-as-muted">
                {label}
                <input
                  type={type ?? "text"}
                  value={leadForm[key]}
                  onChange={(e) =>
                    setLeadForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  onFocus={handleLeadFieldFocus}
                  placeholder={placeholder}
                  className="mt-1 w-full rounded-lg border border-as-line bg-white px-3 py-2 text-[14px] text-as-ink outline-none transition-colors placeholder:text-as-muted/70 focus:border-as-red/50"
                />
              </label>
            ))}

            {leadError && (
              <p className="text-[13px] text-as-red">{leadError}</p>
            )}

            <button
              type="submit"
              disabled={leadSubmitting}
              className="w-full rounded-full bg-[linear-gradient(180deg,var(--color-as-red-bright),var(--color-as-red))] px-4 py-2.5 text-[14px] font-medium text-white transition-opacity disabled:opacity-60"
            >
              {leadSubmitting ? "Submitting…" : "Start chatting"}
            </button>
          </form>
        ) : (
          <>
            {/* Transcript */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto bg-as-canvas px-4 py-5"
            >
              <Bubble role="assistant">{CHAT_GREETING}</Bubble>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {CHAT_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-as-line bg-white px-3 py-1.5 text-left text-[13px] leading-snug text-as-ink transition-colors hover:border-as-red/50 hover:text-as-red"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) => (
                <Bubble key={i} role={m.role}>
                  {m.content}
                </Bubble>
              ))}

              {loading && (
                <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md border border-as-line bg-white px-4 py-3">
                  <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-as-line bg-white px-3 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about setup, banking, tax…"
                className="min-w-0 flex-1 rounded-full border border-as-line bg-as-canvas px-4 py-2.5 text-[15px] text-as-ink outline-none transition-colors placeholder:text-as-muted focus:border-as-red/50"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!input.trim() || loading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-as-red-bright),var(--color-as-red))] text-white transition-opacity disabled:opacity-40"
              >
                <Send className="h-[18px] w-[18px]" />
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}

function Bubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed",
          isUser
            ? "rounded-br-md bg-as-red text-white"
            : "rounded-bl-md border border-as-line bg-white text-as-ink"
        )}
      >
        {children}
      </div>
    </div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-as-muted motion-reduce:animate-none"
      style={{ animationDelay: delay }}
    />
  );
}
