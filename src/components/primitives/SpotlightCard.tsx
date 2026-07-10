"use client";

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * SpotlightCard — the 21st.dev "Spotlight Card" (easemize) effect: a red
 * spotlight that tracks the pointer and lights up the card's fill and its
 * border (the glowing ring is drawn by the `[data-glow]` pseudo-elements in
 * globals.css). This component just feeds it card-relative --x/--y on pointer
 * move and parks them off-card on leave, plus a subtle lift. `tone` tunes the
 * fill-glow strength for light vs. dark surfaces. No framer-motion; the border
 * glow is disabled under prefers-reduced-motion.
 */
type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
};

export function SpotlightCard({
  children,
  className,
  tone = "light",
}: SpotlightCardProps) {
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
      {children}
    </div>
  );
}
