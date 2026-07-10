"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@/components/icons";

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

// Filled variants that get the light shine sweep on hover (skipped on the
// white button, where a light shine would be invisible, and on outline).
const SHINE: Variant[] = ["primary", "ink"];

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold whitespace-nowrap transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out will-change-transform active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const sizes: Record<Size, string> = {
  default: "px-7 py-3.5 text-[15px]",
  sm: "px-5 py-2.5 text-sm",
};

const variants: Record<Variant, string> = {
  // Red gradient pill — the main CTA. Works on both light and dark surfaces.
  primary:
    "bg-[linear-gradient(180deg,var(--color-as-red-bright),var(--color-as-red))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_16px_-6px_rgba(226,46,52,0.55)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_14px_30px_-8px_rgba(226,46,52,0.7)]",
  // Dark pill that warms to red on hover — used on light surfaces.
  ink: "bg-as-ink text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_6px_16px_-8px_rgba(16,16,20,0.5)] hover:-translate-y-0.5 hover:bg-as-red hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.30),0_14px_30px_-8px_rgba(226,46,52,0.6)]",
  // Light pill for dark surfaces.
  white:
    "bg-white text-as-ink shadow-[0_6px_16px_-8px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5)]",
  // Hairline outline — the secondary CTA on light surfaces.
  outline:
    "border border-as-line bg-white text-as-ink shadow-[0_1px_2px_rgba(16,16,20,0.04)] hover:-translate-y-0.5 hover:border-as-red/40 hover:text-as-red hover:shadow-[0_12px_26px_-14px_rgba(226,46,52,0.4)]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
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
    ...rest
  } = props;

  const cls = cn(base, sizes[size], variants[variant], className);

  const content = (
    <>
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
    const { href, ...anchorRest } = rest as Omit<AnchorProps, keyof CommonProps>;
    const usePlainAnchor = /^(https?:|#|mailto:|tel:)/.test(href);
    if (usePlainAnchor) {
      return (
        <a className={cls} href={href} {...anchorRest}>
          {content}
        </a>
      );
    }
    return (
      <Link className={cls} href={href} {...anchorRest}>
        {content}
      </Link>
    );
  }

  const buttonRest = rest as Omit<NativeButtonProps, keyof CommonProps>;
  return (
    <button className={cls} {...buttonRest}>
      {content}
    </button>
  );
}
