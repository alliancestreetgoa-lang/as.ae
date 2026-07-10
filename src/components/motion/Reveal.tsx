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
  x?: number;
  scale?: number;
  blur?: number;
  delay?: number;
  duration?: number;
  start?: string;
  className?: string;
  children?: ReactNode;
} & Omit<
  ComponentPropsWithoutRef<"div">,
  | "as"
  | "y"
  | "x"
  | "scale"
  | "blur"
  | "delay"
  | "duration"
  | "start"
  | "className"
  | "children"
>;

export function Reveal({
  as = "div",
  y,
  x,
  scale,
  blur,
  delay,
  duration,
  start,
  className,
  children,
  ...rest
}: RevealProps) {
  const ref = useReveal({ y, x, scale, blur, delay, duration, start });
  return createElement(as, { ref, className, ...rest }, children);
}
