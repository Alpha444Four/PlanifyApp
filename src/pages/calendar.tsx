import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const today = 3; // Thu (0-indexed)

const events = [
  { day: 0, title: "Upper body", color: "bg-orange-500" },
  { day: 1, title: "HIIT", color: "bg-orange-500" },
  { day: 1, title: "Team sync", color: "bg-sky-500" },
  { day: 3, title: "Lower body", color: "bg-orange-500" },
  { day: 3, title: "Spanish", color: "bg-emerald-500" },
  { day: 4, title: "Warm-up", color: "bg-orange-500" },
  { day: 5, title: "Mobility", color: "bg-violet-500" },
];

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="A unified view of training, focus blocks and personal rituals."
        action={
          <Button variant="gradient">
            <Plus className="h-4 w-4" />
            Add event
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>This week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((d, i) => (
              <div key={d} className="flex flex-col gap-2">
                <div
                  className={cn(
                    "rounded-xl py-2 text-center text-xs font-semibold",
                    i === today
                      ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <div>{d}</div>
                  <div className="mt-0.5 text-sm">{17 + i}</div>
                </div>
                <div className="space-y-1.5">
                  {events
                    .filter((e) => e.day === i)
                    .map((e, idx) => (
                      <motion.div
                        key={`${e.title}-${idx}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.03 + idx * 0.05 }}
                        className="rounded-lg border border-border bg-card p-1.5"
                      >
                        <span className={cn("mb-1 block h-1 w-full rounded-full", e.color)} />
                        <p className="truncate text-[10px] font-medium leading-tight">
                          {e.title}
                        </p>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today · Thursday</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { time: "09:00", title: "Deep work block", color: "bg-sky-500" },
            { time: "17:30", title: "Lower body power", color: "bg-orange-500" },
            { time: "18:30", title: "Spanish lesson", color: "bg-emerald-500" },
          ].map((e) => (
            <div key={e.title} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3">
              <span className={cn("h-10 w-1 rounded-full", e.color)} />
              <span className="w-14 text-sm font-medium tabular-nums text-muted-foreground">
                {e.time}
              </span>
              <span className="text-sm font-semibold">{e.title}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
