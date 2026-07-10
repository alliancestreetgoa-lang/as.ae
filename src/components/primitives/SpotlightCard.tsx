"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * SpotlightCard — a card wrapper with a cursor-following radial glow, the
 * signature 21st.dev card treatment (aceternity / hextaui "Spotlight Card").
 * A tiny pointer listener sets `--spot-x/--spot-y` CSS vars that position a
 * brand-red radial-gradient overlay, which fades in on hover. The card also
 * lifts slightly. No framer-motion; only opacity/transform animate, so it's
 * cheap and reduced-motion friendly.
 *
 * `tone` tunes the glow strength for the surface: "dark" (bg-as-ink cards)
 * or "light" (canvas cards). This is the OUTER card box — it carries the
 * rounded corners, border and background, so it replaces a card's wrapper
 * rather than nesting inside it.
 */
type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
  /** Glow radius in px. */
  radius?: number;
};

export function SpotlightCard({
  children,
  className,
  tone = "dark",
  radius = 340,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const glow =
    tone === "dark"
      ? "radial-gradient(var(--spot-r) circle at var(--spot-x) var(--spot-y), rgba(226,46,52,0.20), transparent 62%)"
      : "radial-gradient(var(--spot-r) circle at var(--spot-x) var(--spot-y), rgba(226,46,52,0.12), transparent 58%)";

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
        el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
        el.style.setProperty("--spot-o", "1");
      }}
      onMouseLeave={() => {
        ref.current?.style.setProperty("--spot-o", "0");
      }}
      style={{ "--spot-r": `${radius}px` } as CSSProperties}
      className={cn(
        "group/spot relative overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className
      )}
    >
      <div
        aria-hidden="true"
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 z-0 opacity-[var(--spot-o,0)] transition-opacity duration-300"
      />
      {children}
    </div>
  );
}
