import Link from "next/link";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  /**
   * "light" (default) — muted-on-canvas text, for pages whose hero starts on
   * a light/`as-canvas` background (`GradientHero`, `PageHero`, the bespoke
   * light heroes, and `ImageHero`'s always-solid navbar case).
   * "dark" — white-on-`as-ink` text, for the two pages whose bespoke hero
   * opens on the black top of `.as-hero-gradient` (about-us, careers): the
   * `Navbar` there renders its transparent/white-logo state expecting a dark
   * backdrop, so the breadcrumb bar needs a matching dark background rather
   * than the default light one.
   */
  variant?: "light" | "dark";
  className?: string;
};

/**
 * Breadcrumb — small, unobtrusive wayfinding trail rendered above each
 * subpage's hero (e.g. "Home / Banking"). Mirrors the JSON-LD emitted by
 * `breadcrumbSchema()` (`src/lib/schema.ts`) so the visible trail and the
 * structured data agree on labels/order. Standard accessible pattern: a
 * `<nav aria-label="Breadcrumb">` wrapping an `<ol>`, final item rendered as
 * plain text with `aria-current="page"`.
 *
 * Sits in normal document flow directly below the fixed `Navbar`; `pt-[82px]`
 * mirrors the same navbar-clearance offset every hero component
 * (`ImageHero`/`GradientHero`/`PageHero` and the bespoke inline heroes) uses,
 * so it renders as the page's first visible content instead of being hidden
 * under the fixed header.
 */
export function Breadcrumb({ items, variant = "light", className }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "relative z-10 pt-[82px]",
        variant === "dark" ? "bg-as-ink" : "bg-as-canvas",
        className
      )}
    >
      <ol
        className={cn(
          "as-container flex flex-wrap items-center gap-1.5 py-3 font-mono text-[11px] uppercase tracking-[0.15em]",
          variant === "dark" ? "text-white/60" : "text-as-muted"
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <span aria-hidden="true" className={variant === "dark" ? "text-white/30" : "text-as-muted/50"}>
                  /
                </span>
              )}
              {isLast ? (
                <span aria-current="page" className={variant === "dark" ? "text-white" : "text-as-ink"}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors",
                    variant === "dark" ? "hover:text-white" : "hover:text-as-red"
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
