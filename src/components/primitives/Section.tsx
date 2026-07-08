import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionBg = "canvas" | "ink" | "transparent";

const bgClasses: Record<SectionBg, string> = {
  canvas: "bg-as-canvas",
  ink: "bg-as-ink text-as-canvas",
  transparent: "bg-transparent",
};

type SectionProps = {
  id?: string;
  bg?: SectionBg;
  className?: string;
  children?: ReactNode;
};

/**
 * Section — the shared page-rhythm wrapper for every redesigned homepage
 * section. Provides the brand background, generous responsive vertical
 * rhythm, horizontal padding, a centered max-width container, and a
 * 12-column grid context for children to opt into (e.g.
 * `className="col-span-6"`).
 */
export function Section({ id, bg = "canvas", className, children }: SectionProps) {
  return (
    <section id={id} className={cn("relative w-full", bgClasses[bg], className)}>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-x-6 px-6 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        {children}
      </div>
    </section>
  );
}
