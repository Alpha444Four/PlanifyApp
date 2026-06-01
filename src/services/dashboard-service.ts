import type { UserData } from "@/types/data";

export interface DashboardCounters {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  activeHabits: number;
  caloriesToday: number;
  proteinToday: number;
  carbsToday: number;
  fatsToday: number;
  stepsToday: number;
  waterMl: number;
  waterGoalMl: number;
  trainingMinutes: number;
  sleepHours: number;
  sleepQuality: number;
  remindersCount: number;
  currentStreak: number;
  aiRoutineChecks: number;
  dailyCompletionPercentage: number;
  challengesCompleted: number;
  challengesTotal: number;
  awardsUnlocked: number;
  awardsTotal: number;
}

export function selectCounters(data: UserData): DashboardCounters {
  const totalTasks = data.tasks.length;
  const completedTasks = data.tasks.filter((t) => t.done).length;
  const pendingTasks = totalTasks - completedTasks;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    activeHabits: data.habits.length,
    caloriesToday: data.daily.calories,
    proteinToday: data.daily.protein,
    carbsToday: data.daily.carbs,
    fatsToday: data.daily.fats,
    stepsToday: data.daily.steps,
    waterMl: data.daily.waterMl,
    waterGoalMl: data.daily.waterGoalMl,
    trainingMinutes: data.daily.trainingMinutes,
    sleepHours: data.daily.sleepHours,
    sleepQuality: data.daily.sleepQuality,
    remindersCount: data.reminders.filter((r) => !r.done).length,
    currentStreak: data.streak,
    aiRoutineChecks: data.aiInteractions,
    dailyCompletionPercentage:
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
    challengesCompleted: data.challenges.filter((c) => c.completed).length,
    challengesTotal: data.challenges.length,
    awardsUnlocked: data.achievements.filter((a) => a.unlocked).length,
    awardsTotal: data.achievements.length,
  };
}
