import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

/**
 * PublicOnlyRoute — wraps /login & /signup. Authenticated users are bounced to
 * the app so they never see the auth forms again. While the session is still
 * rehydrating we render the page (it's safe and avoids a flash of loader).
 */
export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status);

  if (status === "authenticated") {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
