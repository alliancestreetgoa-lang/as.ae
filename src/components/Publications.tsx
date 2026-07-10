"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "@/components/icons";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { PUBLICATIONS } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Publications — press coverage (content unchanged). On mobile/tablet the
 * cards are a plain vertical stack / 2-col grid (nothing clipped). On lg with
 * motion allowed, the section PINS and the press cards scroll HORIZONTALLY as
 * you scroll vertically — the page's signature cinematic scroll moment.
 *
 * The horizontal pin is set up inside `gsap.matchMedia("(min-width:1024px)
 * and (prefers-reduced-motion: no-preference)")`, so it never runs on
 * smaller screens or under reduced motion: those users get the native
 * `lg:overflow-x-auto` rail (or the mobile stack) with no pin and no
 * scroll-jacking. matchMedia auto-reverts the pin + inline styles when the
 * query stops matching (resize / preference change).
 */
export function Publications() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = trackRef.current;
          const pin = pinRef.current;
          if (!track || !pin) return;

          // Take over from the native horizontal scroll while pinned.
          track.style.overflow = "hidden";
          const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);

          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top top+=90",
              end: () => "+=" + distance(),
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          return () => {
            tween.kill();
            track.style.overflow = "";
            gsap.set(track, { x: 0 });
          };
        }
      );
    },
    { scope: pinRef }
  );

  return (
    <Section id="publications" bg="ink">
      <div
        ref={pinRef}
        className="col-span-12 grid gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-center lg:gap-16"
      >
        {/* Intro */}
        <Reveal as="div" y={24} className="lg:h-fit">
          <Eyebrow>Press coverage</Eyebrow>
          <h2 className="font-display mt-6 text-[40px] leading-[1.05] tracking-[-0.04em] text-white sm:text-[56px]">
            Publications
          </h2>
          <p className="mt-6 max-w-md font-sans text-lg text-white/60">
            Read about us in renowned publications, each underlining our
            dedication to excellence and innovation.
          </p>
          <a
            href="#collaborate"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-as-red px-7 py-3.5 font-sans text-[15px] font-semibold text-white transition-colors hover:bg-as-red-bright"
          >
            Let&apos;s talk
          </a>
          <p className="mt-10 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
            Scroll to explore
            <ArrowRight className="h-3.5 w-3.5" />
          </p>
        </Reveal>

        {/* Cards: vertical stack (mobile) / 2-col grid (sm) / horizontal rail
            (lg — pinned + GSAP-driven when motion is allowed, otherwise native
            scroll). The lg column clips so cards slide in from the right. */}
        <div className="min-w-0 lg:overflow-hidden">
          <div
            ref={trackRef}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:flex lg:snap-x lg:snap-mandatory lg:-mr-2 lg:gap-6 lg:overflow-x-auto lg:pb-6 lg:pr-2 lg:[scrollbar-color:var(--color-as-red)_transparent] lg:[scrollbar-width:thin] lg:[&::-webkit-scrollbar]:h-1.5 lg:[&::-webkit-scrollbar-thumb]:rounded-full lg:[&::-webkit-scrollbar-thumb]:bg-as-red/40 lg:[&::-webkit-scrollbar-track]:bg-transparent"
          >
            {PUBLICATIONS.map((pub, i) => (
              <Reveal
                as="article"
                key={pub.title}
                y={24}
                delay={i * 0.06}
                className="group w-full shrink-0 lg:w-[420px] lg:snap-start"
              >
                <div className="h-full overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.03] transition-colors group-hover:border-as-red/50">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/5">
                    <Image
                      src={pub.image}
                      alt={pub.outlet}
                      fill
                      sizes="(min-width: 1024px) 420px, 85vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-7">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-as-red">
                      {pub.outlet}
                    </p>
                    <h3 className="font-display mt-3 text-xl leading-snug text-white sm:text-2xl">
                      {pub.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-white/60">
                      {pub.excerpt}
                    </p>
                    <a
                      href={pub.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 font-sans font-semibold text-white transition-colors group-hover:text-as-red"
                    >
                      Read the Full Article
                      <ArrowRight className="h-5 w-5 text-as-red" />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
