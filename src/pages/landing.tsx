import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Moon,
  Dumbbell,
  Brain,
  ScanLine,
  HeartPulse,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanifyLogo } from "@/components/brand/planify-logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { BloomHeroBackground } from "@/components/ui/bloom";
import { SleepTrackerCard } from "@/components/ui/sleep-tracker-card";
import { WorkoutCard } from "@/components/ui/workout-card";
import { sampleSleepData } from "@/lib/mock-data/health";
import { sampleTodayWorkout } from "@/lib/mock-data/workout";
import { BetaCounter } from "@/components/landing/beta-counter";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/hooks/use-i18n";

const featureDefs: { icon: LucideIcon; titleKey: string; descKey: string }[] = [
  { icon: Brain, titleKey: "landing.featSpaces", descKey: "landing.featSpacesDesc" },
  { icon: Sparkles, titleKey: "landing.featLang", descKey: "landing.featLangDesc" },
  { icon: ScanLine, titleKey: "landing.featFood", descKey: "landing.featFoodDesc" },
  { icon: HeartPulse, titleKey: "landing.featHabits", descKey: "landing.featHabitsDesc" },
  { icon: Brain, titleKey: "landing.featCoach", descKey: "landing.featCoachDesc" },
  { icon: Dumbbell, titleKey: "landing.featTrain", descKey: "landing.featTrainDesc" },
  { icon: Moon, titleKey: "landing.featMood", descKey: "landing.featMoodDesc" },
  { icon: Sparkles, titleKey: "landing.featAwards", descKey: "landing.featAwardsDesc" },
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <BloomHeroBackground />

      <header className="relative z-50 mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
        <PlanifyLogo variant="full" size="sm" href="/" />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            {t("landing.features")}
          </a>
          <a href="#preview" className="transition-colors hover:text-foreground">
            {t("landing.preview")}
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild size="sm" variant="gradient">
            <Link to="/login">
              {t("common.signIn")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-8 pt-12 text-center sm:pt-20">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div
            variants={fade}
            className="mx-auto mb-8 flex justify-center overflow-visible py-2"
          >
            <PlanifyLogo
              variant="lockup"
              size="xl"
              slogan={t("brand.sloganFull")}
            />
          </motion.div>
          <motion.div
            variants={fade}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.15em] text-primary shadow-sm backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_hsl(var(--accent))]" />
            {t("brand.slogan")}
          </motion.div>
          <motion.h1
            variants={fade}
            className="font-display mx-auto max-w-4xl text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-6xl"
          >
            {t("landing.heroTitle")}{" "}
            <span className="text-gradient">{t("landing.heroTitleAccent")}</span>
          </motion.h1>
          <motion.p
            variants={fade}
            className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            {t("landing.heroSubtitle")}
          </motion.p>
          <motion.div
            variants={fade}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg" variant="gradient">
              <Link to="/signup">
                {t("landing.getStartedFree")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">{t("common.signIn")}</Link>
            </Button>
          </motion.div>
          <motion.p
            variants={fade}
            className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-success" /> {t("common.noCreditCard")}
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-success" /> {t("common.darkLight")}
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-success" /> {t("common.fourSpaces")}
            </span>
          </motion.p>
          <motion.div variants={fade}>
            <BetaCounter />
          </motion.div>
        </motion.div>

        <motion.div
          id="preview"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-16 grid max-w-4xl gap-5 text-left sm:grid-cols-2"
        >
          <SleepTrackerCard data={sampleSleepData} />
          <WorkoutCard {...sampleTodayWorkout} />
        </motion.div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("landing.featuresTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {t("landing.featuresSubtitle")}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featureDefs.map((f, i) => (
            <motion.div
              key={f.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group rounded-3xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-soft-lg dark:glass"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{t(f.titleKey)}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t(f.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-accent/15 px-8 py-14 text-center dark:glass"
        >
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
          />
          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
            {t("landing.ctaTitle")}
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-muted-foreground">
            {t("landing.ctaDesc")}
          </p>
          <div className="relative mt-8">
            <Button asChild size="lg" variant="gradient">
              <Link to="/signup">
                {t("landing.ctaButton")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>{t("landing.footer")}</p>
      </footer>
    </div>
  );
}
