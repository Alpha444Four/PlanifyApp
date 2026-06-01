import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { hoverLift, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Premium interactive card shell — stagger entrance + subtle lift on hover.
 */
export function AnimatedCard({
  children,
  className,
  glass,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={staggerItem}
      initial={prefersReducedMotion ? false : undefined}
      whileHover={prefersReducedMotion ? undefined : hoverLift}
      transition={{ delay }}
      className={cn(
        "rounded-3xl border border-border text-card-foreground shadow-soft transition-shadow hover:shadow-soft-lg",
        glass ? "glass" : "bg-card",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
