import { useState } from "react";

import { Moon } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { AnimatedProgressBar } from "@/components/shared/animated-progress";

import { useToast } from "@/components/ui/toast";

import { useI18n } from "@/hooks/use-i18n";

import { EMPTY_USER_DATA, useUserDataStore } from "@/store/user-data-store";



export default function SleepPage() {

  const { toast } = useToast();

  const { t } = useI18n();

  const [hours, setHours] = useState("7");

  const [quality, setQuality] = useState("75");

  const data = useUserDataStore((s) =>

    s.activeUserId ? (s.dataByUser[s.activeUserId] ?? EMPTY_USER_DATA) : EMPTY_USER_DATA,

  );

  const logSleep = useUserDataStore((s) => s.logSleep);

  const d = data.daily;



  const save = () => {

    const h = parseFloat(hours) || 0;

    const q = Math.min(100, Math.max(0, parseInt(quality, 10) || 0));

    logSleep(h, q);

    toast({

      title: t("sleepPage.sleepLogged"),

      description: t("sleepPage.sleepLoggedDesc", { hours: h, quality: q }),

      variant: "success",

    });

  };



  return (

    <div className="space-y-6">

      <PageHeader title={t("sleepPage.title")} description={t("sleepPage.subtitleLog")} />



      <div className="grid gap-5 lg:grid-cols-2">

        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <Moon className="h-5 w-5 text-primary" />

              {t("sleepPage.logLastNight")}

            </CardTitle>

          </CardHeader>

          <CardContent className="space-y-4">

            <div>

              <label className="text-sm font-medium">{t("sleepPage.hoursSlept")}</label>

              <Input type="number" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="mt-1" />

            </div>

            <div>

              <label className="text-sm font-medium">{t("sleepPage.qualityLabel")}</label>

              <Input type="number" value={quality} onChange={(e) => setQuality(e.target.value)} className="mt-1" />

            </div>

            <Button variant="gradient" onClick={save}>

              {t("sleepPage.saveSleep")}

            </Button>

          </CardContent>

        </Card>



        <Card>

          <CardHeader>

            <CardTitle>{t("sleepPage.today")}</CardTitle>

          </CardHeader>

          <CardContent>

            {d.sleepHours === 0 ? (

              <p className="text-sm text-muted-foreground">{t("sleepPage.noSleepYet")}</p>

            ) : (

              <>

                <p className="text-4xl font-bold">

                  {d.sleepHours}

                  <span className="ml-1 text-base font-medium text-muted-foreground">

                    {t("sleepPage.hours")}

                  </span>

                </p>

                <p className="mt-1 text-sm text-muted-foreground">

                  {t("sleepPage.qualityScore", { score: d.sleepQuality })}

                </p>

                <div className="mt-4">

                  <AnimatedProgressBar value={d.sleepQuality} />

                </div>

              </>

            )}

          </CardContent>

        </Card>

      </div>

    </div>

  );

}

