import { PLAN_DEFINITIONS } from "@/config/plans";
import type { PlanId } from "@/types/plans";
import { useUserDataStore } from "@/store/user-data-store";

export type BillingCycle = "monthly" | "yearly";

export interface CheckoutResult {
  ok: boolean;
  error?: string;
  planId?: PlanId;
}

function delay(ms = 1200): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Mock checkout — production: Stripe Checkout / Payment Element. */
export async function checkoutPlan(
  planId: PlanId,
  cycle: BillingCycle,
): Promise<CheckoutResult> {
  if (planId === "free") {
    useUserDataStore.getState().setPlan("free");
    return { ok: true, planId: "free" };
  }

  const def = PLAN_DEFINITIONS[planId];
  if (!def) return { ok: false, error: "Unknown plan" };

  await delay();

  const months = cycle === "yearly" ? 12 : 1;
  const end = new Date();
  end.setMonth(end.getMonth() + months);

  useUserDataStore.getState().setPlan(planId, end.toISOString());
  return { ok: true, planId };
}

export function formatPlanPrice(planId: PlanId, cycle: BillingCycle): string {
  const def = PLAN_DEFINITIONS[planId];
  const amount = cycle === "yearly" ? def.priceYearly : def.priceMonthly;
  if (amount === 0) return "0";
  return amount.toLocaleString();
}
