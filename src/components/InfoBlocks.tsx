import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

export interface InfoBlock {
  heading: string;
  body: string;
}

/**
 * InfoBlocks — eyebrow + lead heading + stacked info blocks (banking "Good
 * Ol' Times" section). Re-themed onto `Section`/`Eyebrow`/`Reveal`; each
 * block gets a hairline `border-as-line` divider and a small red numbered
 * tick (the same numbered-list motif established in `Values.tsx`) instead of
 * the plain `border-black/10` rule.
 */
export function InfoBlocks({
  eyebrow,
  title,
  blocks,
}: {
  eyebrow: string;
  title: string;
  blocks: InfoBlock[];
}) {
  return (
    <Section bg="canvas">
      <Reveal as="div" y={28} className="col-span-12">
        <Eyebrow>{eyebrow}</Eyebrow>
        <SplitReveal
          as="h2"
          text={title}
          className="font-display mt-6 max-w-4xl text-[32px] leading-[1.15] tracking-[-0.03em] text-as-ink sm:text-[44px]"
        />
      </Reveal>

      <div className="col-span-12 mt-14 grid gap-12 md:grid-cols-3">
        {blocks.map((b, i) => (
          <Reveal
            as="div"
            y={24}
            delay={0.08 * i}
            key={b.heading}
            className="border-t border-as-line pt-6 transition-colors duration-300 hover:border-as-red/60"
          >
            <span aria-hidden="true" className="font-mono text-xs tabular-nums text-as-red">
              0{i + 1}
            </span>
            <h3 className="font-display mt-3 text-2xl text-as-ink">{b.heading}</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-as-muted">{b.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
