import { motion } from "framer-motion";

import { Lock, Trophy } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";

import { tierColor } from "@/services/awards-service";

import { useI18n } from "@/hooks/use-i18n";

import { cn } from "@/lib/utils";

import { EMPTY_USER_DATA, useUserDataStore } from "@/store/user-data-store";



export default function AwardsPage() {

  const { t } = useI18n();

  const data = useUserDataStore((s) =>

    s.activeUserId ? (s.dataByUser[s.activeUserId] ?? EMPTY_USER_DATA) : EMPTY_USER_DATA,

  );

  const achievements = data.achievements;

  const unlocked = achievements.filter((a) => a.unlocked).length;



  return (

    <div className="space-y-6">

      <PageHeader

        title={t("awardsPage.title")}

        description={t("awardsPage.unlockedOf", {

          unlocked,

          total: achievements.length,

        })}

      />



      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {achievements.map((a, i) => (

          <motion.div

            key={a.id}

            initial={{ opacity: 0, y: 12 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ delay: i * 0.04 }}

            className={cn(

              "relative overflow-hidden rounded-3xl border p-5",

              a.unlocked ? "border-primary/30 bg-card shadow-soft" : "border-border bg-muted/30 opacity-80",

            )}

          >

            <div

              className={cn(

                "mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white",

                tierColor(a.tier),

                !a.unlocked && "grayscale",

              )}

            >

              {a.unlocked ? (

                <Trophy className="h-7 w-7" />

              ) : (

                <Lock className="h-6 w-6" />

              )}

            </div>

            <p className="font-semibold">{a.title}</p>

            <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>

            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">

              {a.tier} · {Math.min(a.progress, a.target)}/{a.target}

            </p>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">

              <div

                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"

                style={{ width: `${Math.min(100, (a.progress / a.target) * 100)}%` }}

              />

            </div>

          </motion.div>

        ))}

      </div>

    </div>

  );

}

