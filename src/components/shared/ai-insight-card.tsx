import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { AiInsight } from "@/lib/mock-data/health";
import { cn } from "@/lib/utils";

export function AiInsightCard({
  insight,
  className,
}: {
  insight: AiInsight;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-5 dark:glass",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/20 blur-3xl"
      />
      <div className="relative flex gap-3">
        <motion.span
          animate={
            prefersReducedMotion
              ? undefined
              : { scale: [1, 1.06, 1], rotate: [0, 4, 0] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow"
        >
          <Sparkles className="h-[18px] w-[18px]" />
        </motion.span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold">
            {insight.title}
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              AI
            </span>
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {insight.body}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
