import Image from "next/image";
import { PRESS_LOGOS } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

// Number of adjacent duplicate tracks laid side by side for the marquee
// loop. 4 copies of the 5-logo set comfortably out-spans the widest
// desktop viewport before the loop needs to repeat, so the seam is never
// visible mid-scroll.
const MARQUEE_REPEAT = 4;

/**
 * AsSeenIn — the site's one deliberate large-red *moment*: a full-bleed
 * gradient band (as-red -> as-red-bright) carrying an infinite marquee of
 * press logos. Every other section keeps red to a hairline accent; here
 * red is the field itself, and the (already white/light-colored) press
 * logos run across it.
 *
 * 21st.dev sourcing: searched "logo marquee infinite scroll" (--type c
 * --limit 6) -> Marquee (aliimam, id 4365), Marquee (tom_ui, id 10277),
 * Infinite Text Marquee (hextaui, id 1944). Used **id 4365** as the
 * structural basis: N adjacent duplicate `<div>` tracks, each animated
 * with an identical `translateX(0) -> translateX(-100% - gap)` loop, so
 * consecutive tracks hand off to each other with no visible seam, plus a
 * `group`/`group-hover:[animation-play-state:paused]` pause-on-hover. It
 * has no framer-motion dependency. Its own `animate-marquee` utility class
 * depends on a Tailwind `tailwind.config` keyframe definition this
 * project doesn't have (Tailwind v4 here is CSS-first, no config file), so
 * that part was hand-adapted: the same keyframe logic is declared as
 * `as-marquee` in `globals.css` and applied via the arbitrary-value
 * `animate-[as-marquee_36s_linear_infinite]` utility, mirroring the
 * pattern already established for Collaborate's orbit rings (Task 14).
 *
 * Reduced motion: `motion-reduce:[animation:none]` stops the loop, and the
 * clipping wrapper swaps `overflow-x-hidden` for
 * `motion-reduce:overflow-x-auto` (the brief's own suggested fallback) so
 * the now-static row of logos becomes a scrollable strip instead of one
 * clipped at the viewport edge -- every logo stays reachable even on
 * narrow viewports. The edge-fade mask is disabled too
 * (`motion-reduce:[mask-image:none]`) so nothing reads as artificially
 * dimmed while scrolling through it. Only the first (real) track is
 * exposed to assistive tech; the duplicate tracks that exist purely to
 * fill out the loop are `aria-hidden`.
 */
export function AsSeenIn() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-as-red via-as-red to-as-red-bright py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.14),transparent_60%)]"
      />

      <Reveal as="div" y={16} className="relative z-10">
        <p className="mb-10 flex items-center justify-center gap-3 text-center font-mono text-xs uppercase tracking-[0.3em] text-white/80 sm:text-sm">
          <span aria-hidden="true" className="inline-block h-px w-6 bg-white/50" />
          As Seen In:
          <span aria-hidden="true" className="inline-block h-px w-6 bg-white/50" />
        </p>

        <div
          className="group flex [--as-marquee-gap:4rem] [gap:var(--as-marquee-gap)] overflow-x-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]"
        >
          {Array.from({ length: MARQUEE_REPEAT }).map((_, i) => (
            <div
              key={i}
              aria-hidden={i > 0}
              className="flex shrink-0 items-center [gap:var(--as-marquee-gap)] animate-[as-marquee_36s_linear_infinite] motion-reduce:[animation:none] group-hover:[animation-play-state:paused]"
            >
              {PRESS_LOGOS.map((logo) => (
                <Image
                  key={logo.name}
                  src={logo.src}
                  alt={i === 0 ? logo.name : ""}
                  width={logo.width}
                  height={48}
                  className="h-8 w-auto shrink-0 object-contain opacity-90 transition-opacity sm:h-10"
                />
              ))}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
