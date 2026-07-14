"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { ArrowRight } from "@/components/icons";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { prefersReduced } from "@/components/motion/gsap-setup";
import { cn } from "@/lib/utils";
import { TESTIMONIALS } from "@/lib/content";

const AUTOPLAY_MS = 6500;
const TRANSITION_MS = 280;

/**
 * Testimonials — editorial quote slider. Content is data-driven from
 * `TESTIMONIALS` in `content.ts` (no real client names/companies). A large
 * Fraunces pull-quote is the hero of the section; Geist carries the
 * name/company underneath. Runs on `bg="canvas"` between the ink
 * Publications rail before it and the section after.
 *
 * 21st.dev was checked first: search "testimonial slider carousel" ->
 * Testimonial Slider (rf-rifat, id 2210) has the right shape (single active
 * card, autoplay that pauses on interaction, dot indicators) but is built
 * on framer-motion drag/spring transitions and external Unsplash avatars —
 * framer-motion is off-limits in this codebase and the avatars need to stay
 * the existing local images, so it's referenced for structure only, not
 * installed. Slider (originui, id 314) is a shadcn range-slider input, and
 * image auto slider (wisedev, id 2497) is an infinite marquee of external
 * photos — neither is a testimonial shape. Hand-built below: React state
 * for the active index, a CSS opacity/translate crossfade (no framer-motion,
 * no embla — neither is a dependency of this project), autoplay via
 * `setInterval` that pauses on hover/focus and is skipped entirely under
 * `prefers-reduced-motion` (checked with the shared `prefersReduced()` used
 * elsewhere for GSAP), where manual nav also swaps instantly with no fade.
 */
export function Testimonials() {
  const total = TESTIMONIALS.length;
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  // Temporary pause while the pointer/keyboard focus is inside the slider.
  const [hoverPaused, setHoverPaused] = useState(false);
  // Persistent pause toggled by the visible pause/play button — satisfies
  // WCAG 2.2.2 by giving keyboard users a lasting way to stop autoplay,
  // independent of hover/focus.
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const fadeTimeout = useRef<number | null>(null);

  const t = TESTIMONIALS[index];

  const goTo = (next: number) => {
    const target = ((next % total) + total) % total;
    if (target === index) return;

    if (fadeTimeout.current) window.clearTimeout(fadeTimeout.current);

    if (prefersReduced()) {
      // Reduced motion: swap instantly, no fade/slide.
      setIndex(target);
      return;
    }

    setVisible(false);
    fadeTimeout.current = window.setTimeout(() => {
      setIndex(target);
      setVisible(true);
    }, TRANSITION_MS);
  };

  const go = (delta: number) => goTo(index + delta);

  useEffect(() => {
    return () => {
      if (fadeTimeout.current) window.clearTimeout(fadeTimeout.current);
    };
  }, []);

  // Gentle autoplay: pauses on hover/focus or the persistent toggle,
  // disabled under reduced motion.
  useEffect(() => {
    if (hoverPaused || manuallyPaused || prefersReduced()) return;
    const id = window.setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, hoverPaused, manuallyPaused]);

  return (
    <Section id="testimonials" bg="canvas">
      <div
        className="col-span-12"
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
        onFocus={() => setHoverPaused(true)}
        onBlur={() => setHoverPaused(false)}
      >
        <Reveal as="div" y={28}>
          <Eyebrow>Don&apos;t listen to us, listen to them</Eyebrow>

          {/* aria-live: announces the quote + name/company to screen reader
              users on every autoplay/manual slide change. The nav controls
              below (dots, prev/next, pause toggle) sit outside this region
              since their own content doesn't change between slides. */}
          <div aria-live="polite">
            <blockquote
              className={cn(
                "font-display mt-10 max-w-4xl text-[28px] leading-[1.2] tracking-[-0.02em] text-as-ink transition-all ease-out sm:text-[40px] lg:text-[46px]",
                "motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              )}
              style={{ transitionDuration: `${TRANSITION_MS}ms` }}
            >
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <div
              className={cn(
                "mt-10 flex items-center gap-4 transition-opacity ease-out motion-reduce:transition-none motion-reduce:opacity-100",
                visible ? "opacity-100" : "opacity-0"
              )}
              style={{ transitionDuration: `${TRANSITION_MS}ms` }}
            >
              <Image
                src={t.image}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-full border border-as-line object-cover"
              />
              <div>
                <p className="font-sans text-lg font-semibold text-as-ink">{t.name}</p>
                <p className="font-sans text-sm text-as-muted">{t.company}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-6">
            <button
              type="button"
              aria-label={manuallyPaused ? "Play testimonials" : "Pause testimonials"}
              aria-pressed={manuallyPaused}
              onClick={() => setManuallyPaused((p) => !p)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-as-line text-as-ink transition-colors hover:border-as-red hover:text-as-red"
            >
              {manuallyPaused ? <Play className="h-5 w-5" aria-hidden="true" /> : <Pause className="h-5 w-5" aria-hidden="true" />}
            </button>

            <div className="flex items-center gap-2" role="group" aria-label="Choose testimonial">
              {TESTIMONIALS.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  aria-label={`Show testimonial from ${item.name}`}
                  aria-current={i === index}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === index ? "w-6 bg-as-red" : "w-2 bg-as-line hover:bg-as-red/50"
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => go(-1)}
                className="flex h-12 w-12 rotate-180 items-center justify-center rounded-full border border-as-line text-as-ink transition-colors hover:border-as-red hover:text-as-red"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => go(1)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-as-line text-as-ink transition-colors hover:border-as-red hover:text-as-red"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
