import { motion } from "framer-motion";

import { AlertCircle } from "lucide-react";

import { Link } from "react-router-dom";

import { PageHeader } from "@/components/shared/page-header";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { useI18n } from "@/hooks/use-i18n";

import type { MoodLevel } from "@/types/health";

import { EMPTY_USER_DATA, useUserDataStore } from "@/store/user-data-store";



const MOODS: { level: MoodLevel; labelKey: string; emoji: string }[] = [

  { level: "great", labelKey: "moodPage.moodGreat", emoji: "😄" },

  { level: "good", labelKey: "moodPage.moodGood", emoji: "🙂" },

  { level: "okay", labelKey: "moodPage.moodOkay", emoji: "😐" },

  { level: "low", labelKey: "moodPage.moodLow", emoji: "😔" },

  { level: "stressed", labelKey: "moodPage.moodStressed", emoji: "😰" },

  { level: "tired", labelKey: "moodPage.moodTired", emoji: "😴" },

];



const LOW_MOODS: MoodLevel[] = ["low", "stressed", "tired"];



export default function MoodPage() {

  const { t } = useI18n();

  const data = useUserDataStore((s) =>

    s.activeUserId ? (s.dataByUser[s.activeUserId] ?? EMPTY_USER_DATA) : EMPTY_USER_DATA,

  );

  const setMoodLevel = useUserDataStore((s) => s.setMoodLevel);

  const mood = data.daily.mood;

  const showAlert = mood && LOW_MOODS.includes(mood);



  return (

    <div className="space-y-6">

      <PageHeader title={t("moodPage.title")} description={t("moodPage.subtitleCheck")} />



      {showAlert && (

        <motion.div

          initial={{ opacity: 0, y: 8 }}

          animate={{ opacity: 1, y: 0 }}

          className="flex flex-col gap-3 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 sm:flex-row sm:items-center sm:justify-between"

        >

          <div className="flex gap-3">

            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

            <div>

              <p className="font-semibold">{t("moodPage.lowMoodTitle")}</p>

              <p className="text-sm text-muted-foreground">{t("moodPage.lowMoodDesc")}</p>

            </div>

          </div>

          <Button asChild variant="gradient" size="sm">

            <Link to="/app/relax">{t("moodPage.startBreathing")}</Link>

          </Button>

        </motion.div>

      )}



      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

        {MOODS.map((m) => (

          <motion.button

            key={m.level}

            type="button"

            whileTap={{ scale: 0.97 }}

            onClick={() => setMoodLevel(m.level)}

            className={`rounded-3xl border p-5 text-left transition-shadow hover:shadow-soft-lg ${

              mood === m.level

                ? "border-primary bg-primary/10 shadow-glow"

                : "border-border bg-card"

            }`}

          >

            <span className="text-3xl">{m.emoji}</span>

            <p className="mt-2 font-semibold">{t(m.labelKey)}</p>

          </motion.button>

        ))}

      </div>



      {!mood && (

        <Card>

          <CardContent className="py-8 text-center text-sm text-muted-foreground">

            {t("moodPage.emptyPrompt")}

          </CardContent>

        </Card>

      )}

    </div>

  );

}

