import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { PlanifyIcon } from "@/components/brand/planify-logo";
import { useI18n } from "@/hooks/use-i18n";
import { useAuthStore } from "@/store/auth-store";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (status === "loading") {
    return <BrandedLoader />;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (
    user &&
    user.provider === "email" &&
    !user.emailVerified &&
    location.pathname !== "/verify-email"
  ) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
}

function BrandedLoader() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <span className="animate-pulse">
        <PlanifyIcon size="xl" />
      </span>
      <p className="font-display text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {t("common.loading")}
      </p>
    </div>
  );
}
