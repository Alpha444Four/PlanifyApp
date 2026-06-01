import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * AnimatedPage — reusable entrance wrapper (opacity + slight y rise).
 * Used by the public auth pages (the app shell already animates routes).
 * Respects prefers-reduced-motion.
 */
export function AnimatedPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : springSoft}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
