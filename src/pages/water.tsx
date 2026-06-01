import { motion } from "framer-motion";

import { Droplets, Plus } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";

import { ProgressRing } from "@/components/shared/progress-ring";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/toast";

import { useI18n } from "@/hooks/use-i18n";

import { EMPTY_USER_DATA, useUserDataStore } from "@/store/user-data-store";



const AMOUNTS = [

  { label: "+250ml", ml: 250 },

  { label: "+500ml", ml: 500 },

  { label: "+750ml", ml: 750 },

];



export default function WaterPage() {

  const { toast } = useToast();

  const { t } = useI18n();

  const data = useUserDataStore((s) =>

    s.activeUserId ? (s.dataByUser[s.activeUserId] ?? EMPTY_USER_DATA) : EMPTY_USER_DATA,

  );

  const addWater = useUserDataStore((s) => s.addWater);

  const { waterMl, waterGoalMl } = data.daily;



  const add = (ml: number) => {

    addWater(ml);

    toast({

      title: t("waterPage.waterLogged"),

      description: t("waterPage.waterAdded", { ml }),

      variant: "success",

    });

  };



  return (

    <div className="space-y-6">

      <PageHeader title={t("waterPage.title")} description={t("waterPage.subtitleTap")} />



      <Card className="flex flex-col items-center gap-6 p-8">

        <ProgressRing

          value={waterMl}

          max={waterGoalMl}

          label={t("waterPage.dailyHydration")}

          sublabel={`${waterMl} / ${waterGoalMl} ml`}

        />

        <div className="grid w-full max-w-md grid-cols-3 gap-3">

          {AMOUNTS.map((a) => (

            <motion.div key={a.ml} whileTap={{ scale: 0.97 }}>

              <Button variant="outline" className="w-full" onClick={() => add(a.ml)}>

                <Plus className="h-4 w-4" />

                {a.label}

              </Button>

            </motion.div>

          ))}

        </div>

        {waterMl === 0 && (

          <p className="text-center text-sm text-muted-foreground">

            {t("waterPage.zeroHint")}

          </p>

        )}

        <CardContent className="flex items-center gap-2 p-0 text-sm text-muted-foreground">

          <Droplets className="h-4 w-4 text-primary" />

          {t("waterPage.aiTip")}

        </CardContent>

      </Card>

    </div>

  );

}

