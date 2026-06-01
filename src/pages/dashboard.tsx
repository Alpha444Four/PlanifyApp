import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Apple,
  BellRing,
  Droplets,
  Flame,
  ListChecks,
  Moon,
  Sparkles,
  Dumbbell,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { AiInsightCard } from "@/components/shared/ai-insight-card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { QuickActions } from "@/components/widgets/quick-actions";
import { QuickAddDialog } from "@/components/widgets/quick-add-dialog";
import { TaskList } from "@/components/widgets/task-list";
import { HabitTracker } from "@/components/widgets/habit-tracker";
import { MoodTracker } from "@/components/widgets/mood-tracker";
import { SleepTrackerCard } from "@/components/ui/sleep-tracker-card";
import { WorkoutCard, type ExerciseIcon } from "@/components/ui/workout-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useMockLoading } from "@/hooks/use-mock-loading";
import { sleepInsight } from "@/lib/mock-data/health";
import { workoutInsight } from "@/lib/mock-data/workout";
import { useAuth } from "@/store/auth-store";
import { EMPTY_USER_DATA, useUserDataStore } from "@/store/user-data-store";
import { selectCounters } from "@/services/dashboard-service";
import { getDashboardInsight } from "@/services/ai-coach-service";
import { checkSmartReminders } from "@/services/notification-service";
import { DailyChallenges } from "@/components/widgets/daily-challenges";
import { useI18n } from "@/hooks/use-i18n";

function greetingKey() {
  const h = new Date().getHours();
  if (h < 12) return "dashboard.greetingMorning";
  if (h < 18) return "dashboard.greetingAfternoon";
  return "dashboard.greetingEvening";
}

export default function DashboardPage() {
  const loading = useMockLoading();
  const { toast } = useToast();
  const { t } = useI18n();
  const { user } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  const data = useUserDataStore((s) =>
    s.activeUserId
      ? (s.dataByUser[s.activeUserId] ?? EMPTY_USER_DATA)
      : EMPTY_USER_DATA,
  );
  const loadSampleData = useUserDataStore((s) => s.loadSampleData);

  const counters = selectCounters(data);
  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";
  const coachInsight = getDashboardInsight({ userName: user?.name, data });

  useEffect(() => {
    void checkSmartReminders({
      waterMl: data.daily.waterMl,
      meals: data.meals.length + data.scannedMeals.length,
      moodSet: data.daily.mood !== null,
      trainingMin: data.daily.trainingMinutes,
      language: data.preferences.languagePref,
      userName: user?.name,
    });
  }, [
    data.daily.waterMl,
    data.meals.length,
    data.scannedMeals.length,
    data.daily.mood,
    data.daily.trainingMinutes,
    data.preferences.languagePref,
    user?.name,
  ]);

  const hasAnyData =
    counters.caloriesToday > 0 ||
    counters.stepsToday > 0 ||
    counters.waterMl > 0 ||
    counters.trainingMinutes > 0 ||
    counters.sleepHours > 0 ||
    data.daily.mood !== null ||
    data.tasks.length > 0 ||
    data.habits.length > 0;

  const seedDemo = () => {
    loadSampleData();
    toast({
      title: t("dashboard.sampleLoaded"),
      description: t("dashboard.sampleLoadedDesc"),
      variant: "success",
    });
  };

  const stagger = (i: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay: i * 0.05 },
        };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t(greetingKey())}, ${firstName}`}
        description={t("dashboard.subtitle")}
        action={
          hasAnyData ? undefined : (
            <Button variant="outline" size="sm" onClick={seedDemo}>
              <Sparkles className="h-4 w-4" />
              {t("common.loadSample")}
            </Button>
          )
        }
      />

      {/* Demo banner for a brand-new, empty account */}
      {!hasAnyData && !loading && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 rounded-3xl border border-dashed border-border bg-card/50 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{t("dashboard.zeroTitle")}</p>
              <p className="text-sm text-muted-foreground">
                {t("dashboard.zeroDesc")}
              </p>
            </div>
          </div>
          <Button variant="gradient" size="sm" onClick={seedDemo}>
            <Sparkles className="h-4 w-4" />
            {t("common.loadSample")}
          </Button>
        </motion.div>
      )}

      {/* Today overview counters */}
      <section aria-label="Today overview">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard label={t("dashboard.calories")} value={counters.caloriesToday} unit="kcal" icon={Apple} accentClass="text-sky-500" bgClass="bg-sky-500/10" animate />
              <StatCard label={t("dashboard.protein")} value={counters.proteinToday} unit="g" icon={Flame} accentClass="text-orange-500" bgClass="bg-orange-500/10" animate delay={0.05} />
              <StatCard label={t("dashboard.steps")} value={counters.stepsToday} icon={ListChecks} accentClass="text-emerald-500" bgClass="bg-emerald-500/10" animate delay={0.1} />
              <StatCard label={t("dashboard.water")} value={counters.waterMl} unit="ml" icon={Droplets} accentClass="text-primary" bgClass="bg-primary/10" animate delay={0.15} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard label={t("dashboard.training")} value={counters.trainingMinutes} unit="min" icon={Dumbbell} animate delay={0.05} />
              <StatCard label={t("dashboard.sleep")} value={counters.sleepHours} unit="h" icon={Moon} animate delay={0.1} />
              <StatCard label={t("dashboard.challenges")} value={counters.challengesCompleted} unit={`/${counters.challengesTotal}`} icon={Sparkles} animate delay={0.15} />
              <StatCard label={t("dashboard.awards")} value={counters.awardsUnlocked} unit={`/${counters.awardsTotal}`} icon={Sparkles} animate delay={0.2} />
            </div>
          </>
        )}
      </section>

      {/* AI coach + challenges */}
      <section className="grid gap-5 lg:grid-cols-2" aria-label="Coach and challenges">
        <div className="space-y-3">
          <AiInsightCard
            insight={{
              id: "coach-dash",
              category: "general",
              title: t("dashboard.coachTitle"),
              body: coachInsight,
            }}
          />
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
            <Link to="/app/chat">{t("dashboard.openCoach")}</Link>
          </Button>
        </div>
        <DailyChallenges />
      </section>

      {/* Quick actions */}
      <section aria-label="Quick actions">
        <QuickActions />
      </section>

      {/* Sleep & Recovery + Workout */}
      <section className="grid gap-5 lg:grid-cols-2" aria-label="Sleep and workout">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t("dashboard.sleepRecovery")}
            </h3>
            <Button asChild variant="link" size="sm">
              <Link to="/app/sleep">{t("dashboard.viewDetails")}</Link>
            </Button>
          </div>
          {loading ? (
            <Skeleton className="h-80 rounded-3xl" />
          ) : data.sleep ? (
            <>
              <SleepTrackerCard data={data.sleep} />
              <AiInsightCard insight={sleepInsight} />
            </>
          ) : (
            <EmptySection
              icon={Moon}
              title={t("dashboard.noSleepTitle")}
              description={t("dashboard.noSleepDesc")}
              onSeed={seedDemo}
              loadSampleLabel={t("common.loadSample")}
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t("dashboard.todayWorkout")}
            </h3>
            <Button asChild variant="link" size="sm">
              <Link to="/app/training">{t("dashboard.openTraining")}</Link>
            </Button>
          </div>
          {loading ? (
            <Skeleton className="h-80 rounded-3xl" />
          ) : data.workout ? (
            <>
              <WorkoutCard
                {...data.workout}
                exercises={data.workout.exercises.map((e) => ({
                  name: e.name,
                  detail: e.detail,
                  icon: e.icon as ExerciseIcon | undefined,
                }))}
                onStart={() =>
                  toast({
                    title: t("dashboard.workoutStarted"),
                    description: `${data.workout?.sessionTitle} · ${data.workout?.sessionDuration} min`,
                    variant: "success",
                  })
                }
              />
              <AiInsightCard insight={workoutInsight} />
            </>
          ) : (
            <EmptySection
              icon={Dumbbell}
              title={t("dashboard.noWorkoutTitle")}
              description={t("dashboard.noWorkoutDesc")}
              onSeed={seedDemo}
              loadSampleLabel={t("common.loadSample")}
            />
          )}
        </div>
      </section>

      {/* Plan + habits */}
      <section className="grid gap-5 lg:grid-cols-2" aria-label="Plan and habits">
        <motion.div {...stagger(0)}>
          <TaskList />
        </motion.div>
        <motion.div {...stagger(1)}>
          <HabitTracker />
        </motion.div>
      </section>

      {/* Mood + daily progress */}
      <section className="grid gap-5 lg:grid-cols-3" aria-label="Mood and progress">
        <div className="lg:col-span-2">
          <MoodTracker />
        </div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{t("dashboard.dailyProgress")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tracking-tight">
              <AnimatedCounter value={counters.dailyCompletionPercentage} />
              <span className="ml-1 text-base font-medium text-muted-foreground">
                %
              </span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {counters.totalTasks === 0
                ? t("dashboard.addTasksHint")
                : t("dashboard.tasksComplete", {
                    done: counters.completedTasks,
                    total: counters.totalTasks,
                    pending: counters.pendingTasks,
                  })}
            </p>
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                initial={prefersReducedMotion ? false : { width: 0 }}
                animate={{ width: `${counters.dailyCompletionPercentage}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <BellRing className="h-4 w-4" />
              {t(
                counters.remindersCount === 1
                  ? "dashboard.activeReminders"
                  : "dashboard.activeRemindersPlural",
                { count: counters.remindersCount },
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <QuickAddDialog />
    </div>
  );
}

function EmptySection({
  icon: Icon,
  title,
  description,
  onSeed,
  loadSampleLabel,
}: {
  icon: typeof Moon;
  title: string;
  description: string;
  onSeed: () => void;
  loadSampleLabel: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex h-80 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-card/40 p-6 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="h-7 w-7" />
      </span>
      <div>
        <p className="text-base font-semibold">{title}</p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>
      </div>
      <Button variant="gradient" size="sm" onClick={onSeed}>
        <Sparkles className="h-4 w-4" />
        {loadSampleLabel}
      </Button>
    </motion.div>
  );
}
