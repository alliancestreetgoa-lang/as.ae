"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReduced } from "@/components/motion/gsap-setup";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Parallax — wraps a full-bleed child (typically a `next/image` with `fill`,
 * or a background layer) and drifts it vertically as its container scrolls
 * through the viewport, giving depth. The inner layer is over-scanned by
 * `amount` px on both edges so the drift never exposes a gap, and the
 * container clips the overflow.
 *
 * Scrubbed to the scrollbar (`ease: "none"`), transform-only. Fully static
 * under `prefers-reduced-motion` — the child simply fills the container with
 * no movement.
 *
 * Usage:
 *   <Parallax className="aspect-[16/10] rounded-[18px]" amount={80}>
 *     <Image src="…" alt="…" fill className="object-cover" />
 *   </Parallax>
 */
export function Parallax({
  children,
  amount = 60,
  className,
}: {
  children: ReactNode;
  /** Total vertical travel in px across the full scroll of the section. */
  amount?: number;
  className?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReduced() || !inner.current || !container.current) return;
      gsap.fromTo(
        inner.current,
        { yPercent: -50, y: -amount / 2 },
        {
          yPercent: -50,
          y: amount / 2,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: container, dependencies: [amount] }
  );

  return (
    <div ref={container} className={cn("relative overflow-hidden", className)}>
      {/* Over-scanned inner layer (top:50% + yPercent:-50 keeps it centred; the
          y tween drifts it within the ±amount/2 over-scan). */}
      <div
        ref={inner}
        className="absolute inset-x-0 top-1/2"
        style={{ height: `calc(100% + ${amount}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
