import { motion, useReducedMotion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EMPTY_USER_DATA, useUserDataStore } from "@/store/user-data-store";

export function DailyChallenges() {
  const prefersReducedMotion = useReducedMotion();
  const challenges = useUserDataStore((s) =>
    s.activeUserId
      ? (s.dataByUser[s.activeUserId] ?? EMPTY_USER_DATA).challenges
      : EMPTY_USER_DATA.challenges,
  );
  const done = challenges.filter((c) => c.completed).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Daily challenges</CardTitle>
        <span className="text-xs font-medium text-muted-foreground">
          {done}/{challenges.length}
        </span>
      </CardHeader>
      <CardContent className="space-y-2">
        {challenges.map((c, i) => {
          const pct = Math.min(100, Math.round((c.progress / c.target) * 100));
          return (
            <motion.div
              key={c.id}
              layout
              initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "rounded-2xl border p-3 transition-colors",
                c.completed
                  ? "border-accent/40 bg-accent/5"
                  : "border-border bg-muted/20",
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg" aria-hidden>
                  {c.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{c.title}</p>
                    {c.completed && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground"
                      >
                        <Check className="h-3 w-3" />
                      </motion.span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{c.description}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      initial={false}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        {done === challenges.length && challenges.length > 0 && (
          <p className="flex items-center gap-2 pt-1 text-xs font-medium text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            All challenges complete — streak protected!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
