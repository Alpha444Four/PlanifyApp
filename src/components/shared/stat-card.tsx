import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUp } from "lucide-react";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { hoverLift } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  accentClass = "text-primary",
  bgClass = "bg-primary/10",
  delay = 0,
  animate = false,
  decimals = 0,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: number;
  accentClass?: string;
  bgClass?: string;
  delay?: number;
  /** Count up from 0 when `value` is numeric. */
  animate?: boolean;
  decimals?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 420, damping: 32, delay }}
      whileHover={prefersReducedMotion ? undefined : hoverLift}
      className="rounded-3xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-soft-lg dark:glass"
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl",
            bgClass,
            accentClass,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        {typeof trend === "number" && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-semibold",
              trend >= 0 ? "text-success" : "text-destructive",
            )}
          >
            <ArrowUp className={cn("h-3 w-3", trend < 0 && "rotate-180")} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight">
        {animate && typeof value === "number" ? (
          <AnimatedCounter value={value} decimals={decimals} />
        ) : (
          value
        )}
        {unit && (
          <span className="ml-1 text-sm font-medium text-muted-foreground">
            {unit}
          </span>
        )}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}
