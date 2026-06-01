import { useCallback, useMemo } from "react";
import { PLAN_DEFINITIONS, planIncludesFeature, meetsMinimumPlan } from "@/config/plans";
import type { PlanFeatureKey, PlanId } from "@/types/plans";
import { EMPTY_USER_DATA, useUserDataStore } from "@/store/user-data-store";

export function usePlan() {
  const subscription = useUserDataStore((s) =>
    s.activeUserId
      ? (s.dataByUser[s.activeUserId] ?? EMPTY_USER_DATA).subscription
      : EMPTY_USER_DATA.subscription,
  );

  const planId = subscription.planId;
  const definition = PLAN_DEFINITIONS[planId];

  const canUseFeature = useCallback(
    (feature: PlanFeatureKey) => planIncludesFeature(planId, feature),
    [planId],
  );

  const hasPlan = useCallback(
    (required: PlanId) => meetsMinimumPlan(planId, required),
    [planId],
  );

  const aiRemaining = useMemo(() => {
    const max = definition.limits.aiMessagesPerDay;
    return Math.max(0, max - subscription.aiMessagesToday);
  }, [definition, subscription.aiMessagesToday]);

  const scanRemaining = useMemo(() => {
    const max = definition.limits.foodScansPerDay;
    return Math.max(0, max - subscription.foodScansToday);
  }, [definition, subscription.foodScansToday]);

  const canSendAi = aiRemaining > 0;
  const canScanFood = scanRemaining > 0;

  return {
    planId,
    subscription,
    definition,
    canUseFeature,
    hasPlan,
    aiRemaining,
    scanRemaining,
    canSendAi,
    canScanFood,
    isPaid: planId !== "free",
  };
}
