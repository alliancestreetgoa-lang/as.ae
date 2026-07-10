"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/primitives/Button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Counter } from "@/components/motion/Counter";
import { prefersReduced } from "@/components/motion/gsap-setup";

const DEFAULT_QUOTE =
  "“...a testament to the competence and excellent application of industry standards & methods combined with a strive towards brilliance.” - Asia Business Outlook";

/**
 * StatsBanner — a full-bleed dark moment between the lighter canvas
 * sections, built around a single oversized proof point rather than the
 * grid of stats shown elsewhere on the page. Structural cues (full-bleed
 * photo, bottom-anchored copy block, gradient scrim) are a straight
 * continuation of the pre-redesign layout; 21st.dev was checked first
 * ("full-bleed image stat band with large number overlay" -> Atlas Stat
 * Band, id 16243; Texture Overlay / SVG Bands, cult-ui ids 18022/18023)
 * but every result is a multi-stat card grid or a decorative edge shape,
 * not a single-stat photo overlay, so this is hand-built instead of
 * adapted, following the same GSAP scroll-parallax pattern already
 * established in `Hero.tsx` (scrubbed `yPercent` drift on the background
 * layer, skipped entirely under `prefers-reduced-motion`).
 *
 * Red is kept to a small accent only: the `Eyebrow` tick above the number.
 * The number itself (via `Counter`) is white/ink, not red, per the
 * brand rule that this banner's one red moment stays a hairline, not a
 * fill.
 */
export function StatsBanner({
  quote = DEFAULT_QUOTE,
  showButton = true,
}: {
  quote?: string;
  showButton?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReduced() || !imageRef.current) return;

      // Scale is applied here (via GSAP) rather than as a Tailwind class:
      // GSAP writes the composed transform as an inline style, so a
      // separate `scale-*` utility class on the same element would be
      // silently overridden the moment the scrub tween below runs. Setting
      // scale through gsap.set keeps it in GSAP's own transform cache
      // alongside yPercent, so the photo stays overscaled (no exposed edge)
      // for the whole parallax range. Reduced-motion users never reach
      // this branch, so they get the plain, unscaled, static image.
      gsap.set(imageRef.current, { scale: 1.12 });

      gsap.to(imageRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-as-ink">
      <div ref={imageRef} className="absolute inset-0">
        <Image
          src="/images/reviews.png"
          alt=""
          fill
          className="object-cover object-center opacity-70"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-as-ink via-as-ink/55 to-as-ink/25" />

      <div className="as-container relative z-10 flex min-h-[560px] flex-col justify-end py-16">
        <div className="max-w-3xl">
          <Eyebrow>Track record</Eyebrow>
          <p className="font-display mt-4 text-[110px] leading-none tracking-[-0.05em] text-white sm:text-[150px]">
            <Counter to={200} suffix="+" />
          </p>
          <p className="mt-2 font-sans text-2xl font-medium text-white">
            Successful projects completed.
          </p>
          <p className="mt-6 max-w-2xl font-sans text-lg italic text-white/70">
            {quote}
          </p>
          {showButton && (
            <Button href="/contact-us" variant="white" className="mt-8">
              About Us
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
