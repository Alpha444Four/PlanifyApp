import { motion } from "framer-motion";
import { Check, Flame, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EMPTY_USER_DATA, useUserDataStore } from "@/store/user-data-store";
import { useQuickAddStore } from "@/store/quick-add-store";
import { cn } from "@/lib/utils";

const days = ["M", "T", "W", "T", "F", "S", "S"];

export function HabitTracker({ compact = false }: { compact?: boolean }) {
  const habits = useUserDataStore((s) =>
    s.activeUserId
      ? (s.dataByUser[s.activeUserId] ?? EMPTY_USER_DATA).habits
      : EMPTY_USER_DATA.habits,
  );
  const toggleHabitToday = useUserDataStore((s) => s.toggleHabitToday);
  const openDialog = useQuickAddStore((s) => s.openDialog);

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-amber-500" />
          Habit streaks
        </CardTitle>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Add habit"
          onClick={() => openDialog("habit")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Flame className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-semibold">Start your first habit</p>
              <p className="text-xs text-muted-foreground">
                Small daily wins build big streaks.
              </p>
            </div>
            <Button size="sm" variant="gradient" onClick={() => openDialog("habit")}>
              <Plus className="h-4 w-4" />
              Add habit
            </Button>
          </div>
        ) : (
          (compact ? habits.slice(0, 3) : habits).map((habit) => {
            const doneToday = habit.week[habit.week.length - 1];
            return (
              <div
                key={habit.id}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3"
              >
                <button
                  type="button"
                  onClick={() => toggleHabitToday(habit.id)}
                  aria-label={`Mark ${habit.name} ${doneToday ? "incomplete" : "complete"} for today`}
                  aria-pressed={doneToday}
                  className={cn(
                    "focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
                    doneToday
                      ? "border-transparent bg-gradient-to-br from-primary to-accent text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40",
                  )}
                >
                  {doneToday ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span aria-hidden>{habit.emoji}</span>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{habit.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {habit.streak} day streak
                  </p>
                </div>
                <div className="hidden gap-1 sm:flex" aria-hidden>
                  {habit.week.map((done, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1"
                      title={done ? "Completed" : "Missed"}
                    >
                      <motion.span
                        initial={{ scale: 0.6, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.03 }}
                        className={cn(
                          "h-5 w-2.5 rounded-full",
                          done ? "bg-primary" : "bg-muted",
                        )}
                      />
                      <span className="text-[9px] text-muted-foreground">
                        {days[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
