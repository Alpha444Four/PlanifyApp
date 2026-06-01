import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      animate="show"
      variants={fadeUp}
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 px-6 py-14 text-center",
        className,
      )}
    >
      <motion.span
        animate={
          prefersReducedMotion
            ? undefined
            : { y: [0, -6, 0] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground"
      >
        <Icon className="h-7 w-7" />
      </motion.span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
