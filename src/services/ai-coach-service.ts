import type { UserData } from "@/types/data";
import { selectCounters } from "@/services/dashboard-service";

/**
 * AI COACH SERVICE — Planify (MOCK, LLM-ready)
 * ---------------------------------------------------------------------------
 * Production: streaming chat to /api/ai/coach with system prompt + user stats.
 * Env: VITE_API_BASE_URL (server holds OPENAI_API_KEY).
 * ---------------------------------------------------------------------------
 */

export interface CoachContext {
  userName?: string;
  data?: UserData;
}

const SUGGESTIONS = [
  "How should I start my day?",
  "Am I drinking enough water?",
  "Suggest a light workout",
  "I'm feeling stressed",
  "Review my nutrition today",
  "Help me sleep better tonight",
];

export function getSuggestedPrompts(): string[] {
  return SUGGESTIONS;
}

function delay(ms = 900): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Simulated streaming for a ChatGPT-like typing effect. */
export async function streamCoachReply(
  prompt: string,
  ctx: CoachContext,
  onChunk: (text: string) => void,
): Promise<string> {
  const full = await getCoachReply(prompt, ctx);
  const tokens = full.split(/(\s+)/);
  let acc = "";
  for (const token of tokens) {
    acc += token;
    onChunk(acc);
    await delay(28);
  }
  return full;
}

export async function getCoachReply(
  prompt: string,
  ctx: CoachContext,
): Promise<string> {
  await delay();
  const p = prompt.toLowerCase();
  const name = ctx.userName?.split(/\s+/)[0] ?? "there";
  const data = ctx.data;
  const c = data ? selectCounters(data) : null;
  const d = data?.daily;

  if (p.includes("stress") || p.includes("anxious") || p.includes("tired")) {
    return `${name}, your mood matters. Take 2 minutes for box breathing: inhale 4s, hold 4s, exhale 6s. Open Relax in Planify for a guided session. Small resets compound into big wins.`;
  }

  if (p.includes("water") || p.includes("hydrat")) {
    const ml = d?.waterMl ?? 0;
    const goal = d?.waterGoalMl ?? 2500;
    if (ml === 0) {
      return `You haven't logged water yet today. Start with 500ml now — your goal is ${goal}ml. Tap +250ml on the Water page after each glass.`;
    }
    return `You've had ${ml}ml of ${goal}ml today (${Math.round((ml / goal) * 100)}%). ${ml < goal / 2 ? "Pick up the pace this afternoon." : "Great hydration — finish strong!"}`;
  }

  if (p.includes("sleep")) {
    const hrs = d?.sleepHours ?? 0;
    if (hrs === 0) {
      return "No sleep logged yet. Tonight: dim screens 45 min before bed, cool room, consistent wake time. Log hours in Sleep after you wake up.";
    }
    return `You logged ${hrs}h with ${d?.sleepQuality ?? 0}% quality. ${hrs < 7 ? "Aim for 7–8h tonight — try a 30 min earlier wind-down." : "Solid rest — keep the routine consistent."}`;
  }

  if (p.includes("workout") || p.includes("train") || p.includes("gym")) {
    const mins = d?.trainingMinutes ?? 0;
    if (mins === 0) {
      return "No training logged today. Open Training for a 15–20 min session — even a walk counts. Your body adapts to consistency, not perfection.";
    }
    return `${mins} training minutes today — strong work. Tomorrow, balance intensity with recovery based on how you feel.`;
  }

  if (p.includes("food") || p.includes("meal") || p.includes("calor")) {
    const cal = d?.calories ?? 0;
    if (cal === 0) {
      return "Start by logging your first meal — use Food Scanner for a quick estimate. Your progress begins at zero; every log builds clarity.";
    }
    return `Today: ${cal} kcal · P ${d?.protein ?? 0}g · C ${d?.carbs ?? 0}g · F ${d?.fats ?? 0}g. ${c && c.completedTasks > 0 ? `You also completed ${c.completedTasks} tasks — nice momentum.` : "Add protein at your next meal for steady energy."}`;
  }

  if (p.includes("step")) {
    const steps = d?.steps ?? 0;
    return steps === 0
      ? "Log your steps on the Steps page — even a short walk moves the needle. Target 5,000+ for today's challenge."
      : `${steps} steps so far. ${steps >= 5000 ? "Challenge crushed — keep moving!" : `${5000 - steps} more to hit today's step challenge.`}`;
  }

  return `Hey ${name}! I'm your Planify coach. ${c ? `Today: ${c.caloriesToday} kcal logged, ${c.currentStreak} day streak.` : "Your dashboard is fresh — log a meal, water, or mood to unlock personalized tips."} What would you like to improve?`;
}

/** One-line dashboard tip from today's stats (sync, no API). */
export function getDashboardInsight(ctx: CoachContext): string {
  const data = ctx.data;
  const c = data ? selectCounters(data) : null;
  const d = data?.daily;
  const name = ctx.userName?.split(/\s+/)[0] ?? "there";

  if (!d || (d.calories === 0 && d.waterMl === 0 && !d.mood)) {
    return `${name}, your progress begins at zero. Start by logging your first meal or a glass of water.`;
  }
  if (d.mood === "low" || d.mood === "stressed" || d.mood === "tired") {
    return "Your mood seems low today. Take 2 minutes to breathe and reset — open Relax for a guided session.";
  }
  const challengesDone = data?.challenges.filter((x) => x.completed).length ?? 0;
  const challengesTotal = data?.challenges.length ?? 0;
  if (challengesDone < challengesTotal && d.waterMl < 1000) {
    return "Hydration fuels focus — log water now to move today's challenge forward.";
  }
  if (d.calories === 0) {
    return "Start your day by logging your first meal — Food Scanner makes it fast.";
  }
  return `Nice momentum, ${name}. ${c?.caloriesToday ?? 0} kcal · ${c?.challengesCompleted ?? 0}/${c?.challengesTotal ?? 0} challenges · ${c?.currentStreak ?? 0} day streak.`;
}
