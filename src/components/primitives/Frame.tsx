"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReduced } from "@/components/motion/gsap-setup";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type FrameTone = "red" | "line";

const toneClasses: Record<FrameTone, string> = {
  red: "border-as-red",
  line: "border-as-line",
};

type FrameProps = {
  tone?: FrameTone;
  className?: string;
  children?: ReactNode;
};

const CORNER_BASE = "pointer-events-none absolute h-6 w-6 sm:h-8 sm:w-8";

/**
 * Frame — the recurring corner-bracket brand motif. Four CSS/border-based
 * brackets sit at the corners of the wrapped content, each drawing two sides
 * of a square with `border` so the colour follows the brand tokens and stays
 * crisp at any size. When the frame scrolls into view the four corners pop
 * into place (scale + fade, staggered, slight overshoot). Reduced-motion safe.
 */
export function Frame({ tone = "red", className, children }: FrameProps) {
  const borderColor = toneClasses[tone];
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReduced()) return;
      gsap.fromTo(
        el.querySelectorAll("[data-corner]"),
        { opacity: 0, scale: 0.4 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(2)",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <span
        data-corner
        aria-hidden="true"
        className={cn(CORNER_BASE, "top-0 left-0 border-t-2 border-l-2", borderColor)}
      />
      <span
        data-corner
        aria-hidden="true"
        className={cn(CORNER_BASE, "top-0 right-0 border-t-2 border-r-2", borderColor)}
      />
      <span
        data-corner
        aria-hidden="true"
        className={cn(CORNER_BASE, "bottom-0 left-0 border-b-2 border-l-2", borderColor)}
      />
      <span
        data-corner
        aria-hidden="true"
        className={cn(CORNER_BASE, "bottom-0 right-0 border-b-2 border-r-2", borderColor)}
      />
      <div className="relative h-full p-6 sm:p-8">{children}</div>
    </div>
  );
}
