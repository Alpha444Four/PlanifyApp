import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Bed, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A single sleep stage segment.
 * `color` is intentionally a raw hex/CSS color: sleep-stage graph colors are a
 * domain visual language (Awake amber, REM purple, Core blue, Deep indigo) and
 * may be hardcoded. Everything else in this card uses shadcn design tokens.
 */
export type SleepStage = {
  label: string;
  minutes: number;
  color: string;
};

export type SleepData = {
  /** Human readable total e.g. "5:44" (hours:minutes). */
  timeSlept: string;
  /** Sleep quality score, 0 - 100. */
  quality: number;
  /** Change vs previous period, percent (can be negative). */
  changePercent: number;
  /** Bed time e.g. "01:42". */
  startTime: string;
  /** Wake time e.g. "07:26". */
  endTime: string;
  stages: SleepStage[];
};

export interface SleepTrackerCardProps {
  data?: Partial<SleepData>;
  className?: string;
}

const FALLBACK: SleepData = {
  timeSlept: "0:00",
  quality: 0,
  changePercent: 0,
  startTime: "--:--",
  endTime: "--:--",
  stages: [],
};

function formatDuration(minutes: number): string {
  if (!minutes || minutes < 0) return "0m";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function SleepTrackerCard({ data, className }: SleepTrackerCardProps) {
  const prefersReducedMotion = useReducedMotion();

  // Defensive merge so the card never breaks on empty / partial data.
  const safe: SleepData = {
    ...FALLBACK,
    ...data,
    stages: data?.stages?.length ? data.stages : FALLBACK.stages,
  };

  const totalStageMinutes = useMemo(
    () => safe.stages.reduce((sum, s) => sum + (s.minutes || 0), 0),
    [safe.stages],
  );

  const quality = Math.max(0, Math.min(100, safe.quality));
  const isPositive = safe.changePercent >= 0;
  const hasStages = safe.stages.length > 0 && totalStageMinutes > 0;

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-card p-6 text-card-foreground shadow-soft transition-shadow hover:shadow-soft-lg",
        "dark:glass",
        className,
      )}
      role="region"
      aria-label={`Sleep summary: slept ${safe.timeSlept}, quality ${quality} percent`}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bed className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Time Slept
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">
                {safe.timeSlept}
              </span>
              <span className="text-sm text-muted-foreground">hrs</span>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            isPositive
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive",
          )}
          aria-label={`${isPositive ? "Up" : "Down"} ${Math.abs(
            safe.changePercent,
          )} percent versus last week`}
        >
          <ArrowUp
            className={cn("h-3.5 w-3.5", !isPositive && "rotate-180")}
            aria-hidden
          />
          {Math.abs(safe.changePercent)}%
        </div>
      </div>

      {/* Quality bar */}
      <div className="relative mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Sleep quality</span>
          <span className="font-semibold">{quality}%</span>
        </div>
        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={quality}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Sleep quality"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            initial={prefersReducedMotion ? false : { width: 0 }}
            whileInView={{ width: `${quality}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          />
        </div>
      </div>

      {/* Stage graph */}
      <div className="relative mt-6">
        <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Moon className="h-4 w-4" aria-hidden />
            {safe.startTime}
          </span>
          <span className="text-xs">Sleep stages</span>
          <span className="flex items-center gap-1.5">
            {safe.endTime}
            <Sun className="h-4 w-4" aria-hidden />
          </span>
        </div>

        {hasStages ? (
          <div
            className="flex h-24 items-end gap-1.5"
            role="img"
            aria-label={`Sleep stages: ${safe.stages
              .map((s) => `${s.label} ${formatDuration(s.minutes)}`)
              .join(", ")}`}
          >
            {safe.stages.map((stage, i) => {
              const heightPct =
                30 + (stage.minutes / totalStageMinutes) * 70; // 30%..100%
              const widthPct = (stage.minutes / totalStageMinutes) * 100;
              return (
                <div
                  key={stage.label}
                  className="flex h-full flex-col justify-end"
                  style={{ width: `${Math.max(widthPct, 6)}%` }}
                >
                  <motion.div
                    className="w-full rounded-lg"
                    style={{ backgroundColor: stage.color }}
                    initial={
                      prefersReducedMotion ? false : { height: 0, opacity: 0 }
                    }
                    whileInView={{ height: `${heightPct}%`, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.15 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    title={`${stage.label}: ${formatDuration(stage.minutes)}`}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
            No sleep stage data yet
          </div>
        )}

        {/* Legend */}
        {hasStages && (
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
            {safe.stages.map((stage) => (
              <li
                key={stage.label}
                className="flex items-center gap-2 text-xs"
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="text-muted-foreground">{stage.label}</span>
                <span className="ml-auto font-medium tabular-nums">
                  {formatDuration(stage.minutes)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
