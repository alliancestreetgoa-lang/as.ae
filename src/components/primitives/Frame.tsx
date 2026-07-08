import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FrameTone = "red" | "line";

const toneClasses: Record<FrameTone, string> = {
  red: "border-as-red",
  line: "border-as-line",
};

type FrameProps = {
  tone?: FrameTone;
  className?: string;
  children?: ReactNode;
};

const CORNER_BASE = "pointer-events-none absolute h-6 w-6 sm:h-8 sm:w-8";

/**
 * Frame — the recurring corner-bracket brand motif. Four CSS/border-based
 * brackets (no image asset, no hardcoded color) sit at the corners of the
 * wrapped content, each drawing two sides of a square with `border` so the
 * color always follows the brand tokens and stays crisp at any size.
 */
export function Frame({ tone = "red", className, children }: FrameProps) {
  const borderColor = toneClasses[tone];

  return (
    <div className={cn("relative", className)}>
      <span
        aria-hidden="true"
        className={cn(CORNER_BASE, "top-0 left-0 border-t-2 border-l-2", borderColor)}
      />
      <span
        aria-hidden="true"
        className={cn(CORNER_BASE, "top-0 right-0 border-t-2 border-r-2", borderColor)}
      />
      <span
        aria-hidden="true"
        className={cn(CORNER_BASE, "bottom-0 left-0 border-b-2 border-l-2", borderColor)}
      />
      <span
        aria-hidden="true"
        className={cn(CORNER_BASE, "bottom-0 right-0 border-b-2 border-r-2", borderColor)}
      />
      <div className="relative h-full p-6 sm:p-8">{children}</div>
    </div>
  );
}
