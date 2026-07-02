export interface Feature {
  heading: string;
  body: string;
}

/** Eyebrow + lead heading + grid of feature cards (financial-services funding section). */
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
    <section className="bg-white py-24">
      <div className="as-container">
        <p className="as-eyebrow mb-6">{eyebrow}</p>
        <h2 className="mb-16 max-w-3xl text-[32px] leading-[1.15] tracking-[-0.03em] sm:text-[44px]">
          {title}
        </h2>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.heading} className="border-t border-black/10 pt-6">
              <h3 className="mb-3 text-xl font-semibold text-black">{f.heading}</h3>
              <p className="text-[15px] leading-relaxed text-as-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
