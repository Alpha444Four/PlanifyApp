import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";

export function UpgradePrompt({
  title,
  description,
  requiredPlanKey = "plans.premium.name",
}: {
  title: string;
  description: string;
  requiredPlanKey?: string;
}) {
  const { t } = useI18n();

  return (
    <Card className="border-primary/25 bg-gradient-to-br from-primary/5 to-[hsl(var(--brand-beige))]/10">
      <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Lock className="h-7 w-7" />
        </span>
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
          <p className="mt-2 text-xs font-medium text-primary">
            {t("plans.upgradeRequires", { plan: t(requiredPlanKey) })}
          </p>
        </div>
        <Button variant="gradient" asChild>
          <Link to="/app/plans">{t("plans.choosePlan")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
