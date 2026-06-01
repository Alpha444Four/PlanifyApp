import { motion } from "framer-motion";

import { CheckCircle2, Clock, Dumbbell, Flame, Target } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";

import { StatCard } from "@/components/shared/stat-card";

import { AiInsightCard } from "@/components/shared/ai-insight-card";

import { WorkoutCard } from "@/components/ui/workout-card";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";

import { useToast } from "@/components/ui/toast";

import { useMockLoading } from "@/hooks/use-mock-loading";

import { useI18n } from "@/hooks/use-i18n";

import {

  sampleTodayWorkout,

  sampleWeeklyProgram,

  sampleWorkoutProgress,

  workoutInsight,

} from "@/lib/mock-data/workout";

import { cn } from "@/lib/utils";



const intensityVariant = {

  Low: "secondary",

  Moderate: "accent",

  High: "warning",

} as const;



export default function GymPage() {

  const loading = useMockLoading();

  const { toast } = useToast();

  const { t } = useI18n();

  const { weeklyGoal, completed, minutesThisWeek, caloriesThisWeek } =

    sampleWorkoutProgress;

  const progressPct = Math.round((completed / weeklyGoal) * 100);



  return (

    <div className="space-y-6">

      <PageHeader title={t("gym.title")} description={t("gym.subtitle")} />



      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

        <StatCard label={t("gym.sessionsThisWeek")} value={`${completed}/${weeklyGoal}`} icon={Target} accentClass="text-primary" bgClass="bg-primary/10" />

        <StatCard label={t("gym.minutesTrained")} value={minutesThisWeek} unit="min" icon={Clock} trend={15} accentClass="text-sky-500" bgClass="bg-sky-500/10" delay={0.05} />

        <StatCard label={t("gym.caloriesBurned")} value={caloriesThisWeek.toLocaleString()} icon={Flame} trend={9} accentClass="text-orange-500" bgClass="bg-orange-500/10" delay={0.1} />

        <StatCard label={t("gym.weeklyGoal")} value={`${progressPct}%`} icon={Dumbbell} accentClass="text-emerald-500" bgClass="bg-emerald-500/10" delay={0.15} />

      </div>



      <div className="grid gap-5 lg:grid-cols-2">

        <div className="space-y-4">

          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">

            {t("gym.todayWorkout")}

          </h3>

          {loading ? (

            <Skeleton className="h-96 rounded-3xl" />

          ) : (

            <WorkoutCard

              {...sampleTodayWorkout}

              onStart={() =>

                toast({

                  title: t("gym.letsGo"),

                  description: t("gym.sessionTimerStarted"),

                  variant: "success",

                })

              }

            />

          )}

        </div>



        <div className="space-y-4">

          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">

            {t("gym.weeklyProgram")}

          </h3>

          <Card>

            <CardContent className="space-y-2 p-4">

              {sampleWeeklyProgram.map((day, i) => (

                <motion.div

                  key={day.day}

                  initial={{ opacity: 0, x: -10 }}

                  whileInView={{ opacity: 1, x: 0 }}

                  viewport={{ once: true }}

                  transition={{ delay: i * 0.04 }}

                  className={cn(

                    "flex items-center gap-3 rounded-2xl border p-3 transition-colors",

                    day.done

                      ? "border-success/30 bg-success/5"

                      : "border-border/60 bg-muted/30",

                  )}

                >

                  <span className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-card text-xs font-bold">

                    {day.day}

                  </span>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-semibold">{day.focus}</p>

                    <p className="text-xs text-muted-foreground">

                      {day.durationMin > 0 ? `${day.durationMin} min` : t("gym.restDay")}

                    </p>

                  </div>

                  {day.done ? (

                    <CheckCircle2 className="h-5 w-5 text-success" />

                  ) : (

                    <Badge variant={intensityVariant[day.intensity]}>

                      {day.intensity}

                    </Badge>

                  )}

                </motion.div>

              ))}

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="grid gap-5 lg:grid-cols-2">

        <Card>

          <CardHeader>

            <CardTitle>{t("gym.workoutProgress")}</CardTitle>

          </CardHeader>

          <CardContent>

            <div className="mb-2 flex items-center justify-between text-sm">

              <span className="text-muted-foreground">{t("gym.weeklyGoal")}</span>

              <span className="font-semibold">

                {t("gym.sessionsOf", { completed, goal: weeklyGoal })}

              </span>

            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">

              <motion.div

                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"

                initial={{ width: 0 }}

                whileInView={{ width: `${progressPct}%` }}

                viewport={{ once: true }}

                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}

              />

            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">

              {[

                { label: t("gym.streak"), value: "6 wks" },

                { label: t("gym.bestLift"), value: "82 kg" },

                { label: t("gym.avgPerDay"), value: "45 min" },

              ].map((s) => (

                <div key={s.label} className="rounded-2xl bg-muted/40 p-3">

                  <p className="text-lg font-bold">{s.value}</p>

                  <p className="text-xs text-muted-foreground">{s.label}</p>

                </div>

              ))}

            </div>

          </CardContent>

        </Card>



        <AiInsightCard insight={workoutInsight} className="lg:h-full" />

      </div>

    </div>

  );

}

