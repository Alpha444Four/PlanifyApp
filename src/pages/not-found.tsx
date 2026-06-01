import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanifyIcon } from "@/components/brand/planify-logo";
import { useI18n } from "@/hooks/use-i18n";

export default function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-5 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-grid-glow" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center"
      >
        <PlanifyIcon size="xl" className="mx-auto" />
        <p className="mt-6 text-6xl font-extrabold tracking-tight">404</p>
        <h1 className="mt-2 text-xl font-bold">{t("notFound.wanderTitle")}</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {t("notFound.wanderDesc")}
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild variant="gradient">
            <Link to="/app">
              <ArrowLeft className="h-4 w-4" />
              {t("notFound.backDashboard")}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">{t("notFound.back")}</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
