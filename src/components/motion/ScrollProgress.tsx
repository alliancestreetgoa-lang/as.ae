"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * ScrollProgress — a thin brand-red bar pinned to the very top of the viewport
 * that fills left→right as the page scrolls, giving a lightweight read on
 * position. Scrubbed to the document scroll (synced via Lenis→ScrollTrigger),
 * transform-only (scaleX), so it's cheap and doesn't reflow.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!bar.current) return;
    gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      }
    );
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        ref={bar}
        className="h-full w-full origin-left scale-x-0 bg-as-red"
      />
    </div>
  );
}
