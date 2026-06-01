import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { PlanifyLogo } from "@/components/brand/planify-logo";
import { AnimatedPage } from "@/components/shared/animated-page";
import { AuthCard } from "@/components/auth/auth-card";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-5 py-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, 18, 0], x: [0, 8, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -14, 0], x: [0, -10, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-accent/25 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        />
      </div>

      <AnimatedPage className="relative z-10 w-full max-w-md">
        <div className="mx-auto mb-8 flex w-fit justify-center">
          <PlanifyLogo variant="full" size="md" href="/" />
        </div>

        <AuthCard title={title} subtitle={subtitle}>
          {children}
        </AuthCard>

        {footer && (
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        )}
      </AnimatedPage>
    </div>
  );
}
