import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Moon, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpgradePrompt } from "@/components/billing/upgrade-prompt";
import { useI18n } from "@/hooks/use-i18n";
import { usePlan } from "@/hooks/use-plan";

const sleepTrend = [
  { day: "Mon", hours: 6.2 },
  { day: "Tue", hours: 7.1 },
  { day: "Wed", hours: 5.7 },
  { day: "Thu", hours: 6.8 },
  { day: "Fri", hours: 5.4 },
  { day: "Sat", hours: 8.1 },
  { day: "Sun", hours: 7.6 },
];

const activity = [
  { day: "Mon", minutes: 55 },
  { day: "Tue", minutes: 35 },
  { day: "Wed", minutes: 0 },
  { day: "Thu", minutes: 50 },
  { day: "Fri", minutes: 50 },
  { day: "Sat", minutes: 40 },
  { day: "Sun", minutes: 0 },
];

const balance = [
  { name: "Protein", value: 32, color: "#10b981" },
  { name: "Carbs", value: 45, color: "#0ea5e9" },
  { name: "Fats", value: 23, color: "#f59e0b" },
];

export default function AnalyticsPage() {
  const { t } = useI18n();
  const { hasPlan } = usePlan();

  if (!hasPlan("premium")) {
    return (
      <div className="space-y-6">
        <PageHeader title={t("nav.analytics")} description={t("plans.subtitle")} />
        <UpgradePrompt
          title={t("plans.analyticsLocked")}
          description={t("plans.analyticsLockedDesc")}
          requiredPlanKey="plans.premium.name"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.analytics")}
        description="Weekly trends across sleep, activity, and nutrition balance."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          label="Avg sleep"
          value="6.7"
          unit="h"
          icon={Moon}
          trend={4}
          accentClass="text-indigo-500"
          bgClass="bg-indigo-500/10"
        />
        <StatCard
          label="Training"
          value="230"
          unit="min"
          icon={Activity}
          trend={12}
          accentClass="text-orange-500"
          bgClass="bg-orange-500/10"
          delay={0.05}
        />
        <StatCard
          label="Consistency"
          value="82%"
          icon={TrendingUp}
          accentClass="text-emerald-500"
          bgClass="bg-emerald-500/10"
          delay={0.1}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sleep trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary) / 0.2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity minutes</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minutes" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Macro balance</CardTitle>
        </CardHeader>
        <CardContent className="mx-auto h-72 max-w-sm">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={balance} dataKey="value" innerRadius={60} outerRadius={90}>
                {balance.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
