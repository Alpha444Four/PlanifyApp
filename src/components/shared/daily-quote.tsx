import { dailyQuote } from "@/lib/localization";

import type { AppLanguage } from "@/lib/localization/languages";

import { Card, CardContent } from "@/components/ui/card";

import { useI18n } from "@/hooks/use-i18n";



export function DailyQuoteCard({ language }: { language: AppLanguage }) {

  const { t } = useI18n();



  return (

    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">

      <CardContent className="p-5">

        <p className="font-mono text-[10px] uppercase tracking-wider text-primary">

          {t("personal.dailyQuote")} · {language}

        </p>

        <p className="mt-2 text-lg font-semibold leading-snug">{dailyQuote(language)}</p>

      </CardContent>

    </Card>

  );

}

