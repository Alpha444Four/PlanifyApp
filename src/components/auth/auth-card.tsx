import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * AuthCard — the glassmorphism card used inside AuthLayout. Kept separate so it
 * can be reused for other centered auth-style surfaces (e.g. reset confirm).
 */
export function AuthCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      animate="show"
      variants={scaleIn}
      className={cn(
        "rounded-3xl border border-border bg-card/80 p-7 shadow-soft-lg backdrop-blur-xl dark:glass sm:p-8",
        className,
      )}
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
}
