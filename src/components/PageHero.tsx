import { Button } from "@/components/primitives/Button";
import { Globe } from "@/components/Globe";
import { Reveal } from "@/components/motion/Reveal";

/**
 * PageHero — centered light hero used across sub-pages ("Are you next?"
 * style): a white field with a soft red radial glow, an optional light
 * "dotted globe" rising from the bottom (red Dubai marker), the Fraunces
 * headline and the staggered `Reveal` load-in established in `Hero.tsx`.
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
  return (
    <section className="relative isolate overflow-hidden bg-as-canvas pt-[82px]">
      {/* Decorative light WebGL globe rising from the bottom-centre. */}
      {globe && (
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 aspect-square w-[min(1180px,155vw)] -translate-x-1/2 translate-y-[46%]">
          <Globe light />
        </div>
      )}

      {/* Soft red atmospheric glow rising from the bottom. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center">
        <div className="h-[600px] w-[1100px] translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(226,46,52,0.14),rgba(226,46,52,0.04)_40%,transparent_70%)]" />
      </div>

      {/* White scrim so the headline stays crisp over the globe. */}
      {globe && (
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-as-canvas via-as-canvas/50 to-transparent" />
      )}

      <div className="as-container relative z-10 flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <Reveal
          as="h1"
          y={28}
          className="font-display max-w-4xl text-[52px] leading-[1.05] tracking-[-0.04em] text-as-ink sm:text-[72px] lg:text-[88px]"
        >
          {title}
        </Reveal>
        <Reveal
          as="p"
          y={22}
          delay={0.1}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-as-muted"
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
