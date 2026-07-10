import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ORBIT_AVATARS } from "@/lib/content";

// Two concentric rings, three avatars each, evenly spaced 120deg apart.
// Positions are percentages of each ring container's own box (a square),
// so the circular trig math holds at any breakpoint without recalculating.
function ringPositions(radiusPct: number, startDeg: number) {
  return [0, 120, 240].map((offset) => {
    const rad = ((startDeg + offset) * Math.PI) / 180;
    return {
      top: `${50 + radiusPct * Math.sin(rad)}%`,
      left: `${50 + radiusPct * Math.cos(rad)}%`,
    };
  });
}

const OUTER_RING = ringPositions(46, -90).map((pos, i) => ({
  ...pos,
  src: ORBIT_AVATARS[i * 2],
}));

const INNER_RING = ringPositions(48, -30).map((pos, i) => ({
  ...pos,
  src: ORBIT_AVATARS[i * 2 + 1],
}));

// Fixed trust badges, pinned in place while the avatars orbit around them.
const BADGES = [
  { src: "/images/icon-lock.svg", top: "32%", left: "50%" },
  { src: "/images/graph-new.svg", top: "68%", left: "68%" },
  { src: "/images/icon-layers.svg", top: "70%", left: "28%" },
];

/**
 * Collaborate — the homepage's closing CTA: a centered Fraunces headline
 * and red pill button over a dark `bg-as-ink` field (the strongest
 * contrast on the page, matching Hero/StatsBanner/Publications' ink
 * treatment), with an orbital-avatars graphic beneath it built from the
 * unchanged `orbit-1..6` images and trust badge icons.
 *
 * 21st.dev source: "orbiting avatars circle animation CTA" ->
 * Orbiting Avatars CTA (ravikatiyar, id 7830) is the closest structural
 * match — a centered CTA with a single rotating container of avatars,
 * each counter-rotated to stay upright — and it's pure CSS `@keyframes`
 * (no framer-motion), so no rewrite was needed to satisfy the "no
 * framer-motion" constraint. Adapted rather than installed verbatim:
 * split into two independently-rotating rings (3 avatars each, opposite
 * directions) instead of one ring of 6, for the "concentric rings" shape
 * the brief calls for; re-themed off shadcn `Button`/plain `<img>` onto
 * this repo's red pill CTA + `next/image` (basePath-safe) conventions;
 * swapped the source's inline `<style>` keyframe injection for
 * `as-orbit`/`as-orbit-reverse` keyframes in `globals.css` so Tailwind's
 * `motion-reduce:[animation:none]` variant can win over the animation
 * (an inline `style.animation` can't be overridden by a media-query
 * class, since inline styles always outrank stylesheet rules).
 *
 * Positions switched from the pre-redesign version's fixed-px ellipse
 * layout to percentage offsets on a perfectly square container: rotating
 * a non-square (elliptical) box with CSS `rotate()` visibly tips the
 * whole oval as it spins, which reads as a wobble rather than a clean
 * orbit — a true circle rotates as a rigid shape with no visible skew.
 */
export function Collaborate() {
  return (
    <Section id="collaborate" bg="ink" className="overflow-hidden">
      {/* Ambient red glow, consistent with Hero's ink-section treatment */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(226,46,52,0.35)_0%,rgba(226,46,52,0.1)_45%,transparent_72%)] blur-2xl"
      />

      <Reveal
        as="div"
        y={24}
        className="relative z-10 col-span-12 flex flex-col items-center text-center"
      >
        <Eyebrow>Let&apos;s collaborate</Eyebrow>
        <h2 className="font-display mt-6 max-w-2xl text-[40px] leading-[1.05] tracking-[-0.03em] text-white sm:text-[56px] lg:text-[64px]">
          Go where you&apos;re treated best.
        </h2>
        <Link
          href="/contact-us"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-as-red px-7 py-3.5 font-sans text-[15px] font-semibold text-white transition-colors hover:bg-as-red-bright"
        >
          Get in Touch
        </Link>
      </Reveal>

      {/* Orbit graphic */}
      <Reveal
        as="div"
        y={24}
        delay={0.15}
        className="relative z-10 col-span-12 mx-auto mt-16 aspect-square w-full max-w-[320px] sm:mt-20 sm:max-w-[440px] lg:max-w-[520px]"
      >
        {/* concentric rings */}
        <div className="pointer-events-none absolute inset-0 rounded-full border border-dashed border-as-red/20" />
        <div className="pointer-events-none absolute inset-[18%] rounded-full border border-dashed border-as-red/25" />

        {/* outer ring: orbit-1, orbit-3, orbit-5 */}
        <div className="absolute inset-0 animate-[as-orbit_70s_linear_infinite] motion-reduce:[animation:none]">
          {OUTER_RING.map((avatar, idx) => (
            <div
              key={avatar.src}
              className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 sm:h-20 sm:w-20"
              style={{ top: avatar.top, left: avatar.left }}
            >
              <div className="h-full w-full animate-[as-orbit-reverse_70s_linear_infinite] overflow-hidden rounded-full shadow-lg ring-1 ring-white/10 motion-reduce:[animation:none]">
                <Image
                  src={avatar.src}
                  alt={`Collaborator ${idx * 2 + 1}`}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* inner ring: orbit-2, orbit-4, orbit-6, opposite direction */}
        <div className="absolute inset-[18%] animate-[as-orbit-reverse_55s_linear_infinite] motion-reduce:[animation:none]">
          {INNER_RING.map((avatar, idx) => (
            <div
              key={avatar.src}
              className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 sm:h-16 sm:w-16"
              style={{ top: avatar.top, left: avatar.left }}
            >
              <div className="h-full w-full animate-[as-orbit_55s_linear_infinite] overflow-hidden rounded-full shadow-lg ring-1 ring-white/10 motion-reduce:[animation:none]">
                <Image
                  src={avatar.src}
                  alt={`Collaborator ${idx * 2 + 2}`}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* trust badges, pinned in place */}
        {BADGES.map((badge) => (
          <div
            key={badge.src}
            className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg sm:h-12 sm:w-12"
            style={{ top: badge.top, left: badge.left }}
          >
            <Image src={badge.src} alt="" width={20} height={20} className="h-5 w-5" />
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
