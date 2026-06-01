export type PlanId = "free" | "premium" | "premium_plus";

export type PlanFeatureKey =
  | "ai_coach"
  | "food_scanner"
  | "smart_notifications"
  | "analytics"
  | "advanced_analytics"
  | "priority_support"
  | "export_data"
  | "unlimited_tasks";

export interface PlanLimits {
  aiMessagesPerDay: number;
  foodScansPerDay: number;
}

export interface PlanDefinition {
  id: PlanId;
  nameKey: string;
  taglineKey: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  popular?: boolean;
  limits: PlanLimits;
  features: PlanFeatureKey[];
}

export interface UserSubscription {
  planId: PlanId;
  status: "active" | "trialing" | "canceled";
  /** ISO date when paid period ends (mock billing). */
  currentPeriodEnd?: string;
  aiMessagesToday: number;
  foodScansToday: number;
}

export const DEFAULT_SUBSCRIPTION: UserSubscription = {
  planId: "free",
  status: "active",
  aiMessagesToday: 0,
  foodScansToday: 0,
};
