import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PlanifyIcon } from "@/components/brand/planify-logo";
import { refreshSessionFromUrl } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { ensureProfile } from "@/services/user-service";
import { useUserDataStore } from "@/store/user-data-store";
import { useNotificationStore } from "@/store/notification-store";

/** Handles Supabase email confirm + OAuth redirect (PKCE code exchange). */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const user = await refreshSessionFromUrl();
        if (!user) {
          setError("Could not complete sign-in. Try again.");
          return;
        }
        ensureProfile(user);
        useUserDataStore.getState().setActiveUser(user.id);
        void useNotificationStore.getState().refresh();
        useAuthStore.getState().setUser(user);
        useAuthStore.setState({ status: "authenticated" });

        if (!user.emailVerified && user.provider === "email") {
          navigate("/verify-email", { replace: true });
          return;
        }
        navigate("/app", { replace: true });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Auth callback failed");
      }
    })();
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <PlanifyIcon size="xl" />
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Completing sign-in…</p>
        </>
      )}
    </div>
  );
}
