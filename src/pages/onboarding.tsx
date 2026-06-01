import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";

import { ArrowRight, Check, Dumbbell, Moon, Sparkles, Target } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { useI18n } from "@/hooks/use-i18n";

import { LANGUAGE_OPTIONS, type AppLanguage } from "@/lib/localization";

import { useUserDataStore } from "@/store/user-data-store";

import { useAuth } from "@/store/auth-store";



const FOCUS_OPTIONS = ["sleep", "muscle", "consistent", "stress"] as const;

type FocusOption = (typeof FOCUS_OPTIONS)[number];



const steps = [

  { icon: Sparkles, titleKey: "onboarding.welcome", bodyKey: "onboarding.welcomeBody" },

  {

    icon: Target,

    titleKey: "onboarding.pickFocus",

    bodyKey: "onboarding.pickFocusBody",

    options: true,

  },

  { icon: Sparkles, titleKey: "onboarding.language", bodyKey: "onboarding.languageBody", languages: true },

  { icon: Moon, titleKey: "onboarding.rhythm", bodyKey: "onboarding.rhythmBody" },

  { icon: Dumbbell, titleKey: "onboarding.allSet", bodyKey: "onboarding.allSetBody" },

] as const;



export default function OnboardingPage() {

  const [step, setStep] = useState(0);

  const [focus, setFocus] = useState<FocusOption | null>(null);

  const [language, setLanguage] = useState<AppLanguage>("darija");

  const navigate = useNavigate();

  const { user } = useAuth();

  const { t } = useI18n();

  const updatePreferences = useUserDataStore((s) => s.updatePreferences);

  const current = steps[step];

  const isLast = step === steps.length - 1;



  return (

    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-5">

      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-grid-glow" />



      <div className="absolute right-5 top-5">

        <Button asChild variant="ghost" size="sm">

          <Link to="/app">{t("common.skip")}</Link>

        </Button>

      </div>



      <div className="relative z-10 w-full max-w-md">

        <div className="mb-8 flex justify-center gap-2">

          {steps.map((_, i) => (

            <span

              key={i}

              className={cn(

                "h-1.5 rounded-full transition-all",

                i === step ? "w-8 bg-primary" : "w-4 bg-muted",

              )}

            />

          ))}

        </div>



        <AnimatePresence mode="wait">

          <motion.div

            key={step}

            initial={{ opacity: 0, x: 30 }}

            animate={{ opacity: 1, x: 0 }}

            exit={{ opacity: 0, x: -30 }}

            transition={{ duration: 0.3 }}

            className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft-lg dark:glass"

          >

            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow">

              <current.icon className="h-8 w-8" />

            </span>

            <h1 className="mt-6 text-2xl font-bold tracking-tight">{t(current.titleKey)}</h1>

            <p className="mt-2 text-sm text-muted-foreground">{t(current.bodyKey)}</p>



            {"languages" in current && current.languages && (

              <div className="mt-6 grid grid-cols-2 gap-2.5">

                {LANGUAGE_OPTIONS.map((opt) => (

                  <button

                    key={opt.value}

                    type="button"

                    onClick={() => setLanguage(opt.value)}

                    className={cn(

                      "focus-ring flex items-center justify-center gap-1.5 rounded-2xl border px-3 py-3 text-sm font-medium transition-all",

                      language === opt.value

                        ? "border-primary bg-primary/10"

                        : "border-border hover:bg-muted",

                    )}

                  >

                    <span>{opt.flag}</span>

                    {t(`lang.${opt.value === "darija" ? "darija" : opt.value}`)}

                  </button>

                ))}

              </div>

            )}

            {"options" in current && current.options && (

              <div className="mt-6 grid grid-cols-2 gap-2.5">

                {FOCUS_OPTIONS.map((opt) => (

                  <button

                    key={opt}

                    type="button"

                    onClick={() => setFocus(opt)}

                    className={cn(

                      "focus-ring flex items-center justify-center gap-1.5 rounded-2xl border px-3 py-3 text-sm font-medium transition-all",

                      focus === opt

                        ? "border-primary bg-primary/10"

                        : "border-border hover:bg-muted",

                    )}

                  >

                    {focus === opt && <Check className="h-4 w-4 text-primary" />}

                    {t(`onboarding.options.${opt}`)}

                  </button>

                ))}

              </div>

            )}

          </motion.div>

        </AnimatePresence>



        <div className="mt-6 flex items-center justify-between gap-3">

          <Button

            variant="ghost"

            onClick={() => setStep((s) => Math.max(0, s - 1))}

            disabled={step === 0}

          >

            {t("common.back")}

          </Button>

          <Button

            variant="gradient"

            onClick={() => {

              if (isLast) {

                if (user) updatePreferences({ languagePref: language });

                navigate("/app");

              } else {

                setStep((s) => s + 1);

              }

            }}

          >

            {isLast ? t("onboarding.enter") : t("common.continue")}

            <ArrowRight className="h-4 w-4" />

          </Button>

        </div>

      </div>

    </div>

  );

}

