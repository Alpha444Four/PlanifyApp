import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useI18n } from "@/hooks/use-i18n";



const quadrantKeys = [

  { tagKey: "work.q1Tag", titleKey: "work.q1Title", descKey: "work.q1Desc", className: "border-emerald-500/30 bg-emerald-500/5", tagClass: "text-emerald-500" },

  { tagKey: "work.q2Tag", titleKey: "work.q2Title", descKey: "work.q2Desc", className: "border-amber-500/30 bg-amber-500/5", tagClass: "text-amber-500" },

  { tagKey: "work.q3Tag", titleKey: "work.q3Title", descKey: "work.q3Desc", className: "border-primary/30 bg-primary/5", tagClass: "text-primary" },

  { tagKey: "work.q4Tag", titleKey: "work.q4Title", descKey: "work.q4Desc", className: "border-red-500/20 bg-red-500/5", tagClass: "text-red-500" },

] as const;



export function EisenhowerMatrix() {

  const { t } = useI18n();



  return (

    <Card>

      <CardHeader>

        <CardTitle>{t("work.eisenhower")}</CardTitle>

      </CardHeader>

      <CardContent>

        <div className="grid gap-3 sm:grid-cols-2">

          {quadrantKeys.map((q, i) => (

            <motion.div

              key={q.titleKey}

              initial={{ opacity: 0, y: 8 }}

              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ once: true }}

              transition={{ delay: i * 0.05 }}

              className={`rounded-2xl border p-4 ${q.className}`}

            >

              <span className={`font-mono text-[10px] uppercase tracking-wider ${q.tagClass}`}>

                {t(q.tagKey)}

              </span>

              <p className="mt-2 font-semibold">{t(q.titleKey)}</p>

              <p className="mt-1 text-sm text-muted-foreground">{t(q.descKey)}</p>

            </motion.div>

          ))}

        </div>

      </CardContent>

    </Card>

  );

}

