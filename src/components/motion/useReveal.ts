"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { prefersReduced } from "./gsap-setup";

type RevealOptions = {
  y?: number;
  x?: number;
  /** Start scale (e.g. 0.94 for a subtle scale-in on images). */
  scale?: number;
  /** Start blur in px (a soft focus-in). */
  blur?: number;
  delay?: number;
  duration?: number;
  /** ScrollTrigger start position. */
  start?: string;
};

export function useReveal({
  y = 24,
  x = 0,
  scale = 1,
  blur = 0,
  delay = 0,
  duration = 0.7,
  start = "top 85%",
}: RevealOptions = {}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReduced()) return;

      const from: gsap.TweenVars = { opacity: 0, y, x };
      const to: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        x: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start, once: true },
      };
      if (scale !== 1) {
        from.scale = scale;
        to.scale = 1;
      }
      if (blur > 0) {
        from.filter = `blur(${blur}px)`;
        to.filter = "blur(0px)";
      }

      gsap.fromTo(el, from, to);
    },
    { scope: ref }
  );
  return ref;
}
