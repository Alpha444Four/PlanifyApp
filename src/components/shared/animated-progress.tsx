import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { springSoft } from "@/lib/motion";

export function AnimatedProgressBar({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn("h-2 overflow-hidden rounded-full bg-muted", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-primary to-accent",
          barClassName,
        )}
        initial={{ width: prefersReducedMotion ? `${clamped}%` : "0%" }}
        animate={{ width: `${clamped}%` }}
        transition={prefersReducedMotion ? { duration: 0 } : springSoft}
      />
    </div>
  );
}
