import Image from "next/image";
import { Building2, Landmark, BarChart3, LineChart } from "lucide-react";
import { ArrowRight } from "@/components/icons";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { SOLUTIONS } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { SolutionCard } from "@/types";

const ICONS = {
  setup: Building2,
  banking: Landmark,
  finance: BarChart3,
  investment: LineChart,
} as const;

const TRUST_AVATARS = [
  "/images/photo-2.jpg",
  "/images/mission-team.jpg",
  "/images/values-meeting.jpg",
];

/** Hover-lift + entrance styling shared by every bento cell. */
const HOVER_LIFT =
  "h-full transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

function SolutionTile({
  item,
  delay,
  className,
}: {
  item: SolutionCard;
  delay: number;
  className?: string;
}) {
  const Icon = ICONS[item.icon];
  return (
    <Reveal as="div" y={24} delay={delay} className={cn("h-full", className)}>
      <div
        className={cn(
          HOVER_LIFT,
          "rounded-[20px] border border-as-line bg-as-canvas p-8"
        )}
      >
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-as-red/50 text-as-red">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <h3 className="font-display mb-3 text-xl text-as-ink sm:text-2xl">
          {item.title}
        </h3>
        <p className="text-[15px] leading-relaxed text-as-muted">{item.description}</p>
      </div>
    </Reveal>
  );
}

/**
 * Solutions — a bento grid beneath the Mission editorial split. Layout
 * structure (colSpan-driven cells, hover-lift, icon chip) borrowed from
 * 21st.dev "Bento Grid" (kokonutd, id 622) and re-themed to the brand's
 * ink/canvas tokens with hairline `border-as-line` cards instead of the
 * source's gradient-glow dark cards; the entrance/hover split (GSAP `Reveal`
 * on an outer wrapper, plain CSS transform on an inner div) follows the
 * pattern established in `Mission.tsx` so GSAP's inline transform never
 * fights the CSS `:hover` transform on the same element.
 *
 * The bento reads, in DOM/reveal order: a tall ink "highlight" card
 * (graph-card.png, spanning 5 cols / 2 rows — the section's one non-canvas
 * card) beside the four solution cards (4/3/4/3 col split across two rows
 * filling the remaining 7 columns), closed by a full-width trust strip with
 * the avatar cluster and an animated `Counter`.
 */
export function Solutions() {
  return (
    <Section id="solutions" bg="canvas">
      <Reveal as="div" y={28} className="col-span-12 lg:col-span-8">
        <Eyebrow>Our Solutions</Eyebrow>
        <h2 className="font-display mt-6 max-w-2xl text-[32px] leading-[1.1] tracking-[-0.03em] text-as-ink sm:text-[44px]">
          Solutions designed to meet the unique state of your business.
        </h2>
      </Reveal>

      <div className="col-span-12 mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        {/* Graph card — the section's one ink highlight; tall, spans 2 rows. */}
        <Reveal
          as="div"
          y={24}
          className="sm:col-span-2 lg:col-span-5 lg:row-span-2"
        >
          <div
            className={cn(
              HOVER_LIFT,
              "group relative flex min-h-[320px] flex-col overflow-hidden rounded-[20px] border border-as-ink bg-as-ink p-8 lg:p-10"
            )}
          >
            {/* Copy pinned to the top of the card. */}
            <div className="relative z-10">
              <Eyebrow>Let&apos;s talk</Eyebrow>
              <h3 className="font-display mt-5 max-w-[16ch] text-2xl leading-[1.15] text-white sm:text-[28px]">
                Let&apos;s map your structure.
              </h3>
              <p className="mt-4 max-w-[26ch] text-[15px] leading-relaxed text-white/60">
                Tell us where you want to go — we&apos;ll design the UAE setup around it.
              </p>
              <a
                href="#collaborate"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 font-sans text-[15px] font-semibold text-as-ink transition-colors hover:bg-white/90"
              >
                Get in Touch <ArrowRight className="h-4 w-4 text-as-red" />
              </a>
            </div>

            {/* Growth-graph motif fills all remaining height (flex-1) so the
                tall row-spanning card never leaves an empty void. */}
            <div className="relative -mx-8 -mb-8 mt-8 min-h-[150px] flex-1 lg:-mx-10 lg:-mb-10">
              <Image
                src="/images/graph-card.png"
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="select-none object-cover object-bottom opacity-70 transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-as-ink via-transparent to-transparent" />
            </div>
          </div>
        </Reveal>

        <SolutionTile item={SOLUTIONS[0]} delay={0.08} className="lg:col-span-4" />
        <SolutionTile item={SOLUTIONS[1]} delay={0.16} className="lg:col-span-3" />
        <SolutionTile item={SOLUTIONS[2]} delay={0.24} className="lg:col-span-4" />
        <SolutionTile item={SOLUTIONS[3]} delay={0.32} className="lg:col-span-3" />

        {/* Trust strip — full width, closes the grid. */}
        <Reveal as="div" y={20} delay={0.4} className="sm:col-span-2 lg:col-span-12">
          <div
            className={cn(
              HOVER_LIFT,
              "flex flex-col items-start gap-6 rounded-[20px] border border-as-line bg-as-canvas p-8 sm:flex-row sm:items-center sm:justify-between"
            )}
          >
            <div className="flex items-center gap-5">
              <div className="flex -space-x-3">
                {TRUST_AVATARS.map((src) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full border-2 border-as-canvas object-cover"
                  />
                ))}
              </div>
              <div>
                <p className="font-display text-3xl text-as-ink sm:text-4xl">
                  <Counter to={200} suffix="+" />
                </p>
                <p className="text-[15px] text-as-muted">businesses trust our services</p>
              </div>
            </div>
            <a
              href="#collaborate"
              className="inline-flex items-center gap-2 rounded-full bg-as-ink px-7 py-3.5 font-sans text-[15px] font-semibold text-white transition-colors hover:bg-as-red"
            >
              Get in Touch <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal
        as="div"
        y={20}
        delay={0.48}
        className="col-span-12 mt-14 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between"
      >
        <p className="max-w-3xl text-lg text-as-muted">
          From simple UAE Free-Zones to complex multi-jurisdictional business
          structures, we help you legally minimize your tax liability &amp; protect
          your wealth for generations to come.
        </p>
        <a
          href="#collaborate"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-as-ink px-7 py-3.5 font-sans text-[15px] font-semibold text-white transition-colors hover:bg-as-red"
        >
          Get in Touch
        </a>
      </Reveal>
    </Section>
  );
}
