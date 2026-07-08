"use client";
import {
  createElement,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { useReveal } from "./useReveal";

type RevealProps = {
  as?: ElementType;
  y?: number;
  delay?: number;
  duration?: number;
  className?: string;
  children?: ReactNode;
} & Omit<
  ComponentPropsWithoutRef<"div">,
  "as" | "y" | "delay" | "duration" | "className" | "children"
>;

export function Reveal({
  as = "div",
  y,
  delay,
  duration,
  className,
  children,
  ...rest
}: RevealProps) {
  const ref = useReveal({ y, delay, duration });
  return createElement(
    as,
    { ref, className, ...rest },
    children
  );
}
