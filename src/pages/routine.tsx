import { motion } from "framer-motion";
import { Bell, Clock, Plus, Sun, Moon, Coffee, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const routines = [
  { icon: Sun, time: "06:30", title: "Wake & hydrate", desc: "500ml water + daylight", tag: "Morning", on: true },
  { icon: Coffee, time: "07:00", title: "Morning mobility", desc: "5 min stretch routine", tag: "Morning", on: true },
  { icon: BookOpen, time: "13:00", title: "Read 20 minutes", desc: "Personal growth block", tag: "Afternoon", on: false },
  { icon: Moon, time: "22:30", title: "Wind-down", desc: "Dim lights, no screens", tag: "Evening", on: true },
];

export default function RoutinePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Routine & Reminders"
        description="Design rituals that flex around your day — Planify nudges you at the right moment."
        action={
          <Button variant="gradient">
            <Plus className="h-4 w-4" />
            New routine
          </Button>
        }
      />

      <div className="grid gap-3">
        {routines.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <r.icon className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{r.title}</p>
                    <Badge variant="secondary">{r.tag}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {r.time}
                </div>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    r.on ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                  }`}
                  aria-label={r.on ? "Reminder on" : "Reminder off"}
                >
                  <Bell className="h-4 w-4" />
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
