import { Crown, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlan } from "@/hooks/use-plan";
import { useI18n } from "@/hooks/use-i18n";
import type { PlanId } from "@/types/plans";

const styles: Record<
  PlanId,
  { icon: typeof Zap; className: string }
> = {
  free: { icon: Zap, className: "bg-muted text-muted-foreground" },
  premium: { icon: Sparkles, className: "bg-primary/15 text-primary" },
  premium_plus: { icon: Crown, className: "bg-gradient-to-r from-primary to-[hsl(var(--brand-beige))] text-primary-foreground" },
};

export function PlanBadge({ className }: { className?: string }) {
  const { planId } = usePlan();
  const { t } = useI18n();
  const meta = styles[planId];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        meta.className,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {t(`plans.${planId === "premium_plus" ? "plus" : planId}.name`)}
    </span>
  );
}
