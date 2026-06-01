import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ListTodo, Flame, Apple, BellRing, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useQuickAddStore, type QuickAddType } from "@/store/quick-add-store";
import { addTask } from "@/services/task-service";
import { addHabit } from "@/services/habit-service";
import { addReminder } from "@/services/reminder-service";
import { addMeal } from "@/services/calories-service";

const meta: Record<
  QuickAddType,
  { title: string; icon: typeof ListTodo; placeholder: string; cta: string }
> = {
  task: { title: "Add task", icon: ListTodo, placeholder: "e.g. Deep work block", cta: "Add task" },
  habit: { title: "Start a habit", icon: Flame, placeholder: "e.g. Meditate 10 min", cta: "Create habit" },
  meal: { title: "Log a meal", icon: Apple, placeholder: "e.g. Grilled chicken bowl", cta: "Log meal" },
  reminder: { title: "Create reminder", icon: BellRing, placeholder: "e.g. Call the dentist", cta: "Create reminder" },
};

export function QuickAddDialog() {
  const { open, type, closeDialog } = useQuickAddStore();
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();

  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [calories, setCalories] = useState("");
  const [emoji, setEmoji] = useState("");

  // Reset fields whenever the dialog opens for a fresh type.
  useEffect(() => {
    if (open) {
      setName("");
      setTime("");
      setCalories("");
      setEmoji("");
    }
  }, [open, type]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDialog();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeDialog]);

  const current = meta[type];

  const submit = () => {
    const value = name.trim();
    if (!value) return;

    switch (type) {
      case "task":
        addTask({ title: value, time: time.trim() || undefined });
        toast({ title: "Task added", variant: "success" });
        break;
      case "habit":
        addHabit({ name: value, emoji: emoji.trim() || undefined });
        toast({ title: "Habit created", description: "Keep the streak alive!", variant: "success" });
        break;
      case "meal": {
        const kcal = Number(calories) || 0;
        addMeal({ name: value, calories: kcal, time: time.trim() || undefined });
        toast({ title: "Meal logged", description: `${kcal} kcal`, variant: "success" });
        break;
      }
      case "reminder":
        addReminder({ title: value, time: time.trim() || undefined });
        toast({ title: "Reminder created", variant: "success" });
        break;
    }
    closeDialog();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={closeDialog}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-soft-lg dark:glass"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <current.icon className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-semibold">{current.title}</h2>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Close"
                className="focus-ring rounded-lg p-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="qa-name" className="mb-1.5 block text-sm font-medium">
                  {type === "meal" ? "Meal" : type === "habit" ? "Habit" : "Title"}
                </label>
                {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                <Input
                  id="qa-name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={current.placeholder}
                />
              </div>

              {type === "meal" && (
                <div>
                  <label htmlFor="qa-cal" className="mb-1.5 block text-sm font-medium">
                    Calories
                  </label>
                  <Input
                    id="qa-cal"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="e.g. 520"
                  />
                </div>
              )}

              {type === "habit" && (
                <div>
                  <label htmlFor="qa-emoji" className="mb-1.5 block text-sm font-medium">
                    Emoji <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <Input
                    id="qa-emoji"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    placeholder="🧘"
                    maxLength={4}
                  />
                </div>
              )}

              {(type === "task" || type === "reminder" || type === "meal") && (
                <div>
                  <label htmlFor="qa-time" className="mb-1.5 block text-sm font-medium">
                    Time <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <Input
                    id="qa-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" className="flex-1" disabled={!name.trim()}>
                  {current.cta}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
