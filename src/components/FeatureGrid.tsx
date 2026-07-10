import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";

export interface Feature {
  heading: string;
  body: string;
}

/**
 * FeatureGrid — eyebrow + lead heading + grid of feature cards
 * (financial-services funding section). Re-themed onto
 * `Section`/`Eyebrow`/`Reveal`, matching the numbered hairline-divider
 * treatment used in the sibling `InfoBlocks` primitive.
 */
export function FeatureGrid({
  eyebrow,
  title,
  features,
}: {
  eyebrow: string;
  title: string;
  features: Feature[];
}) {
  return (
    <Section bg="canvas">
      <Reveal as="div" y={28} className="col-span-12">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="font-display mt-6 max-w-3xl text-[32px] leading-[1.15] tracking-[-0.03em] text-as-ink sm:text-[44px]">
          {title}
        </h2>
      </Reveal>

      <div className="col-span-12 mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal
            as="div"
            y={24}
            delay={0.06 * i}
            key={f.heading}
            className="border-t border-as-line pt-6 transition-colors duration-300 hover:border-as-red/60"
          >
            <span aria-hidden="true" className="font-mono text-xs tabular-nums text-as-red">
              0{i + 1}
            </span>
            <h3 className="font-display mt-3 text-xl text-as-ink">{f.heading}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-as-muted">{f.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
