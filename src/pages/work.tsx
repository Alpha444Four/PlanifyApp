import { motion } from "framer-motion";
import { Briefcase, CheckCircle2, Circle, Clock, Plus, Target } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EisenhowerMatrix } from "@/components/work/eisenhower-matrix";
import { useI18n } from "@/hooks/use-i18n";
import { useQuickAddStore } from "@/store/quick-add-store";

const projects = [
  { name: "Planify launch", progress: 72, tasks: "18/25", color: "from-primary to-accent" },
  { name: "Q3 roadmap", progress: 40, tasks: "8/20", color: "from-sky-500 to-cyan-500" },
  { name: "Brand refresh", progress: 90, tasks: "27/30", color: "from-emerald-500 to-teal-500" },
];

const focusTasks = [
  { title: "Finalize product spec", done: true, priority: "High" },
  { title: "Review design handoff", done: false, priority: "High" },
  { title: "Write release notes", done: false, priority: "Med" },
  { title: "Prep stakeholder deck", done: false, priority: "Low" },
];

export default function WorkPage() {
  const { t } = useI18n();
  const openDialog = useQuickAddStore((s) => s.openDialog);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("work.title")}
        description={t("work.subtitle")}
        action={
          <Button variant="gradient" onClick={() => openDialog("task")}>
            <Plus className="h-4 w-4" />
            {t("common.newTask")}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label={t("work.focusTime")} value="3.2" unit="h" icon={Clock} trend={11} accentClass="text-sky-500" bgClass="bg-sky-500/10" />
        <StatCard label={t("work.tasksDone")} value={14} icon={CheckCircle2} trend={6} accentClass="text-emerald-500" bgClass="bg-emerald-500/10" delay={0.05} />
        <StatCard label={t("work.onTrack")} value="86%" icon={Target} accentClass="text-primary" bgClass="bg-primary/10" delay={0.1} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              {t("work.activeProjects")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((p, i) => (
              <div key={p.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted-foreground">{p.tasks}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${p.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${p.progress}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("work.todayFocus")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {focusTasks.map((task) => (
              <div
                key={task.title}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-3 py-2.5"
              >
                {task.done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <span
                  className={`flex-1 text-sm ${task.done ? "text-muted-foreground line-through" : "font-medium"}`}
                >
                  {task.title}
                </span>
                <Badge variant="outline">{task.priority}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <EisenhowerMatrix />
    </div>
  );
}
