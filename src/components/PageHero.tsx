import { Button } from "@/components/primitives/Button";
import { Globe } from "@/components/Globe";
import { Reveal } from "@/components/motion/Reveal";

/**
 * PageHero — centered dark hero used across sub-pages ("Are you next?"
 * style). Re-themed onto `bg-as-ink` with the same red radial glow (already
 * on-brand — the glow's `rgba(226,46,52,…)` is the `as-red` value), Fraunces
 * headline, and the staggered `Reveal` load-in established in `Hero.tsx`.
 * The CTA switches from the old plain white pill to the brand's red pill
 * (matches `Hero.tsx`'s "Let's talk" button) since this hero sits on the same
 * dark `as-ink` canvas.
 */
export function PageHero({
  title,
  subtitle,
  cta = "Get in Touch",
  ctaHref = "/contact-us",
  globe = false,
}: {
  title: string;
  subtitle: string;
  cta?: string;
  ctaHref?: string;
  globe?: boolean;
}) {
  // The globe hero keeps its dramatic dark field (the globe is designed for
  // it); text-only heroes sit on the site's white canvas.
  const dark = globe;
  return (
    <section
      className={`relative isolate overflow-hidden pt-[82px] ${
        dark ? "bg-as-ink" : "bg-as-canvas"
      }`}
    >
      {/* Decorative WebGL globe rising from the bottom-centre (behind the copy). */}
      {globe && (
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 aspect-square w-[min(1180px,155vw)] -translate-x-1/2 translate-y-[46%]">
          <Globe />
        </div>
      )}

      {/* Warm red atmospheric glow rising from the bottom (softer on white). */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center">
        <div
          className={`h-[600px] w-[1100px] translate-y-1/2 rounded-full ${
            dark
              ? "bg-[radial-gradient(circle_at_50%_0%,rgba(226,46,52,0.35),rgba(226,46,52,0.05)_40%,transparent_70%)]"
              : "bg-[radial-gradient(circle_at_50%_0%,rgba(226,46,52,0.14),rgba(226,46,52,0.04)_40%,transparent_70%)]"
          }`}
        />
      </div>

      {/* Scrim keeps the hero copy legible over the (now brighter) globe —
          only the top band behind the headline is darkened; the lower globe
          stays bright. */}
      {globe && (
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-as-ink via-as-ink/20 to-transparent" />
      )}

      <div className="as-container relative z-10 flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <Reveal
          as="h1"
          y={28}
          className={`font-display max-w-4xl text-[52px] leading-[1.05] tracking-[-0.04em] sm:text-[72px] lg:text-[88px] ${
            dark ? "text-white" : "text-as-ink"
          }`}
        >
          {title}
        </Reveal>
        <Reveal
          as="p"
          y={22}
          delay={0.1}
          className={`mt-8 max-w-2xl text-lg leading-relaxed ${
            dark ? "text-white/60" : "text-as-muted"
          }`}
        >
          {subtitle}
        </Reveal>
        <Reveal as="div" y={18} delay={0.2} className="mt-10">
          <Button href={ctaHref} variant="primary">
            {cta}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
