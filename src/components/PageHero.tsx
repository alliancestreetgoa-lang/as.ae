import Link from "next/link";
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
}: {
  title: string;
  subtitle: string;
  cta?: string;
  ctaHref?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-as-ink pt-[82px]">
      {/* dark globe glow rising from the bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center">
        <div className="h-[600px] w-[1100px] translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(226,46,52,0.35),rgba(226,46,52,0.05)_40%,transparent_70%)]" />
      </div>

      <div className="as-container relative z-10 flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <Reveal
          as="h1"
          y={28}
          className="font-display max-w-4xl text-[52px] leading-[1.05] tracking-[-0.04em] text-white sm:text-[72px] lg:text-[88px]"
        >
          {title}
        </Reveal>
        <Reveal
          as="p"
          y={22}
          delay={0.1}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60"
        >
          {subtitle}
        </Reveal>
        <Reveal as="div" y={18} delay={0.2} className="mt-10">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-as-red px-7 py-3.5 font-sans text-[15px] font-semibold text-white transition-colors hover:bg-as-red-bright"
          >
            {cta}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
