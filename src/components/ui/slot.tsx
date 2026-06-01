import { Children, cloneElement, forwardRef, isValidElement } from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal `asChild` slot helper (Radix-style) without extra dependencies.
 * Merges props/className onto a single child element.
 */
export const Slot = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ children, className, ...props }, ref) => {
    if (!isValidElement(children)) return null;
    const child = Children.only(children) as React.ReactElement<
      Record<string, unknown>
    >;
    const childClassName = (child.props as { className?: string }).className;
    return cloneElement(child, {
      ...props,
      ...child.props,
      ref,
      className: cn(className, childClassName),
    });
  },
);
Slot.displayName = "Slot";
