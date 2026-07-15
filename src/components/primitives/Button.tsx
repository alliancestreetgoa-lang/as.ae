"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@/components/icons";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

/**
 * Button — the site-wide pill CTA, unifying every hand-rolled red pill /
 * outline link into one primitive with a consistent 21st.dev-inspired
 * treatment: a top inner highlight, a brand-tinted glow shadow that lifts
 * on hover, and (on the primary variant) a light shine that sweeps across.
 * All pure CSS so it respects the site's no-framer-motion constraint and
 * degrades cleanly under reduced motion (only transform/opacity animate).
 *
 * Polymorphic: renders `next/link` for internal routes, a plain `<a>` for
 * hash / external / mailto / tel targets, and a `<button>` when no href is
 * given. Pass `arrow` to append a right-arrow that nudges on hover.
 *
 * 21st.dev inspiration: Shiny Button (gradient fill + glow-on-hover) and
 * Gradient Borders Button (Shatlyk1011) — adapted onto Alliance Street's
 * red pill idiom rather than installed verbatim.
 */
type Variant = "primary" | "ink" | "white" | "outline";
type Size = "default" | "sm";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold whitespace-nowrap transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out will-change-transform active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const sizes: Record<Size, string> = {
  default: "px-7 py-3.5 text-[15px]",
  sm: "px-5 py-2.5 text-sm",
};

// Filled variants get the animated shine sweep on hover.
const SHINE: Variant[] = ["primary", "ink"];

// Each variant keeps its brand colour + animation; a glossy top sheen (added
// in `content`) gives them the frosted-"glass" finish. The outline/secondary
// variant is the fully frosted glass pill (.glass-button in globals.css).
const variants: Record<Variant, string> = {
  primary:
    "bg-[linear-gradient(180deg,var(--color-as-red-bright),var(--color-as-red))] text-white ring-1 ring-inset ring-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_8px_20px_-8px_rgba(226,46,52,0.6)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_16px_34px_-10px_rgba(226,46,52,0.75)]",
  ink: "bg-as-ink text-white ring-1 ring-inset ring-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_8px_20px_-10px_rgba(16,16,20,0.55)] hover:-translate-y-0.5 hover:bg-as-red hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.32),0_16px_34px_-10px_rgba(226,46,52,0.6)]",
  white:
    "bg-white text-as-ink ring-1 ring-inset ring-black/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_20px_-10px_rgba(16,16,20,0.4)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-12px_rgba(16,16,20,0.45)]",
  outline: "glass-button",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
  /**
   * Serializable analytics event to fire on click, via `trackEvent()`.
   * Plain data (not a function), so Server Component callers can pass it
   * across the RSC boundary — Button itself (already `"use client"`) owns
   * the `onClick` that calls `trackEvent()`. If a caller also passes a
   * native `onClick`, both fire.
   */
  track?: AnalyticsEvent;
};

type AnchorProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps> & { href: string };
type NativeButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: never;
  };

export function Button(props: AnchorProps | NativeButtonProps) {
  const {
    variant = "primary",
    size = "default",
    arrow = false,
    className,
    children,
    track,
    ...rest
  } = props;

  const cls = cn(base, sizes[size], variants[variant], className);

  const content = (
    <>
      {/* Glass gloss: a glossy highlight over the top half of the pill. */}
      {variant !== "outline" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/30 to-transparent"
        />
      )}
      {/* Animated shine sweep on hover. */}
      {SHINE.includes(variant) && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
        >
          <span className="absolute -inset-y-4 -left-1/3 w-1/3 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent translate-x-[-250%] transition-transform duration-700 ease-out group-hover:translate-x-[500%] motion-reduce:hidden" />
        </span>
      )}
      <span className="relative inline-flex items-center gap-2">
        {children}
        {arrow && (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none" />
        )}
      </span>
    </>
  );

  if (rest.href !== undefined) {
    const { href, onClick, ...anchorRest } = rest as Omit<
      AnchorProps,
      keyof CommonProps
    >;
    const usePlainAnchor = /^(https?:|#|mailto:|tel:)/.test(href);
    const handleClick = track
      ? (event: MouseEvent<HTMLAnchorElement>) => {
          onClick?.(event);
          trackEvent(track);
        }
      : onClick;
    if (usePlainAnchor) {
      return (
        <a className={cls} href={href} onClick={handleClick} {...anchorRest}>
          {content}
        </a>
      );
    }
    return (
      <Link className={cls} href={href} onClick={handleClick} {...anchorRest}>
        {content}
      </Link>
    );
  }

  const { onClick: buttonOnClick, ...buttonRest } = rest as Omit<
    NativeButtonProps,
    keyof CommonProps
  >;
  const handleButtonClick = track
    ? (event: MouseEvent<HTMLButtonElement>) => {
        buttonOnClick?.(event);
        trackEvent(track);
      }
    : buttonOnClick;
  return (
    <button className={cls} onClick={handleButtonClick} {...buttonRest}>
      {content}
    </button>
  );
}
