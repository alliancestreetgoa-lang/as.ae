import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EyebrowProps = {
  className?: string;
  children?: ReactNode;
};

/**
 * Eyebrow — small mono-spaced label used above headings across the
 * redesigned site. Red, uppercase, widely tracked, with a leading tick
 * mark that reinforces the brand's institutional-red accent.
 */
export function Eyebrow({ className, children }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-as-red",
        className
      )}
    >
      <span aria-hidden="true" className="inline-block h-px w-4 bg-as-red" />
      {children}
    </span>
  );
}
