import { useRef, useState } from "react";

import { Award, Camera, Flame, ListChecks, LogOut, Save } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Avatar } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { useAuth, useAuthStore } from "@/store/auth-store";

import { EMPTY_USER_DATA, useUserDataStore } from "@/store/user-data-store";

import { selectCounters } from "@/services/dashboard-service";

import { updateProfile } from "@/services/user-service";
import { PhoneVerificationCard } from "@/components/profile/phone-verification";
import { isSupabaseConfigured } from "@/lib/env";

import { useLogout } from "@/hooks/use-logout";

import { useI18n } from "@/hooks/use-i18n";

import { getInitials, providerLabel, cn } from "@/lib/utils";

import { useToast } from "@/components/ui/toast";

import {

  AVATAR_PRESETS,

  FITNESS_LEVEL_OPTIONS,

  MAIN_GOAL_OPTIONS,

  type FitnessLevel,

  type MainGoal,

} from "@/types/profile";

import { LANGUAGE_OPTIONS, type AppLanguage } from "@/lib/localization";



const MAIN_GOAL_I18N: Record<MainGoal, string> = {

  lose_weight: "loseWeight",

  gain_muscle: "gainMuscle",

  maintain: "maintain",

  reduce_stress: "reduceStress",

  improve_sleep: "improveSleep",

  drink_water: "drinkWater",

};



const FITNESS_LEVEL_I18N: Record<FitnessLevel, string> = {

  beginner: "beginner",

  intermediate: "intermediate",

  advanced: "advanced",

};



function memberSince(createdAt?: string): string {

  if (!createdAt) return "—";

  const d = new Date(createdAt);

  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });

}



export default function ProfilePage() {

  const { user } = useAuth();

  const setUser = useAuthStore((s) => s.setUser);

  const logout = useLogout();

  const { toast } = useToast();

  const { t } = useI18n();

  const fileRef = useRef<HTMLInputElement>(null);



  const data = useUserDataStore((s) =>

    s.activeUserId

      ? (s.dataByUser[s.activeUserId] ?? EMPTY_USER_DATA)

      : EMPTY_USER_DATA,

  );

  const updatePreferences = useUserDataStore((s) => s.updatePreferences);

  const counters = selectCounters(data);

  const prefs = data.preferences;



  const [name, setName] = useState(user?.name ?? "");

  const [goals, setGoals] = useState(prefs.goals);

  const [fitnessLevel, setFitnessLevel] = useState(prefs.fitnessLevel);

  const [mainGoal, setMainGoal] = useState(prefs.mainGoal);

  const [languagePref, setLanguagePref] = useState<AppLanguage>(prefs.languagePref);

  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl);

  const [avatarPreset, setAvatarPreset] = useState(prefs.avatarPreset);



  const presetClass =

    AVATAR_PRESETS.find((p) => p.id === avatarPreset)?.className ??

    "bg-gradient-to-br from-primary to-accent";



  const save = async () => {
    if (!user) return;
    const updated = await updateProfile(user.id, {
      name: name.trim() || user.name,
      ...(avatarPreset ? {} : { avatarUrl }),
    });
    if (updated) setUser(updated);
    updatePreferences({ goals, fitnessLevel, mainGoal, avatarPreset, languagePref });
    toast({ title: t("profilePage.saved"), variant: "success" });
  };



  const onFile = (file: File) => {

    if (file.size > 2_000_000) {

      toast({

        title: t("profilePage.imageTooLarge"),

        description: t("profilePage.imageTooLargeDesc"),

        variant: "warning",

      });

      return;

    }

    const reader = new FileReader();

    reader.onload = () => {

      const url = reader.result as string;

      setAvatarUrl(url);

      setAvatarPreset(null);

    };

    reader.readAsDataURL(file);

  };



  const stats = [

    { label: t("profilePage.tasksDone"), value: String(counters.completedTasks) },

    { label: t("profilePage.dayStreak"), value: String(counters.currentStreak) },

    {

      label: t("profilePage.awardsLabel"),

      value: `${counters.awardsUnlocked}/${counters.awardsTotal}`,

    },

  ];



  const langLabel = (value: AppLanguage) => {

    const flags: Record<AppLanguage, string> = {

      darija: "🇲🇦",

      fr: "🇫🇷",

      en: "🇬🇧",

      ar: "🇲🇦",

    };

    return `${flags[value]} ${t(`lang.${value === "darija" ? "darija" : value}`)}`;

  };



  return (

    <div className="space-y-6">

      <PageHeader

        title={t("profilePage.title")}

        description={t("profilePage.subtitle")}

        action={

          <Button variant="gradient" size="sm" onClick={() => void save()}>

            <Save className="h-4 w-4" />

            {t("common.save")}

          </Button>

        }

      />



      {isSupabaseConfigured() && user && (
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant={user.emailVerified ? "default" : "secondary"}>
            Email {user.emailVerified ? "verified" : "pending"}
          </Badge>
          <Badge variant="secondary">Joined {memberSince(user.createdAt)}</Badge>
        </div>
      )}

      {isSupabaseConfigured() && <PhoneVerificationCard />}

      <Card>

        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">

          <div className="flex flex-col items-center gap-3">

            {avatarPreset && !avatarUrl ? (

              <span

                className={cn(

                  "flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold text-white shadow-glow",

                  presetClass,

                )}

              >

                {getInitials(name || user?.name)}

              </span>

            ) : (

              <Avatar

                fallback={getInitials(name || user?.name)}

                src={avatarUrl}

                className="h-24 w-24 text-2xl"

              />

            )}

            <input

              ref={fileRef}

              type="file"

              accept="image/*"

              className="hidden"

              onChange={(e) => {

                const f = e.target.files?.[0];

                if (f) onFile(f);

              }}

            />

            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>

              <Camera className="h-4 w-4" />

              {t("profilePage.uploadPhoto")}

            </Button>

          </div>



          <div className="grid flex-1 gap-4">

            <div>

              <label htmlFor="profile-name" className="text-sm font-medium">

                {t("profilePage.displayName")}

              </label>

              <Input

                id="profile-name"

                className="mt-1.5"

                value={name}

                onChange={(e) => setName(e.target.value)}

              />

            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">

              <span>{user?.email}</span>

              <Badge variant="accent">{providerLabel(user?.provider)}</Badge>

              <span>

                · {t("profilePage.memberSince", { date: memberSince(user?.createdAt) })}

              </span>

            </div>

            <p className="text-xs text-muted-foreground">{t("profilePage.accountSafe")}</p>

          </div>



          <Button variant="outline" className="shrink-0" onClick={() => void logout()}>

            <LogOut className="h-4 w-4" />

            {t("common.signOut")}

          </Button>

        </CardContent>

      </Card>



      <Card>

        <CardHeader>

          <CardTitle>{t("profilePage.avatarStyle")}</CardTitle>

        </CardHeader>

        <CardContent className="flex flex-wrap gap-3">

          {AVATAR_PRESETS.map((p) => (

            <button

              key={p.id}

              type="button"

              aria-label={p.label}

              onClick={() => {

                setAvatarPreset(p.id);

                setAvatarUrl(undefined);

              }}

              className={cn(

                "focus-ring h-12 w-12 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all",

                p.className,

                avatarPreset === p.id ? "ring-primary" : "ring-transparent opacity-80 hover:opacity-100",

              )}

            />

          ))}

        </CardContent>

      </Card>



      <div className="grid gap-5 lg:grid-cols-2">

        <Card>

          <CardHeader>

            <CardTitle>{t("profilePage.goals")}</CardTitle>

          </CardHeader>

          <CardContent className="space-y-4">

            <div>

              <label htmlFor="goals" className="text-sm font-medium">

                {t("profilePage.personalGoals")}

              </label>

              <textarea

                id="goals"

                rows={3}

                value={goals}

                onChange={(e) => setGoals(e.target.value)}

                placeholder={t("profilePage.goalsPlaceholder")}

                className="focus-ring mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"

              />

            </div>

            <div>

              <label htmlFor="fitness" className="text-sm font-medium">

                {t("profilePage.fitnessLevel")}

              </label>

              <select

                id="fitness"

                value={fitnessLevel}

                onChange={(e) => setFitnessLevel(e.target.value as typeof fitnessLevel)}

                className="focus-ring mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"

              >

                {FITNESS_LEVEL_OPTIONS.map((o) => (

                  <option key={o.value} value={o.value}>

                    {t(`fitness.${FITNESS_LEVEL_I18N[o.value]}`)}

                  </option>

                ))}

              </select>

            </div>

            <div>

              <label htmlFor="language" className="text-sm font-medium">

                {t("profilePage.notifLanguage")}

              </label>

              <select

                id="language"

                value={languagePref}

                onChange={(e) => setLanguagePref(e.target.value as AppLanguage)}

                className="focus-ring mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"

              >

                {LANGUAGE_OPTIONS.map((o) => (

                  <option key={o.value} value={o.value}>

                    {langLabel(o.value)}

                  </option>

                ))}

              </select>

            </div>

            <div>

              <label htmlFor="main-goal" className="text-sm font-medium">

                {t("profilePage.mainGoal")}

              </label>

              <select

                id="main-goal"

                value={mainGoal}

                onChange={(e) => setMainGoal(e.target.value as typeof mainGoal)}

                className="focus-ring mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"

              >

                {MAIN_GOAL_OPTIONS.map((o) => (

                  <option key={o.value} value={o.value}>

                    {t(`fitness.${MAIN_GOAL_I18N[o.value]}`)}

                  </option>

                ))}

              </select>

            </div>

          </CardContent>

        </Card>



        <Card>

          <CardHeader>

            <CardTitle>{t("profilePage.yourStats")}</CardTitle>

          </CardHeader>

          <CardContent className="grid grid-cols-3 gap-3">

            {stats.map((s) => (

              <div

                key={s.label}

                className="rounded-2xl border border-border bg-muted/30 p-4 text-center"

              >

                <p className="text-2xl font-bold">{s.value}</p>

                <p className="text-xs text-muted-foreground">{s.label}</p>

              </div>

            ))}

          </CardContent>

          <CardContent className="border-t border-border pt-0">

            <div className="flex items-center gap-2 text-sm text-muted-foreground">

              <Flame className="h-4 w-4 text-orange-500" />

              <ListChecks className="h-4 w-4 text-primary" />

              <Award className="h-4 w-4 text-amber-500" />

              <span>{t("profilePage.trackMore")}</span>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>

  );

}

