import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { EMPTY_USER_DATA, useUserDataStore } from "@/store/user-data-store";
import { cn } from "@/lib/utils";

const moodOptions = [
  { value: 1, emoji: "😔", label: "Low" },
  { value: 2, emoji: "😕", label: "Meh" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
];

export function MoodTracker() {
  const moods = useUserDataStore((s) =>
    s.activeUserId
      ? (s.dataByUser[s.activeUserId] ?? EMPTY_USER_DATA).moods
      : EMPTY_USER_DATA.moods,
  );
  const setMood = useUserDataStore((s) => s.setMood);
  const { toast } = useToast();
  const max = 5;

  const today = new Date().toLocaleDateString(undefined, { weekday: "short" });
  const selected = moods.find((m) => m.date === today)?.value ?? null;

  const handleSelect = (value: number) => {
    setMood(value);
    toast({ title: "Mood logged", variant: "success" });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Mood tracker</CardTitle>
      </CardHeader>
      <CardContent>
        {moods.length > 0 ? (
          <div className="flex items-end justify-between gap-2" aria-hidden>
            {moods.map((m, i) => (
              <div key={m.date} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-24 w-full items-end justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(m.value / max) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="w-full max-w-[28px] rounded-lg bg-gradient-to-t from-primary/70 to-accent"
                  />
                </div>
                <span className="text-sm">{m.emoji}</span>
                <span className="text-[10px] text-muted-foreground">{m.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-border text-center text-sm text-muted-foreground">
            Your mood history will appear here.
          </div>
        )}

        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-3 text-sm font-medium">How are you feeling now?</p>
          <div className="flex justify-between gap-1.5">
            {moodOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                aria-label={opt.label}
                aria-pressed={selected === opt.value}
                className={cn(
                  "focus-ring flex flex-1 flex-col items-center gap-1 rounded-2xl border py-2.5 text-xl transition-all",
                  selected === opt.value
                    ? "border-primary bg-primary/10 scale-105"
                    : "border-border bg-card hover:bg-muted",
                )}
              >
                <span>{opt.emoji}</span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
