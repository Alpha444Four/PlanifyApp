import type { PlanDefinition, PlanFeatureKey, PlanId } from "@/types/plans";

export const PLAN_ORDER: PlanId[] = ["free", "premium", "premium_plus"];

export const PLAN_DEFINITIONS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    nameKey: "plans.free.name",
    taglineKey: "plans.free.tagline",
    priceMonthly: 0,
    priceYearly: 0,
    currency: "MAD",
    limits: { aiMessagesPerDay: 8, foodScansPerDay: 3 },
    features: ["ai_coach", "food_scanner", "smart_notifications"],
  },
  premium: {
    id: "premium",
    nameKey: "plans.premium.name",
    taglineKey: "plans.premium.tagline",
    priceMonthly: 79,
    priceYearly: 790,
    currency: "MAD",
    popular: true,
    limits: { aiMessagesPerDay: 9999, foodScansPerDay: 9999 },
    features: [
      "ai_coach",
      "food_scanner",
      "smart_notifications",
      "analytics",
      "export_data",
      "unlimited_tasks",
      "priority_support",
    ],
  },
  premium_plus: {
    id: "premium_plus",
    nameKey: "plans.plus.name",
    taglineKey: "plans.plus.tagline",
    priceMonthly: 149,
    priceYearly: 1490,
    currency: "MAD",
    limits: { aiMessagesPerDay: 9999, foodScansPerDay: 9999 },
    features: [
      "ai_coach",
      "food_scanner",
      "smart_notifications",
      "analytics",
      "advanced_analytics",
      "export_data",
      "unlimited_tasks",
      "priority_support",
    ],
  },
};

export const FEATURE_LABEL_KEYS: Record<PlanFeatureKey, string> = {
  ai_coach: "plans.features.aiCoach",
  food_scanner: "plans.features.foodScanner",
  smart_notifications: "plans.features.smartNotifications",
  analytics: "plans.features.analytics",
  advanced_analytics: "plans.features.advancedAnalytics",
  export_data: "plans.features.exportData",
  unlimited_tasks: "plans.features.unlimitedTasks",
  priority_support: "plans.features.prioritySupport",
};

export function planRank(id: PlanId): number {
  return PLAN_ORDER.indexOf(id);
}

export function planIncludesFeature(planId: PlanId, feature: PlanFeatureKey): boolean {
  return PLAN_DEFINITIONS[planId].features.includes(feature);
}

export function meetsMinimumPlan(current: PlanId, required: PlanId): boolean {
  return planRank(current) >= planRank(required);
}
