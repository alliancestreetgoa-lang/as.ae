import Image from "next/image";
import { ArrowRight } from "@/components/icons";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { PUBLICATIONS } from "@/lib/content";

/**
 * Publications — press coverage (content unchanged: Daily Mail, Forbes,
 * Gulf News, Business Insider, CEO Weekly, Digital Journal, Khaleej Times).
 * Runs on `bg="ink"` for rhythm — it sits between two canvas sections
 * (Process before it, Testimonials after) and the outlet covers read best
 * against dark, matching Hero/StatsBanner's ink treatment.
 *
 * 21st.dev was checked first for the requested "sticky-left intro,
 * horizontally scrolling cards" shape: search "sticky left intro
 * horizontal scrolling cards" -> Horizontal Scroll Carousel (uniquesonu,
 * id 4136, framer-motion `useScroll`/`useTransform` pinning the whole
 * section and scrubbing cards across — scroll-jacked, no sticky *intro*
 * column, and framer-motion is off-limits in this codebase), Sticky
 * scroll cards section (thanh, id 5187, IntersectionObserver fades but
 * the "sticky" element is each vertically-stacked card, not a side intro
 * — different shape entirely), Smooth Scroll (ui-layouts, id 2836,
 * Lenis-driven smooth scroll, same non-native-scroll dependency issue).
 * Search "press articles cards" -> Stacked Article Cards (Mazyar kawa,
 * id 10393), Article Cards (kavikatiyar, id 8222), Card (ravikatiyar,
 * id 7456) — all plain vertical article grids, none pair a sticky intro
 * with a horizontal card rail. Nothing fit, so this is hand-built: a
 * `lg:sticky` intro column (the same sticky-on-scroll idea as the
 * original component, restyled) beside a native `overflow-x-auto`
 * snap-scroll row of cards. No GSAP pin/scrub is used for the scroll
 * itself, so there is no scroll-jacking and no separate reduced-motion
 * layout branch is needed — the rail is always plain, native horizontal
 * scroll (trackpad, wheel+shift, touch swipe, or the visible scrollbar).
 * `Reveal` staggers each card's fade/rise in as the section enters the
 * viewport (and, per `Reveal`/`useReveal`, is skipped entirely under
 * `prefers-reduced-motion`, leaving the fully visible static markup).
 */
export function Publications() {
  return (
    <Section id="publications" bg="ink">
      <div className="col-span-12 grid gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
        {/* Sticky intro */}
        <Reveal as="div" y={24} className="lg:sticky lg:top-28 lg:h-fit">
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

        {/* Press cards — a clean vertical stack on mobile/tablet (every card
            fully visible, nothing clipped), becoming the signature horizontal
            snap-scroll rail beside the sticky intro at lg. */}
        <div className="min-w-0">
          <div
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
