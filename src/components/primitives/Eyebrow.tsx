"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReduced } from "@/components/motion/gsap-setup";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type EyebrowProps = {
  className?: string;
  children?: ReactNode;
};

/**
 * Eyebrow — small mono-spaced label used above headings across the redesigned
 * site. Red, uppercase, widely tracked, with a leading tick mark that draws
 * itself in (scaleX from the left) when the eyebrow scrolls into view — a
 * signature micro-animation shared by every section. Reduced-motion safe: the
 * tick simply renders full-width with no animation.
 */
export function Eyebrow({ className, children }: EyebrowProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReduced()) return;
      const tick = el.querySelector("[data-tick]");
      if (!tick) return;
      gsap.fromTo(
        tick,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-as-red",
        className
      )}
    >
      <span
        data-tick
        aria-hidden="true"
        className="inline-block h-px w-4 origin-left bg-as-red"
      />
      {children}
    </span>
  );
}
