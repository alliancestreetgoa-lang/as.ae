"use client";

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * GlowCard — the 21st.dev "Spotlight Card" (easemize) effect, adapted as a
 * flexible wrapper for Alliance Street. A brand-red spotlight tracks the
 * pointer and lights up the card three ways (all in globals.css `[data-glow]`):
 * a soft fill glow on the surface, a bright glowing border ring (mask-
 * composited pseudo-elements), and a blurred outer bloom that haloes the card.
 *
 * Differences from the vendored source, on purpose: the hue is fixed to the
 * brand red instead of shifting across the viewport, pointer tracking is
 * card-relative (robust inside GSAP-pinned / transformed sections rather than
 * viewport `background-attachment: fixed`), and it imposes no layout of its own
 * so it can wrap real card content. `tone` tunes the fill for light/dark.
 */
type GlowCardProps = {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
};

export function GlowCard({ children, className, tone = "light" }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", (e.clientX - r.left).toFixed(1));
    el.style.setProperty("--y", (e.clientY - r.top).toFixed(1));
  };

  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--x", "-999");
    el.style.setProperty("--y", "-999");
  };

  return (
    <div
      ref={ref}
      data-glow
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ "--fill-opacity": tone === "dark" ? "0.16" : "0.1" } as CSSProperties}
      className={cn(
        "group/spot relative transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className
      )}
    >
      {/* Blurred outer bloom that haloes the card edges under the cursor. */}
      <span data-glow-bloom aria-hidden="true" className="pointer-events-none absolute -inset-1.5 -z-10" />
      {children}
    </div>
  );
}
