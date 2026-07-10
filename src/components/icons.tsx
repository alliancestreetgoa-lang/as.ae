import { cn } from "@/lib/utils";

/**
 * Alliance Street logo — the brand's red "A" mark paired with the stacked
 * "ALLIANCE STREET" wordmark, drawn as SVG + text so it stays razor-sharp
 * at any size and adapts to light/dark surfaces (`variant` only colours the
 * wordmark; the mark is always brand red). Self-contained — no image asset.
 */
export function Logo({
  variant = "white",
  className,
}: {
  variant?: "white" | "black";
  className?: string;
}) {
  return (
    <span
      aria-label="Alliance Street"
      role="img"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <LogoMark className="h-full w-auto" />
      <span
        className={cn(
          "font-sans text-[13px] font-semibold uppercase leading-[1.08] tracking-[0.16em]",
          variant === "white" ? "text-white" : "text-as-ink"
        )}
      >
        <span className="block">Alliance</span>
        <span className="block">Street</span>
      </span>
    </span>
  );
}

/** The red "A" mark — a bold hollow chevron. Used standalone (footer bar,
 *  favicon-scale) and inside `Logo`. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 35" fill="none" className={cn("h-7 w-auto", className)} aria-hidden="true">
      <path d="M20 1L39 34H29L20 17L11 34H1L20 1Z" fill="#e22e34" />
    </svg>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-5 w-5", className)}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Check({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-5 w-5", className)}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
