import Image from "next/image";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Frame } from "@/components/primitives/Frame";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";

/**
 * Mission — an editorial split beneath the ink Hero: the mission statement
 * (unchanged copy, now set in Fraunces) on the left, the team thumbnail on
 * the right inside the brand's corner-bracket `Frame`. `bg-as-canvas` gives
 * a clean dark (Hero) -> light (Mission) transition down the page.
 *
 * Structural cue (thumbnail hover-scale + gradient scrim under a centered
 * play button) borrowed from 21st.dev "Video Thumbnail Player"
 * (ravikatiyar, id 4586) — re-themed to the `Frame` primitive instead of a
 * plain rounded box, hand-built with a CSS transition (no framer-motion in
 * the source anyway).
 */
export function Mission() {
  return (
    <Section bg="canvas">
      <Reveal as="div" y={28} className="col-span-12 lg:col-span-7 lg:self-center">
        <Eyebrow>Our Mission</Eyebrow>
        <h2 className="font-display mt-6 max-w-xl text-[34px] leading-[1.15] tracking-[-0.03em] text-as-ink sm:text-[46px] lg:text-[54px]">
          <span>Our mission is to </span>
          <span className="bg-gradient-to-r from-as-ink to-as-red bg-clip-text text-transparent">
            help businesses
          </span>
          <span className="text-as-muted">
            {" "}
            earn more and keep what they deserve - which is everything.
          </span>
        </h2>
      </Reveal>

      <Reveal
        as="div"
        y={28}
        delay={0.15}
        className="col-span-12 mt-14 lg:col-span-5 lg:mt-0 lg:self-center"
      >
        <Frame tone="red" className="mx-auto w-full max-w-[420px] lg:max-w-none">
          <div className="group relative overflow-hidden rounded-[18px]">
            <Parallax className="aspect-[3/2]" amount={50}>
              <Image
                src="/images/mission-team-homepage.jpg"
                alt="The Alliance Street team"
                fill
                sizes="(min-width: 1024px) 460px, 420px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </Parallax>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <button
              type="button"
              aria-label="Play video"
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 backdrop-blur transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            >
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-as-ink">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </Frame>
      </Reveal>
    </Section>
  );
}
