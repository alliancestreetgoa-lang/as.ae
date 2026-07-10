"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "@/components/icons";
import { Button } from "@/components/primitives/Button";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { SpotlightCard } from "@/components/primitives/SpotlightCard";
import { Reveal } from "@/components/motion/Reveal";
import { PUBLICATIONS } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Publications — press coverage (content from `PUBLICATIONS`).
 *
 * On lg + motion, the section PINS and the press cards scroll HORIZONTALLY
 * through every outlet as you scroll down; once the last card is reached the
 * page continues to the next section. The intro stays fixed on the left; a
 * thin red bar tracks progress through the cards.
 *
 * The pinned element is a plain flex block (NOT a grid child) so ScrollTrigger
 * can fix it cleanly. The whole effect is set up inside
 * `gsap.matchMedia("(min-width:1024px) and (prefers-reduced-motion:
 * no-preference)")`: on mobile/tablet the cards are a vertical stack / 2-col
 * grid, and on lg under reduced motion they fall back to a native
 * `overflow-x-auto` rail — no pin, no scroll-jacking. matchMedia reverts the
 * pin + the inline styles it sets when the query stops matching.
 */
export function Publications() {
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const pin = pinRef.current;
          const viewport = viewportRef.current;
          const track = trackRef.current;
          if (!pin || !viewport || !track) return;

          // Switch the viewport from native scroll to a GSAP-driven track.
          viewport.style.overflow = "hidden";
          pin.style.height = "100vh";
          const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () => "+=" + distance(),
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              // Lower than Process (refreshPriority 1) above it, so the upper
              // pin computes its spacer first and the two don't overlap.
              refreshPriority: 0,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (progressRef.current) {
                  progressRef.current.style.transform = `scaleX(${self.progress})`;
                }
              },
            },
          });

          return () => {
            tween.kill();
            viewport.style.overflow = "";
            pin.style.height = "";
            gsap.set(track, { x: 0 });
          };
        }
      );
    },
    { scope: pinRef }
  );

  return (
    <section id="publications" className="bg-as-ink">
      <div
        ref={pinRef}
        className="as-container flex flex-col gap-12 py-24 lg:flex-row lg:items-stretch lg:gap-16 lg:py-16"
      >
        {/* Intro (centered on the left while the cards scroll) */}
        <Reveal as="div" y={24} className="lg:w-[340px] lg:shrink-0 lg:self-center">
          <Eyebrow>Press coverage</Eyebrow>
          <h2 className="font-display mt-6 text-[40px] leading-[1.05] tracking-[-0.04em] text-white sm:text-[56px]">
            Publications
          </h2>
          <p className="mt-6 max-w-md font-sans text-lg text-white/60">
            Read about us in renowned publications, each underlining our
            dedication to excellence and innovation.
          </p>
          <Button href="#collaborate" variant="primary" className="mt-8">
            Let&apos;s talk
          </Button>
          {/* Progress rail (lg motion only) */}
          <div className="mt-10 hidden h-px w-40 overflow-hidden bg-white/15 lg:block">
            <div
              ref={progressRef}
              className="h-full w-full origin-left scale-x-0 bg-as-red"
            />
          </div>
          <p className="mt-4 hidden items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white/40 lg:flex">
            Scroll to explore
            <ArrowRight className="h-3.5 w-3.5" />
          </p>
        </Reveal>

        {/* Cards viewport: vertical stack (mobile) / 2-col grid (sm) /
            horizontal track (lg — GSAP-scrolled with motion, native rail
            under reduced motion). */}
        <div
          ref={viewportRef}
          className="min-w-0 lg:flex-1 lg:overflow-x-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
        >
          <div
            ref={trackRef}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:flex lg:h-full lg:w-max lg:gap-6"
          >
            {PUBLICATIONS.map((pub, i) => (
              <Reveal
                as="article"
                key={pub.title}
                y={24}
                delay={i * 0.05}
                className="group w-full shrink-0 lg:w-[400px]"
              >
                <SpotlightCard
                  tone="dark"
                  className="flex h-full flex-col rounded-[20px] border border-white/10 bg-white/[0.03] group-hover:border-as-red/50"
                >
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-t-[20px] bg-white/5">
                    <Image
                      src={pub.image}
                      alt={pub.outlet}
                      fill
                      sizes="(min-width: 1024px) 400px, 85vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col p-7">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-as-red">
                      {pub.outlet}
                    </p>
                    <h3 className="font-display mt-3 text-xl leading-snug text-white sm:text-2xl lg:line-clamp-3">
                      {pub.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-white/60 lg:line-clamp-3">
                      {pub.excerpt}
                    </p>
                    <a
                      href={pub.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 font-sans font-semibold text-white transition-colors group-hover:text-as-red lg:mt-auto lg:pt-6"
                    >
                      Read the Full Article
                      <ArrowRight className="h-5 w-5 text-as-red" />
                    </a>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
