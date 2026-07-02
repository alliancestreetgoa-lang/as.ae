export interface InfoBlock {
  heading: string;
  body: string;
}

/** Eyebrow + lead heading + stacked info blocks (banking "Good Ol' Times" section). */
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
    <section className="bg-white py-24">
      <div className="as-container">
        <p className="as-eyebrow mb-6">{eyebrow}</p>
        <h2 className="mb-16 max-w-4xl text-[32px] leading-[1.15] tracking-[-0.03em] sm:text-[44px]">
          {title}
        </h2>

        <div className="grid gap-12 md:grid-cols-3">
          {blocks.map((b) => (
            <div key={b.heading} className="border-t border-black/10 pt-6">
              <h3 className="mb-4 text-2xl font-semibold text-black">{b.heading}</h3>
              <p className="text-[15px] leading-relaxed text-as-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
