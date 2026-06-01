import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlanBadge } from "@/components/billing/plan-badge";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/hooks/use-i18n";
import { usePlan } from "@/hooks/use-plan";
import {
  FEATURE_LABEL_KEYS,
  PLAN_DEFINITIONS,
  PLAN_ORDER,
} from "@/config/plans";
import { checkoutPlan, formatPlanPrice, type BillingCycle } from "@/services/billing-service";
import type { PlanId } from "@/types/plans";
import { cn } from "@/lib/utils";

const planIcons: Record<PlanId, typeof Zap> = {
  free: Zap,
  premium: Sparkles,
  premium_plus: Crown,
};

export default function ChoosePlanPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { planId: currentPlan } = usePlan();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [loading, setLoading] = useState<PlanId | null>(null);

  const handleSelect = async (id: PlanId) => {
    if (id === currentPlan) return;
    setLoading(id);
    try {
      const result = await checkoutPlan(id, cycle);
      if (!result.ok) {
        toast({ title: t("plans.checkoutFailed"), variant: "warning" });
        return;
      }
      toast({
        title: t("plans.checkoutSuccess"),
        description: t(`plans.${id === "premium_plus" ? "plus" : id}.name`),
        variant: "success",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("plans.title")}
        description={t("plans.subtitle")}
        action={<PlanBadge />}
      />

      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl border border-border bg-muted/50 p-1">
          <button
            type="button"
            onClick={() => setCycle("monthly")}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              cycle === "monthly" ? "bg-card shadow-soft" : "text-muted-foreground",
            )}
          >
            {t("plans.monthly")}
          </button>
          <button
            type="button"
            onClick={() => setCycle("yearly")}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              cycle === "yearly" ? "bg-card shadow-soft" : "text-muted-foreground",
            )}
          >
            {t("plans.yearly")}
            <span className="ml-1 text-xs text-success">-17%</span>
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {PLAN_ORDER.map((id, index) => {
          const def = PLAN_DEFINITIONS[id];
          const Icon = planIcons[id];
          const isCurrent = currentPlan === id;
          const price = formatPlanPrice(id, cycle);
          const nameKey = id === "premium_plus" ? "plus" : id;

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card
                className={cn(
                  "relative h-full overflow-hidden",
                  def.popular && "ring-2 ring-primary shadow-glow",
                  isCurrent && "ring-2 ring-success/50",
                )}
              >
                {def.popular ? (
                  <Badge className="absolute right-4 top-4" variant="default">
                    {t("plans.mostPopular")}
                  </Badge>
                ) : null}
                {isCurrent ? (
                  <Badge className="absolute left-4 top-4" variant="success">
                    {t("plans.currentPlan")}
                  </Badge>
                ) : null}

                <CardContent className="flex h-full flex-col p-6 pt-12">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold">{t(`plans.${nameKey}.name`)}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t(`plans.${nameKey}.tagline`)}
                  </p>

                  <p className="mt-5">
                    <span className="text-4xl font-bold tracking-tight">{price}</span>
                    {def.priceMonthly > 0 ? (
                      <span className="ml-1 text-sm text-muted-foreground">
                        {def.currency} / {cycle === "yearly" ? t("plans.year") : t("plans.month")}
                      </span>
                    ) : (
                      <span className="ml-1 text-sm text-muted-foreground">
                        {def.currency}
                      </span>
                    )}
                  </p>

                  <ul className="mt-6 flex-1 space-y-2.5">
                    {def.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span>{t(FEATURE_LABEL_KEYS[f])}</span>
                      </li>
                    ))}
                    {id === "free" ? (
                      <li className="text-xs text-muted-foreground">
                        {t("plans.free.limits", {
                          ai: def.limits.aiMessagesPerDay,
                          scans: def.limits.foodScansPerDay,
                        })}
                      </li>
                    ) : null}
                  </ul>

                  <Button
                    variant={def.popular ? "gradient" : "outline"}
                    className="mt-6 w-full"
                    disabled={isCurrent || loading !== null}
                    onClick={() => void handleSelect(id)}
                  >
                    {loading === id
                      ? t("plans.processing")
                      : isCurrent
                        ? t("plans.currentPlan")
                        : id === "free"
                          ? t("plans.downgradeFree")
                          : t("plans.upgradeTo", { plan: t(`plans.${nameKey}.name`) })}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {t("plans.checkoutNote")}{" "}
        <Link to="/app/settings" className="text-primary underline-offset-2 hover:underline">
          {t("nav.settings")}
        </Link>
      </p>
    </div>
  );
}
