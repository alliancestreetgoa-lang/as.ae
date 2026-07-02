interface Stat {
  value: string;
  label: string;
}

const DEFAULT_STATS: Stat[] = [
  { value: "200+", label: "Business Structures built" },
  { value: "20+", label: "Tax Lawyers & Strategists" },
  { value: "17+", label: "Years in Business" },
];

/** Three big red-accented stats, used across sub-pages. */
export function Stats3({ stats = DEFAULT_STATS }: { stats?: Stat[] }) {
  return (
    <section className="bg-white py-20">
      <div className="as-container grid gap-10 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-[76px] font-semibold leading-none tracking-[-0.04em] text-black">
              {s.value.replace("+", "")}
              <span className="text-as-red">+</span>
            </p>
            <p className="mt-3 text-lg text-as-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
