"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Button } from "@/components/primitives/Button";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Frame } from "@/components/primitives/Frame";
import { prefersReduced } from "@/components/motion/gsap-setup";

/**
 * Hero — the homepage's first impression and the one place the brand's
 * signature red gets to be a large, dominant gradient moment rather than a
 * small accent. Structural cues (badge above headline, oversized serif
 * headline, thin CTA row) borrowed from 21st.dev "Hero — Luxury Editorial"
 * (dzekuza, id 14846), re-themed to Fraunces/Geist + the as-ink/as-red
 * tokens and hand-built (no framer-motion in that source is kept, but the
 * layout/CTA shape is the reference).
 *
 * Motion: a single GSAP timeline staggers eyebrow -> badge -> headline
 * lines -> subcopy -> CTAs on load, and a scroll-scrubbed ScrollTrigger
 * drifts the red glow layer for a subtle parallax as the hero scrolls out
 * of view. Both are skipped entirely under prefers-reduced-motion, in
 * which case the server-rendered markup (fully visible, no transforms) is
 * the final state.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;

      const lines = [line1Ref.current, line2Ref.current, line3Ref.current].filter(
        (el): el is HTMLSpanElement => Boolean(el)
      );

      // On-load reveal. A single gsap.from() with stagger — NOT a chain of
      // .fromTo() tweens. Chained fromTo()s (each immediateRender:true by
      // default) at overlapping negative offsets were leaving the middle
      // stages (headline lines + subcopy) stranded at their opacity:0
      // from-state in both dev and the production export, while earlier and
      // later stages revealed — a classic immediateRender interaction bug.
      // One from() tween sidesteps that entirely, and clearProps strips the
      // inline opacity/transform on completion so nothing can be left hidden.
      const targets = [
        eyebrowRef.current,
        badgeRef.current,
        ...lines,
        subRef.current,
        ctaRef.current,
      ].filter((el): el is HTMLElement => Boolean(el));

      gsap.from(targets, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        clearProps: "opacity,transform",
      });

      // Subtle parallax: the red glow drifts down as the hero scrolls past.
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-as-canvas pt-[82px]"
    >
      {/* Soft red glow, top-right — a warm brand accent on the white canvas;
          also the parallax target. */}
      <div ref={glowRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-1/4 -top-1/3 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(226,46,52,0.16)_0%,rgba(226,46,52,0.05)_45%,transparent_72%)] blur-2xl sm:h-[760px] sm:w-[760px] lg:h-[920px] lg:w-[920px]" />
      </div>

      <div className="as-container relative flex min-h-[calc(100svh-82px)] flex-col justify-center py-14 sm:py-16 lg:py-20">
        <Frame tone="red" className="max-w-4xl">
          <div ref={eyebrowRef}>
            <Eyebrow>Alliance Street &middot; Dubai, UAE</Eyebrow>
          </div>

          {/* nomination badge */}
          <div
            ref={badgeRef}
            className="mt-6 inline-flex items-center gap-3 rounded-full border border-as-line bg-white py-1.5 pl-5 pr-1.5 text-sm text-as-muted shadow-sm"
          >
            <span>
              Alliance Street is nominated as best business consulting firm in Asia
            </span>
            <a
              href="https://www.asiabusinessoutlook.com/services-and-consulting/cover-story/alliance-street-consultancy-steering-businesses-to-growth-with-bespoke-consulting-solutions-cid-1423.html"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-as-ink px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-as-red"
            >
              Read more
            </a>
          </div>

          <h1 className="font-display mt-6 text-[40px] leading-[1.05] tracking-[-0.04em] text-as-ink sm:text-[58px] lg:text-[72px]">
            <span ref={line1Ref} className="block">
              Business Setup &amp;
            </span>
            <span ref={line2Ref} className="block">
              Company Formation Services
            </span>
            <span ref={line3Ref} className="block">
              in Dubai, UAE
            </span>
          </h1>

          <p ref={subRef} className="mt-6 max-w-xl font-sans text-lg text-as-muted">
            At Alliance Street, we built business structures that help you protect
            your assets and eliminate taxation (often fully) - corporate &amp;
            private.
          </p>

          <div ref={ctaRef} className="mt-8 flex flex-wrap items-center gap-6">
            <Button href="#collaborate" variant="primary">
              Let&apos;s talk
            </Button>
            <Button href="#solutions" variant="outline" arrow>
              Our solutions
            </Button>
          </div>
        </Frame>
      </div>
    </section>
  );
}
