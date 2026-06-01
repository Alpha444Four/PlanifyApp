import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { Pause, Play, RotateCcw } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { useI18n } from "@/hooks/use-i18n";



const FOCUS_SEC = 25 * 60;

const BREAK_SEC = 5 * 60;



export function PomodoroTimer() {

  const { t } = useI18n();

  const [seconds, setSeconds] = useState(FOCUS_SEC);

  const [running, setRunning] = useState(false);

  const [phase, setPhase] = useState<"focus" | "break">("focus");



  useEffect(() => {

    if (!running) return;

    const id = window.setInterval(() => {

      setSeconds((s) => {

        if (s <= 1) {

          const nextPhase = phase === "focus" ? "break" : "focus";

          setPhase(nextPhase);

          return nextPhase === "focus" ? FOCUS_SEC : BREAK_SEC;

        }

        return s - 1;

      });

    }, 1000);

    return () => clearInterval(id);

  }, [running, phase]);



  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");

  const ss = String(seconds % 60).padStart(2, "0");

  const pct =

    phase === "focus"

      ? ((FOCUS_SEC - seconds) / FOCUS_SEC) * 100

      : ((BREAK_SEC - seconds) / BREAK_SEC) * 100;



  const reset = () => {

    setRunning(false);

    setPhase("focus");

    setSeconds(FOCUS_SEC);

  };



  const phaseLabel =

    phase === "focus" ? t("study.pomodoroFocus") : t("study.pomodoroBreak");



  return (

    <Card>

      <CardHeader>

        <CardTitle>

          {t("study.pomodoro")} · {phaseLabel}

        </CardTitle>

      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4">

        <div className="relative flex h-36 w-36 items-center justify-center">

          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">

            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted" />

            <motion.circle

              cx="50"

              cy="50"

              r="45"

              fill="none"

              stroke="url(#pomGrad)"

              strokeWidth="4"

              strokeLinecap="round"

              strokeDasharray={`${2 * Math.PI * 45}`}

              animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - pct / 100)}` }}

              transition={{ duration: 0.5 }}

            />

            <defs>

              <linearGradient id="pomGrad" x1="0%" y1="0%" x2="100%" y2="0%">

                <stop offset="0%" stopColor="hsl(var(--primary))" />

                <stop offset="100%" stopColor="hsl(var(--accent))" />

              </linearGradient>

            </defs>

          </svg>

          <span className="text-3xl font-bold tabular-nums">

            {mm}:{ss}

          </span>

        </div>

        <div className="flex gap-2">

          <Button

            variant="gradient"

            size="icon"

            onClick={() => setRunning((r) => !r)}

            aria-label={running ? t("common.pause") : t("common.start")}

          >

            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}

          </Button>

          <Button variant="outline" size="icon" onClick={reset} aria-label={t("common.reset")}>

            <RotateCcw className="h-4 w-4" />

          </Button>

        </div>

      </CardContent>

    </Card>

  );

}

