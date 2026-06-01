import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { Bell, Crown, LogOut, Monitor, Moon, Sparkles, Sun, Trash2 } from "lucide-react";
import { PlanBadge } from "@/components/billing/plan-badge";
import { usePlan } from "@/hooks/use-plan";

import { PageHeader } from "@/components/shared/page-header";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { useTheme, type Theme } from "@/components/theme-provider";

import { useToast } from "@/components/ui/toast";

import { useNotificationStore } from "@/store/notification-store";
import { useUserDataStore } from "@/store/user-data-store";

import { useLogout } from "@/hooks/use-logout";

import { useI18n } from "@/hooks/use-i18n";

import { cn } from "@/lib/utils";

import {

  DEFAULT_REMINDER_SETTINGS,

  getReminderSettings,

  requestBrowserPermission,

  saveReminderSettings,

  showBrowserNotification,

  type ReminderSettings,

} from "@/services/notification-service";

import { useRealApi } from "@/lib/env";

import { useAuth } from "@/store/auth-store";



const themeOptions: { value: Theme; labelKey: string; icon: typeof Sun }[] = [

  { value: "light", labelKey: "settingsPage.themeLight", icon: Sun },

  { value: "dark", labelKey: "settingsPage.themeDark", icon: Moon },

  { value: "system", labelKey: "settingsPage.themeSystem", icon: Monitor },

];



function Toggle({

  label,

  description,

  checked,

  onChange,

}: {

  label: string;

  description: string;

  checked: boolean;

  onChange: (v: boolean) => void;

}) {

  return (

    <div className="flex items-center justify-between gap-4 py-3">

      <div className="min-w-0">

        <p className="text-sm font-medium">{label}</p>

        <p className="text-xs text-muted-foreground">{description}</p>

      </div>

      <button

        type="button"

        role="switch"

        aria-checked={checked}

        aria-label={label}

        onClick={() => onChange(!checked)}

        className={cn(

          "focus-ring relative h-6 w-11 shrink-0 rounded-full transition-colors",

          checked ? "bg-primary" : "bg-muted",

        )}

      >

        <span

          className={cn(

            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",

            checked ? "translate-x-[22px]" : "translate-x-0.5",

          )}

        />

      </button>

    </div>

  );

}



export default function SettingsPage() {

  const { theme, setTheme } = useTheme();

  const { toast } = useToast();

  const { t } = useI18n();

  const logout = useLogout();

  const loadSampleData = useUserDataStore((s) => s.loadSampleData);

  const resetActiveData = useUserDataStore((s) => s.resetActiveData);

  const [reminders, setReminders] = useState<ReminderSettings>(DEFAULT_REMINDER_SETTINGS);

  const realApi = useRealApi();

  const { user } = useAuth();
  const { planId } = usePlan();



  useEffect(() => {

    void getReminderSettings().then(setReminders);

  }, []);



  const patchReminder = async (key: keyof ReminderSettings, value: boolean) => {

    if (key === "browserPush" && value) {

      const ok = await requestBrowserPermission();

      if (!ok) {

        toast({

          title: t("settingsPage.permissionDenied"),

          description: t("settingsPage.enableBrowserNotif"),

          variant: "warning",

        });

        return;

      }

      showBrowserNotification("Planify", t("settingsPage.browserEnabled"));

    }

    const next = { ...reminders, [key]: value };

    setReminders(next);

    await saveReminderSettings(next);

    toast({ title: t("settingsPage.saved") });

  };



  return (

    <div className="space-y-6">

      <PageHeader

        title={t("settingsPage.title")}

        description={realApi ? t("settingsPage.subtitleApi") : t("settingsPage.subtitle")}

      />

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Crown className="h-6 w-6" />
            </span>
            <div>
              <p className="font-semibold">{t("plans.settingsCardTitle")}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("plans.settingsCardDesc")}
              </p>
              <div className="mt-2">
                <PlanBadge />
              </div>
            </div>
          </div>
          <Button variant="gradient" asChild>
            <Link to="/app/plans">
              {planId === "free" ? t("plans.upgradeCta") : t("plans.choosePlan")}
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>

        <CardHeader>

          <CardTitle>{t("settingsPage.appearance")}</CardTitle>

        </CardHeader>

        <CardContent>

          <div className="grid grid-cols-3 gap-3">

            {themeOptions.map((opt) => (

              <button

                key={opt.value}

                type="button"

                onClick={() => {

                  setTheme(opt.value);

                  toast({ title: t("settingsPage.themeSet", { name: t(opt.labelKey) }) });

                }}

                className={cn(

                  "focus-ring flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all",

                  theme === opt.value

                    ? "border-primary bg-primary/5"

                    : "border-border hover:bg-muted",

                )}

              >

                <opt.icon className="h-5 w-5" />

                <span className="text-sm font-medium">{t(opt.labelKey)}</span>

              </button>

            ))}

          </div>

        </CardContent>

      </Card>



      <Card>

        <CardHeader className="flex flex-row items-center justify-between space-y-0">

          <CardTitle>{t("settingsPage.reminders")}</CardTitle>

          <Button asChild variant="ghost" size="sm">

            <Link to="/app/notifications">

              <Bell className="h-4 w-4" />

              {t("common.inbox")}

            </Link>

          </Button>

        </CardHeader>

        <CardContent className="divide-y divide-border">

          <Toggle

            label={t("settingsPage.waterRemind")}

            description={t("settingsPage.waterRemindDesc")}

            checked={reminders.water}

            onChange={(v) => void patchReminder("water", v)}

          />

          <Toggle

            label={t("settingsPage.mealRemind")}

            description={t("settingsPage.mealRemindDesc")}

            checked={reminders.meal}

            onChange={(v) => void patchReminder("meal", v)}

          />

          <Toggle

            label={t("settingsPage.workoutRemind")}

            description={t("settingsPage.workoutRemindDesc")}

            checked={reminders.workout}

            onChange={(v) => void patchReminder("workout", v)}

          />

          <Toggle

            label={t("settingsPage.sleepRemind")}

            description={t("settingsPage.sleepRemindDesc")}

            checked={reminders.sleep}

            onChange={(v) => void patchReminder("sleep", v)}

          />

          <Toggle

            label={t("settingsPage.moodRemind")}

            description={t("settingsPage.moodRemindDesc")}

            checked={reminders.mood}

            onChange={(v) => void patchReminder("mood", v)}

          />

          <Toggle

            label={t("settingsPage.breathingRemind")}

            description={t("settingsPage.breathingRemindDesc")}

            checked={reminders.breathing}

            onChange={(v) => void patchReminder("breathing", v)}

          />

          <Toggle

            label={t("settingsPage.browserPush")}

            description={t("settingsPage.browserPushDesc")}

            checked={reminders.browserPush}

            onChange={(v) => void patchReminder("browserPush", v)}

          />

        </CardContent>

      </Card>



      <Card>

        <CardHeader>

          <CardTitle>{t("settingsPage.referral")}</CardTitle>

        </CardHeader>

        <CardContent className="text-sm text-muted-foreground">

          {t("settingsPage.referralDesc")}

          <code className="mt-2 block rounded-lg bg-muted px-3 py-2 text-xs">

            planify.app/ref/{user?.id?.slice(0, 8) ?? "demo"}

          </code>

        </CardContent>

      </Card>



      <Card>

        <CardHeader>

          <CardTitle>{t("settingsPage.privacy")}</CardTitle>

        </CardHeader>

        <CardContent className="text-sm text-muted-foreground">

          {t("settingsPage.privacyDesc")}

        </CardContent>

      </Card>



      <Card>

        <CardHeader>

          <CardTitle>{t("settingsPage.dataAccount")}</CardTitle>

        </CardHeader>

        <CardContent className="space-y-3">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <p className="text-sm font-medium">{t("settingsPage.demoMode")}</p>

              <p className="text-xs text-muted-foreground">{t("settingsPage.loadSampleDesc")}</p>

            </div>

            <Button

              variant="outline"

              size="sm"

              onClick={() => {

                loadSampleData();

                toast({ title: t("settingsPage.sampleLoaded"), variant: "success" });

              }}

            >

              <Sparkles className="h-4 w-4" />

              {t("common.loadSample")}

            </Button>

          </div>



          <div className="flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <p className="text-sm font-medium">{t("settingsPage.resetMyData")}</p>

              <p className="text-xs text-muted-foreground">{t("settingsPage.resetDesc")}</p>

            </div>

            <Button

              variant="outline"

              size="sm"

              onClick={() => {

                resetActiveData();
                void useNotificationStore.getState().clearAll();

                toast({ title: t("settingsPage.dataCleared"), variant: "warning" });

              }}

            >

              <Trash2 className="h-4 w-4" />

              {t("common.resetData")}

            </Button>

          </div>



          <div className="flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <p className="text-sm font-medium">{t("settingsPage.signOutLabel")}</p>

              <p className="text-xs text-muted-foreground">{t("settingsPage.signOutDesc")}</p>

            </div>

            <Button variant="destructive" size="sm" onClick={() => void logout()}>

              <LogOut className="h-4 w-4" />

              {t("common.signOut")}

            </Button>

          </div>

        </CardContent>

      </Card>

    </div>

  );

}

