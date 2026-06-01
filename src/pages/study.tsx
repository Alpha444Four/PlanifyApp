import { motion } from "framer-motion";
import { BookOpen, Brain, Clock, Flame, GraduationCap, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PomodoroTimer } from "@/components/study/pomodoro-timer";
import { useI18n } from "@/hooks/use-i18n";

const courses = [
  { name: "Spanish · B1", progress: 64, next: "Lesson 18 · Past tense", color: "from-emerald-500 to-teal-500" },
  { name: "System Design", progress: 38, next: "Module 4 · Caching", color: "from-sky-500 to-cyan-500" },
  { name: "Calculus refresh", progress: 22, next: "Limits & continuity", color: "from-violet-500 to-fuchsia-500" },
];

const sessions = [
  { time: "08:30", title: "Spanish vocab", dur: "25 min", tag: "Active recall" },
  { time: "18:30", title: "System design reading", dur: "40 min", tag: "Deep focus" },
];

export default function StudyPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("study.title")}
        description={t("study.subtitle")}
        action={
          <Button variant="gradient">
            <Plus className="h-4 w-4" />
            {t("common.newCourse")}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label={t("study.studyTime")} value="6.5" unit="h" icon={Clock} trend={18} accentClass="text-sky-500" bgClass="bg-sky-500/10" />
        <StatCard label={t("study.dayStreak")} value={9} icon={Flame} accentClass="text-orange-500" bgClass="bg-orange-500/10" delay={0.05} />
        <StatCard label={t("study.cardsReviewed")} value={142} icon={Brain} trend={12} accentClass="text-violet-500" bgClass="bg-violet-500/10" delay={0.1} />
        <StatCard label={t("study.courses")} value={3} icon={GraduationCap} accentClass="text-primary" bgClass="bg-primary/10" delay={0.15} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {t("study.coursesProgress")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.map((c, i) => (
              <div key={c.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground">{c.progress}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn("h-full rounded-full bg-gradient-to-r", c.color)}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{t("study.upNext", { next: c.next })}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("study.todaySessions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sessions.map((s) => (
              <div
                key={s.title}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3"
              >
                <span className="w-14 text-sm font-medium tabular-nums text-muted-foreground">
                  {s.time}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.dur}</p>
                </div>
                <Badge variant="accent">{s.tag}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <PomodoroTimer />
    </div>
  );
}
