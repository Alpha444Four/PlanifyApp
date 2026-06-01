import { PageHeader } from "@/components/shared/page-header";
import { AiChatPanel } from "@/components/chat/ai-chat-panel";
import { useI18n } from "@/hooks/use-i18n";
import { useAuth } from "@/store/auth-store";
import { EMPTY_USER_DATA, useUserDataStore } from "@/store/user-data-store";

export default function ChatPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const data = useUserDataStore((s) =>
    s.activeUserId ? (s.dataByUser[s.activeUserId] ?? EMPTY_USER_DATA) : EMPTY_USER_DATA,
  );
  const incrementAi = useUserDataStore((s) => s.incrementAiInteractions);

  if (!user) {
    return (
      <div className="space-y-6">
        <PageHeader title={t("chat.title")} description={t("chat.subtitle")} />
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title={t("chat.title")} description={t("chat.subtitle")} className="hidden sm:block" />
      <AiChatPanel
        userId={user.id}
        userName={user.name}
        coachContext={{ userName: user.name, data }}
        onUserMessage={incrementAi}
      />
    </div>
  );
}
