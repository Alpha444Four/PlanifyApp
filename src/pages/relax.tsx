import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { Wind } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/toast";

import { useI18n } from "@/hooks/use-i18n";

import { useUserDataStore } from "@/store/user-data-store";



const CYCLE_SEC = 4;



export default function RelaxPage() {

  const [running, setRunning] = useState(false);

  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");

  const [secondsLeft, setSecondsLeft] = useState(120);

  const { toast } = useToast();

  const { t } = useI18n();

  const completeBreathing = useUserDataStore((s) => s.completeBreathing);



  const phaseLabel = {

    inhale: t("relaxPage.inhale"),

    hold: t("relaxPage.hold"),

    exhale: t("relaxPage.exhale"),

  };



  useEffect(() => {

    if (!running) return;

    const timer = setInterval(() => {

      setSecondsLeft((s) => {

        if (s <= 1) {

          setRunning(false);

          completeBreathing();

          toast({

            title: t("relaxPage.sessionComplete"),

            description: t("relaxPage.sessionCompleteDesc"),

            variant: "success",

          });

          return 0;

        }

        return s - 1;

      });

      setPhase((p) =>

        p === "inhale" ? "hold" : p === "hold" ? "exhale" : "inhale",

      );

    }, CYCLE_SEC * 1000);

    return () => clearInterval(timer);

  }, [running, completeBreathing, toast, t]);



  return (

    <div className="space-y-6">

      <PageHeader title={t("relaxPage.title")} description={t("relaxPage.subtitleGuided")} />



      <Card className="overflow-hidden">

        <CardContent className="flex flex-col items-center gap-6 py-12">

          <motion.div

            animate={

              running

                ? { scale: phase === "inhale" ? 1.15 : phase === "exhale" ? 0.85 : 1 }

                : { scale: 1 }

            }

            transition={{ duration: CYCLE_SEC, ease: "easeInOut" }}

            className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30"

          >

            <Wind className="h-12 w-12 text-primary" />

          </motion.div>

          <p className="text-2xl font-bold capitalize">

            {running ? phaseLabel[phase] : t("relaxPage.ready")}

          </p>

          <p className="text-sm text-muted-foreground">

            {running

              ? t("relaxPage.remaining", { seconds: secondsLeft })

              : t("relaxPage.boxBreathing")}

          </p>

          <Button

            variant="gradient"

            size="lg"

            onClick={() => {

              if (!running) setSecondsLeft(120);

              setRunning(!running);

            }}

          >

            {running ? t("relaxPage.stop") : t("relaxPage.startSession")}

          </Button>

        </CardContent>

      </Card>

    </div>

  );

}

