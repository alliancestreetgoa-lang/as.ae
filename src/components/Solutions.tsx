import Image from "next/image";
import Link from "next/link";
import { Building2, Landmark, BarChart3, LineChart } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Section } from "@/components/primitives/Section";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
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

/** Hover-lift + brand glow shared by every bento cell (see `.card-lift`). */
const HOVER_LIFT = "card-lift h-full";

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
    <Reveal as="div" y={24} scale={0.96} delay={delay} className={cn("h-full", className)}>
      <Link
        href={item.href}
        className={cn(
          HOVER_LIFT,
          "group block rounded-[20px] border border-as-line bg-as-canvas p-8 hover:border-as-red/40"
        )}
      >
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-as-red/50 text-as-red transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <h3 className="font-display mb-3 text-xl text-as-ink sm:text-2xl">
          {item.title}
        </h3>
        <p className="text-[15px] leading-relaxed text-as-muted">{item.description}</p>
      </Link>
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
        <SplitReveal
          as="h2"
          text="Solutions designed to meet the unique state of your business."
          className="font-display mt-6 max-w-2xl text-[32px] leading-[1.1] tracking-[-0.03em] text-as-ink sm:text-[44px]"
        />
      </Reveal>

      <div className="col-span-12 mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        {/* Graph card — the section's one ink highlight; tall, spans 2 rows. */}
        <Reveal
          as="div"
          y={24}
          className="sm:col-span-2 lg:col-span-5 lg:row-span-2"
        >
          <GlowCard
            tone="light"
            className="group flex h-full min-h-[320px] flex-col justify-center rounded-[20px] border border-as-red/20 bg-as-red/[0.03] p-8 hover:border-as-red/40 lg:p-10"
          >
            {/* Copy pinned to the top of the card. */}
            <div className="relative z-10">
              <Eyebrow>Let&apos;s talk</Eyebrow>
              <h3 className="font-display mt-5 max-w-[16ch] text-2xl leading-[1.15] text-as-ink sm:text-[28px]">
                Let&apos;s map your structure.
              </h3>
              <p className="mt-4 max-w-[26ch] text-[15px] leading-relaxed text-as-muted">
                Tell us where you want to go — we&apos;ll design the UAE setup around it.
              </p>
              <Button
                href="#collaborate"
                variant="primary"
                arrow
                className="mt-8 w-fit"
                track={{
                  name: "consultation_cta_click",
                  params: { cta_label: "Get in Touch", location: "solutions_primary_card" },
                }}
              >
                Get in Touch
              </Button>
            </div>
          </GlowCard>
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
              "flex flex-col items-start gap-6 rounded-[20px] border border-as-line bg-as-canvas p-8 hover:border-as-red/40 sm:flex-row sm:items-center sm:justify-between"
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
            <Button
              href="#collaborate"
              variant="ink"
              arrow
              track={{
                name: "consultation_cta_click",
                params: { cta_label: "Get in Touch", location: "solutions_trust_strip" },
              }}
            >
              Get in Touch
            </Button>
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
        <Button
          href="#collaborate"
          variant="ink"
          className="shrink-0"
          track={{
            name: "consultation_cta_click",
            params: { cta_label: "Get in Touch", location: "solutions_closing" },
          }}
        >
          Get in Touch
        </Button>
      </Reveal>
    </Section>
  );
}
