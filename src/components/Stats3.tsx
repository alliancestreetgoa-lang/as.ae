import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { cn } from "@/lib/utils";

interface Stat {
  value: string;
  label: string;
}

const DEFAULT_STATS: Stat[] = [
  { value: "200+", label: "Business Structures built" },
  { value: "20+", label: "Tax Lawyers & Strategists" },
  { value: "17+", label: "Years in Business" },
];

/**
 * Stats3 — three big stats, used across sub-pages. Re-themed onto `Section`
 * with an animated `Counter` per stat (same `font-display` size/weight and
 * `as-ink` number color as the homepage's `Process.tsx` stats row, which
 * shares this exact data set) instead of the old static number with a
 * separately-colored red "+".
 */
export function Stats3({ stats = DEFAULT_STATS }: { stats?: Stat[] }) {
  return (
    <Section bg="canvas">
      <div
        className={cn(
          "col-span-12 grid gap-10",
          stats.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"
        )}
      >
        {stats.map((s, i) => {
          const numeric = parseInt(s.value.replace(/[^\d]/g, ""), 10) || 0;
          const suffix = s.value.replace(/^[\d,]+/, "");
          return (
            <Reveal as="div" y={24} scale={0.9} delay={0.08 * i} key={s.label}>
              <p className="font-display text-[56px] leading-none tracking-[-0.03em] text-as-ink sm:text-[72px]">
                <Counter to={numeric} suffix={suffix} />
              </p>
              <p className="mt-3 text-lg text-as-muted">{s.label}</p>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
