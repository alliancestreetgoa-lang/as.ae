import Image from "next/image";
import { Building2, Landmark, BarChart3, LineChart } from "lucide-react";
import { ArrowRight } from "@/components/icons";
import { SOLUTIONS } from "@/lib/content";
import type { SolutionCard } from "@/types";

const ICONS = {
  setup: Building2,
  banking: Landmark,
  finance: BarChart3,
  investment: LineChart,
} as const;

function Card({ item }: { item: SolutionCard }) {
  const Icon = ICONS[item.icon];
  return (
    <div className="relative">
      <span className="as-red-shadow" />
      <div className="relative z-10 h-full rounded-[20px] border border-black/5 bg-white p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-as-red/60">
          <Icon className="h-6 w-6 text-as-ink" strokeWidth={1.75} />
        </div>
        <h3 className="mb-3 text-2xl font-semibold text-black">{item.title}</h3>
        <p className="text-[15px] leading-relaxed text-as-muted">{item.description}</p>
      </div>
    </div>
  );
}

export function Solutions() {
  return (
    <section id="solutions" className="bg-white py-24">
      <div className="as-container">
        <p className="as-eyebrow mb-6">
          OUR <span className="accent">SOLUTIONS</span>
        </p>
        <h2 className="mb-14 max-w-2xl text-[34px] leading-[1.1] sm:text-[44px]">
          Solutions designed to meet the unique state of your business.
        </h2>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 2x2 cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
            {SOLUTIONS.map((item) => (
              <Card key={item.title} item={item} />
            ))}
          </div>

          {/* Right column: graph card + trust card */}
          <div className="flex flex-col gap-6">
            <div className="relative flex-1 overflow-hidden rounded-[20px] bg-as-ink p-6">
              <a
                href="#collaborate"
                className="inline-flex items-center gap-2 font-semibold text-white"
              >
                Get in Touch <ArrowRight className="h-4 w-4 text-as-red" />
              </a>
              <Image
                src="/images/graph-card.png"
                alt="Growth graph"
                width={520}
                height={360}
                className="mt-6 h-auto w-full object-contain opacity-90"
              />
            </div>

            <div className="relative rounded-[20px] bg-black p-7">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[
                    "/images/photo-2.jpg",
                    "/images/mission-team.jpg",
                    "/images/values-meeting.jpg",
                  ].map((src) => (
                    <Image
                      key={src}
                      src={src}
                      alt=""
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full border-2 border-black object-cover"
                    />
                  ))}
                </div>
                <p className="text-lg font-medium leading-tight text-white">
                  <span className="text-as-red">200+</span> businesses trust our
                  services
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-3xl text-lg text-as-muted">
            From simple UAE Free-Zones to complex multi-jurisdictional business
            structures, we help you legally minimize your tax liability &amp; protect
            your wealth for generations to come.
          </p>
          <a href="#collaborate" className="as-btn-dark shrink-0">
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
