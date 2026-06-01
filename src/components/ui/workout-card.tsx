import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Dumbbell,
  Flame,
  Play,
  Timer,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Safe, local icon keys — no remote images are ever required. */
export type ExerciseIcon =
  | "dumbbell"
  | "flame"
  | "timer"
  | "activity"
  | "zap";

export type Exercise = {
  name: string;
  /** e.g. "2 minutes" or "20 reps" */
  detail: string;
  icon?: ExerciseIcon;
};

export interface WorkoutCardProps {
  date: string;
  wodTitle: string;
  sessionTitle: string;
  /** Session duration in minutes. */
  sessionDuration: number;
  exercises?: Exercise[];
  className?: string;
  onStart?: () => void;
}

const ICONS: Record<ExerciseIcon, LucideIcon> = {
  dumbbell: Dumbbell,
  flame: Flame,
  timer: Timer,
  activity: Activity,
  zap: Zap,
};

function iconFor(name: ExerciseIcon | undefined, index: number): LucideIcon {
  if (name && ICONS[name]) return ICONS[name];
  // Deterministic fallback rotation so every exercise gets a sensible icon.
  const keys: ExerciseIcon[] = ["activity", "flame", "dumbbell", "timer", "zap"];
  return ICONS[keys[index % keys.length]];
}

export function WorkoutCard({
  date,
  wodTitle,
  sessionTitle,
  sessionDuration,
  exercises = [],
  className,
  onStart,
}: WorkoutCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.07 },
    },
  };
  const item = {
    hidden: prefersReducedMotion
      ? { opacity: 1, x: 0 }
      : { opacity: 0, x: -12 },
    show: { opacity: 1, x: 0 },
  };

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
      aria-label={`${wodTitle} — ${sessionTitle}, ${sessionDuration} minutes`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-accent" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              {wodTitle}
            </span>
          </div>
          <h3 className="mt-1.5 text-2xl font-bold tracking-tight">
            {sessionTitle}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{date}</p>
        </div>

        <div className="flex flex-col items-center rounded-2xl bg-muted px-3.5 py-2 text-center">
          <Timer className="h-4 w-4 text-muted-foreground" aria-hidden />
          <span className="mt-0.5 text-lg font-bold leading-none tabular-nums">
            {sessionDuration}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            min
          </span>
        </div>
      </div>

      {exercises.length > 0 ? (
        <motion.ul
          className="relative mt-5 space-y-2"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-30px" }}
        >
          {exercises.map((ex, i) => {
            const Icon = iconFor(ex.icon, i);
            return (
              <motion.li
                key={`${ex.name}-${i}`}
                variants={item}
                transition={{ duration: 0.35, ease: "easeOut" }}
                whileHover={prefersReducedMotion ? undefined : { x: 4 }}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3 transition-colors hover:border-primary/40 hover:bg-muted"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{ex.name}</p>
                  <p className="text-xs text-muted-foreground">{ex.detail}</p>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  #{i + 1}
                </span>
              </motion.li>
            );
          })}
        </motion.ul>
      ) : (
        <div className="mt-5 flex h-28 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
          No exercises planned yet
        </div>
      )}

      <button
        type="button"
        onClick={onStart}
        className="focus-ring mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform active:scale-[0.98]"
      >
        <Play className="h-4 w-4 fill-current" aria-hidden />
        Start session
      </button>
    </motion.div>
  );
}
