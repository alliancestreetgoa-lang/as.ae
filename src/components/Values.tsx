import Image from "next/image";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Frame } from "@/components/primitives/Frame";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { VALUES } from "@/lib/content";

/**
 * Values — an editorial split closing out the light/dark rhythm after the
 * ink `StatsBanner`: `bg-as-canvas` resets the page to light, then the team
 * photo (in the brand's corner-bracket `Frame`) sits opposite a hairline
 * numbered list of the three values (unchanged copy from `VALUES` in
 * `src/lib/content.ts`).
 *
 * 21st.dev was checked first ("values feature list with image editorial
 * split" -> "Feature with image", tommyjepsen, id 1337; "Feature Sections",
 * prebuiltui, id 7194) but both results are single-feature or card-grid
 * blocks with no ruled/numbered list structure, so the list itself is
 * hand-built; only the overall "image beside copy" split direction carries
 * over, already established in `Mission.tsx`.
 *
 * Each row is its own `Reveal` (increasing delay) so the three values
 * stagger in one after another rather than arriving as a single block; the
 * index digit is the section's only red accent besides the `Eyebrow`.
 */
export function Values() {
  return (
    <Section bg="canvas">
      <Reveal
        as="div"
        y={28}
        className="col-span-12 lg:col-span-5 lg:self-center"
      >
        <Frame tone="red" className="mx-auto w-full max-w-[480px] lg:max-w-none">
          <Parallax className="aspect-[5/6] rounded-[18px]" amount={70}>
            <Image
              src="/images/values-stallone.jpg"
              alt="Alliance Street team in a meeting"
              fill
              sizes="(min-width: 1024px) 480px, 480px"
              className="object-cover"
            />
          </Parallax>
        </Frame>
      </Reveal>

      <div className="col-span-12 mt-14 lg:col-span-7 lg:mt-0 lg:self-center lg:pl-8">
        <Reveal as="div" y={28} delay={0.08}>
          <Eyebrow>Our Values</Eyebrow>
          <h2 className="font-display mt-6 max-w-xl text-[34px] leading-[1.1] tracking-[-0.03em] text-as-ink sm:text-[46px]">
            Our values are the foundation of everything we do.
          </h2>
        </Reveal>

        <ol className="mt-12 divide-y divide-as-line border-t border-as-line">
          {VALUES.map((v, i) => (
            <Reveal
              as="li"
              y={24}
              delay={0.2 + i * 0.12}
              key={v.title}
              className="flex gap-6 py-8 sm:gap-8"
            >
              <span
                aria-hidden="true"
                className="font-display shrink-0 pt-1 text-sm tabular-nums text-as-red"
              >
                0{i + 1}
              </span>
              <div>
                <h3 className="font-display text-xl text-as-ink sm:text-2xl">
                  {v.title}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-as-muted">
                  {v.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
