import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { useI18n } from "@/hooks/use-i18n";



const JOURNAL_KEY = "planify:journal-today";



export function JournalCard() {

  const { t } = useI18n();

  const [text, setText] = useState(() => localStorage.getItem(JOURNAL_KEY) ?? "");



  const save = () => {

    localStorage.setItem(JOURNAL_KEY, text);

  };



  return (

    <Card>

      <CardHeader>

        <CardTitle>{t("personal.journal")}</CardTitle>

      </CardHeader>

      <CardContent className="space-y-3">

        <textarea

          rows={4}

          value={text}

          onChange={(e) => setText(e.target.value)}

          placeholder={t("personal.journalPlaceholder")}

          className="focus-ring w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"

        />

        <Button variant="outline" size="sm" onClick={save}>

          {t("personal.journalSave")}

        </Button>

      </CardContent>

    </Card>

  );

}

