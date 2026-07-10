"use client";

import { createElement, Fragment, useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReduced } from "./gsap-setup";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * SplitReveal — a heading that reveals word by word: each word rises and fades
 * in with a stagger as the heading scrolls into view. Words are individual
 * inline-block spans separated by real (breakable) spaces so the heading still
 * wraps responsively. Transform/opacity only, fires once, and under
 * prefers-reduced-motion the words simply render in place (no hidden state).
 *
 * Pass the heading as a plain `text` string (keeps splitting simple); use
 * `as` for the tag (h1/h2/…) and `className` for the type styles.
 */
type SplitRevealProps = {
  as?: ElementType;
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  start?: string;
};

export function SplitReveal({
  as = "h2",
  text,
  className,
  delay = 0,
  stagger = 0.045,
  start = "top 82%",
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReduced()) return;
      gsap.fromTo(
        el.querySelectorAll("[data-word]"),
        { yPercent: 65, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger,
          delay,
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    },
    { scope: ref }
  );

  return createElement(
    as,
    { ref, className },
    words.map((word, i) => (
      <Fragment key={i}>
        <span data-word className="inline-block will-change-[transform,opacity]">
          {word}
        </span>
        {i < words.length - 1 ? " " : ""}
      </Fragment>
    ))
  );
}
