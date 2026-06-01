import type { Achievement, UserData } from "@/types/data";
import type { MedalTier } from "@/types/health";

const TIER_ORDER: MedalTier[] = [
  "bronze",
  "silver",
  "gold",
  "platinum",
  "diamond",
];

export function tierColor(tier: MedalTier): string {
  switch (tier) {
    case "bronze":
      return "from-amber-700 to-amber-500";
    case "silver":
      return "from-slate-400 to-slate-300";
    case "gold":
      return "from-yellow-500 to-amber-400";
    case "platinum":
      return "from-cyan-400 to-blue-400";
    case "diamond":
      return "from-violet-400 to-fuchsia-400";
  }
}

/** Recompute achievement progress from user activity. */
export function syncAchievements(data: UserData): Achievement[] {
  const mealCount = data.meals.length + data.scannedMeals.length;
  const workoutDone =
    data.daily.trainingMinutes > 0 || data.completedWorkouts.length > 0;
  const streak = data.streak;

  return data.achievements.map((a) => {
    let progress = a.progress;
    switch (a.id) {
      case "first-meal":
        progress = mealCount > 0 ? 1 : 0;
        break;
      case "first-workout":
        progress = workoutDone ? 1 : 0;
        break;
      case "streak-7":
        progress = Math.min(streak, 7);
        break;
      case "streak-30":
        progress = Math.min(streak, 30);
        break;
      case "streak-100":
        progress = Math.min(streak, 100);
        break;
      case "streak-365":
        progress = Math.min(streak, 365);
        break;
      case "hydration":
        progress = data.daily.waterMl >= data.daily.waterGoalMl ? 1 : 0;
        break;
      case "sleep":
        progress = data.daily.sleepHours >= 7 ? 1 : 0;
        break;
      case "calm":
        progress = Math.min(data.breathingSessions, 10);
        break;
      case "steps":
        progress = data.daily.steps;
        break;
    }
    const unlocked = progress >= a.target;
    return { ...a, progress, unlocked };
  });
}

export function unlockedCount(achievements: Achievement[]): number {
  return achievements.filter((a) => a.unlocked).length;
}

export function highestTier(achievements: Achievement[]): MedalTier | null {
  const unlocked = achievements.filter((a) => a.unlocked);
  if (!unlocked.length) return null;
  let best = 0;
  for (const a of unlocked) {
    const idx = TIER_ORDER.indexOf(a.tier);
    if (idx > best) best = idx;
  }
  return TIER_ORDER[best];
}
