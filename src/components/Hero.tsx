"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight } from "@/components/icons";
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

      // Each stage's hidden "from" state is declared inline with its own
      // "to" state via fromTo(), instead of a separate gsap.set() list kept
      // in sync with a separate .to() chain. That two-list pattern is how a
      // target (e.g. the subcopy) can end up with a from-state but no
      // matching tween — a decoupled list and chain can silently drift out
      // of sync. fromTo() makes that class of bug impossible: there is
      // exactly one call site per stage, and it always pairs the hidden
      // state with its reveal.
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });
      tl.fromTo(eyebrowRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0 })
        .fromTo(badgeRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, "-=0.5")
        .fromTo(lines, { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.12 }, "-=0.45")
        .fromTo(subRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, "-=0.4")
        .fromTo(ctaRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, "-=0.45");

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
      className="relative isolate overflow-hidden bg-as-ink pt-[82px]"
    >
      {/* Red gradient glow — the hero's one large red moment; also the parallax target. */}
      <div ref={glowRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-1/4 -top-1/3 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(226,46,52,0.55)_0%,rgba(226,46,52,0.16)_45%,transparent_72%)] blur-2xl sm:h-[760px] sm:w-[760px] lg:h-[920px] lg:w-[920px]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <div className="as-container relative py-24 sm:py-32 lg:py-36">
        <Frame tone="red" className="max-w-4xl">
          <div ref={eyebrowRef}>
            <Eyebrow>Alliance Street &middot; Dubai, UAE</Eyebrow>
          </div>

          {/* nomination badge */}
          <div
            ref={badgeRef}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-5 pr-1.5 text-sm text-white/70"
          >
            <span>
              Alliance Street is nominated as best business consulting firm in Asia
            </span>
            <a
              href="#publications"
              className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black shadow-sm transition-colors hover:bg-white/90"
            >
              Read more
            </a>
          </div>

          <h1 className="font-display mt-8 text-[44px] leading-[1.05] tracking-[-0.04em] text-white sm:text-[64px] lg:text-[80px]">
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

          <p ref={subRef} className="mt-8 max-w-xl font-sans text-lg text-white/60">
            At Alliance Street, we built business structures that help you protect
            your assets and eliminate taxation (often fully) - corporate &amp;
            private.
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="#collaborate"
              className="inline-flex items-center gap-2 rounded-full bg-as-red px-7 py-3.5 font-sans text-[15px] font-semibold text-white transition-colors hover:bg-as-red-bright"
            >
              Let&apos;s talk
            </a>
            <a
              href="#solutions"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-sans text-[15px] font-semibold text-white transition-colors hover:border-as-red/60 hover:text-as-red"
            >
              Our solutions
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Frame>
      </div>
    </section>
  );
}
