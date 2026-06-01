import { useState } from "react";

import { Footprints } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";

import { ProgressRing } from "@/components/shared/progress-ring";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { useToast } from "@/components/ui/toast";

import { useI18n } from "@/hooks/use-i18n";

import { EMPTY_USER_DATA, useUserDataStore } from "@/store/user-data-store";



export default function StepsPage() {

  const { toast } = useToast();

  const { t } = useI18n();

  const [input, setInput] = useState("");

  const data = useUserDataStore((s) =>

    s.activeUserId ? (s.dataByUser[s.activeUserId] ?? EMPTY_USER_DATA) : EMPTY_USER_DATA,

  );

  const setSteps = useUserDataStore((s) => s.setSteps);

  const { steps, stepsGoal } = data.daily;



  const save = () => {

    const n = parseInt(input, 10);

    if (Number.isNaN(n) || n < 0) return;

    setSteps(n);

    toast({

      title: t("stepsPage.stepsUpdated"),

      description: `${n.toLocaleString()} steps`,

      variant: "success",

    });

    setInput("");

  };



  return (

    <div className="space-y-6">

      <PageHeader title={t("stepsPage.title")} description={t("stepsPage.subtitleSync")} />



      <Card className="flex flex-col items-center gap-6 p-8">

        <Footprints className="h-10 w-10 text-primary" />

        <p className="text-4xl font-bold">{steps.toLocaleString()}</p>

        <ProgressRing value={steps} max={stepsGoal} label={t("stepsPage.dailyGoal")} />

        <div className="flex w-full max-w-xs gap-2">

          <Input

            type="number"

            placeholder={t("stepsPage.enterSteps")}

            value={input}

            onChange={(e) => setInput(e.target.value)}

          />

          <Button variant="gradient" onClick={save}>

            {t("common.save")}

          </Button>

        </div>

        {steps === 0 && (

          <CardContent className="p-0 text-center text-sm text-muted-foreground">

            {t("stepsPage.zeroHint")}

          </CardContent>

        )}

      </Card>

    </div>

  );

}

