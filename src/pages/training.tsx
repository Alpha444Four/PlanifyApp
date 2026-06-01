import { useState } from "react";

import { motion } from "framer-motion";

import { Check, Play } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { trainingClasses } from "@/lib/mock-data/training-classes";

import type { WorkoutClass } from "@/types/health";

import { useToast } from "@/components/ui/toast";

import { useI18n } from "@/hooks/use-i18n";

import { EMPTY_USER_DATA, useUserDataStore } from "@/store/user-data-store";



const CATEGORIES = ["gym", "cardio", "home", "stretching", "relax"] as const;



const CATEGORY_KEYS: Record<(typeof CATEGORIES)[number], string> = {

  gym: "trainingPage.catGym",

  cardio: "trainingPage.catCardio",

  home: "trainingPage.catHome",

  stretching: "trainingPage.catStretching",

  relax: "trainingPage.catRelax",

};



export default function TrainingPage() {

  const { toast } = useToast();

  const { t } = useI18n();

  const [active, setActive] = useState<string | null>(null);

  const data = useUserDataStore((s) =>

    s.activeUserId ? (s.dataByUser[s.activeUserId] ?? EMPTY_USER_DATA) : EMPTY_USER_DATA,

  );

  const complete = useUserDataStore((s) => s.completeWorkoutClass);



  const start = (w: WorkoutClass) => {

    setActive(w.id);

    toast({

      title: t("trainingPage.workoutStarted"),

      description: `${w.title} · ${w.durationMin} min`,

      variant: "success",

    });

  };



  const finish = (w: WorkoutClass) => {

    complete(w.id, w.durationMin, w.caloriesEstimate);

    setActive(null);

    toast({

      title: t("trainingPage.workoutComplete"),

      description: t("trainingPage.workoutCompleteDesc", { calories: w.caloriesEstimate }),

      variant: "success",

    });

  };



  const renderList = (cat: (typeof CATEGORIES)[number]) => (

    <div className="grid gap-4 sm:grid-cols-2">

      {trainingClasses

        .filter((c) => c.category === cat)

        .map((w) => (

          <motion.div key={w.id} whileHover={{ y: -3 }}>

            <Card className="h-full">

              <CardHeader>

                <div className="flex items-start justify-between gap-2">

                  <CardTitle className="text-lg">{w.title}</CardTitle>

                  <Badge variant="secondary">{w.difficulty}</Badge>

                </div>

                <p className="text-sm text-muted-foreground">

                  {w.durationMin} min · {w.muscleGroup} · ~{w.caloriesEstimate} kcal

                </p>

              </CardHeader>

              <CardContent className="space-y-3">

                <p className="text-sm text-muted-foreground">{w.instructions}</p>

                {w.videoUrl && (

                  <p className="text-xs text-primary">{t("trainingPage.videoReady")}</p>

                )}

                <div className="flex gap-2">

                  <Button

                    variant="outline"

                    size="sm"

                    onClick={() => start(w)}

                    disabled={active === w.id}

                  >

                    <Play className="h-4 w-4" />

                    {t("trainingPage.start")}

                  </Button>

                  <Button variant="gradient" size="sm" onClick={() => finish(w)}>

                    <Check className="h-4 w-4" />

                    {t("trainingPage.complete")}

                  </Button>

                </div>

              </CardContent>

            </Card>

          </motion.div>

        ))}

    </div>

  );



  return (

    <div className="space-y-6">

      <PageHeader title={t("trainingPage.title")} description={t("trainingPage.subtitleVideo")} />



      <Tabs defaultValue="gym">

        <TabsList className="flex w-full flex-wrap">

          {CATEGORIES.map((c) => (

            <TabsTrigger key={c} value={c}>

              {t(CATEGORY_KEYS[c])}

            </TabsTrigger>

          ))}

        </TabsList>

        {CATEGORIES.map((c) => (

          <TabsContent key={c} value={c} className="mt-4">

            {renderList(c)}

          </TabsContent>

        ))}

      </Tabs>



      {data.daily.trainingMinutes === 0 && data.completedWorkouts.length === 0 && (

        <p className="text-center text-sm text-muted-foreground">

          {t("trainingPage.noTrainingToday")}

        </p>

      )}

    </div>

  );

}

