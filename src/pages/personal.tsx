import { PageHeader } from "@/components/shared/page-header";
import { AiInsightCard } from "@/components/shared/ai-insight-card";
import { SleepTrackerCard } from "@/components/ui/sleep-tracker-card";
import { Skeleton } from "@/components/ui/skeleton";
import { MoodTracker } from "@/components/widgets/mood-tracker";
import { HabitTracker } from "@/components/widgets/habit-tracker";
import { RecoveryScore } from "@/components/widgets/recovery-score";
import { useMockLoading } from "@/hooks/use-mock-loading";
import { sampleSleepData, sleepInsight, moodInsight } from "@/lib/mock-data/health";
import { DailyQuoteCard } from "@/components/shared/daily-quote";
import { JournalCard } from "@/components/personal/journal-card";
import { ShoppingList } from "@/components/personal/shopping-list";
import { useI18n } from "@/hooks/use-i18n";
import { EMPTY_USER_DATA, useUserDataStore } from "@/store/user-data-store";
import { DEFAULT_PREFERENCES } from "@/types/profile";

export default function PersonalPage() {
  const loading = useMockLoading();
  const { t } = useI18n();
  const lang = useUserDataStore((s) =>
    s.activeUserId
      ? (s.dataByUser[s.activeUserId] ?? EMPTY_USER_DATA).preferences.languagePref
      : DEFAULT_PREFERENCES.languagePref,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("personal.title")}
        description={t("personal.subtitle")}
      />

      <DailyQuoteCard language={lang} />

      <div className="grid gap-5 lg:grid-cols-2">
        <JournalCard />
        <ShoppingList />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          {loading ? (
            <Skeleton className="h-80 rounded-3xl" />
          ) : (
            <SleepTrackerCard data={sampleSleepData} />
          )}
          <AiInsightCard insight={sleepInsight} />
        </div>
        <RecoveryScore />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <MoodTracker />
        <div className="space-y-4">
          <HabitTracker />
          <AiInsightCard insight={moodInsight} />
        </div>
      </div>
    </div>
  );
}
