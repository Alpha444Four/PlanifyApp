import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BellOff,
  CheckCheck,
  Droplets,
  Dumbbell,
  ListTodo,
  Moon,
  Smile,
  Sparkles,
  Utensils,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/store/notification-store";
import type { AppNotification, ReminderKind } from "@/services/notification-service";

const kindMeta: Record<ReminderKind, { icon: LucideIcon; color: string }> = {
  water: { icon: Droplets, color: "text-primary bg-primary/10" },
  meal: { icon: Utensils, color: "text-amber-500 bg-amber-500/10" },
  workout: { icon: Dumbbell, color: "text-orange-500 bg-orange-500/10" },
  sleep: { icon: Moon, color: "text-indigo-500 bg-indigo-500/10" },
  mood: { icon: Smile, color: "text-emerald-500 bg-emerald-500/10" },
  breathing: { icon: Wind, color: "text-sky-500 bg-sky-500/10" },
  task: { icon: ListTodo, color: "text-primary bg-primary/10" },
};

export default function NotificationsPage() {
  const { t } = useI18n();
  const items = useNotificationStore((s) => s.items);
  const loading = useNotificationStore((s) => s.loading);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const clearAll = useNotificationStore((s) => s.clearAll);

  const timeAgo = useCallback(
    (iso: string): string => {
      const diff = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return t("notificationsPage.justNow");
      if (mins < 60) return `${mins}m`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h`;
      return "Yesterday";
    },
    [t],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("notificationsPage.title")}
        description={t("notificationsPage.subtitleApi")}
        action={
          items.length > 0 ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => void markAllRead()}>
                <CheckCheck className="h-4 w-4" />
                {t("common.markAllRead")}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => void clearAll()}>
                {t("common.clear")}
              </Button>
            </div>
          ) : undefined
        }
      />

      {loading && items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      ) : items.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title={t("notificationsPage.emptyTitle")}
          description={t("notificationsPage.emptyDescLong")}
        />
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {items.map((n: AppNotification) => {
              const meta = kindMeta[n.kind] ?? {
                icon: Sparkles,
                color: "text-primary bg-primary/10",
              };
              const Icon = meta.icon;
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className={cn(!n.read && "ring-1 ring-primary/20")}>
                    <CardContent className="flex items-start gap-3 p-4">
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                          meta.color,
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{n.title}</p>
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {timeAgo(n.createdAt)}
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
