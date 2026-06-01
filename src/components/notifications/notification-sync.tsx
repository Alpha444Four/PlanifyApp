import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import { useUserDataStore } from "@/store/user-data-store";

/** Keeps in-app notifications fresh while the user is logged in. */
export function NotificationSync() {
  const status = useAuthStore((s) => s.status);
  const userId = useAuthStore((s) => s.user?.id);
  const refresh = useNotificationStore((s) => s.refresh);

  useEffect(() => {
    if (status !== "authenticated" || !userId) return;

    useUserDataStore.getState().touchDaily();
    void refresh();
    const id = window.setInterval(() => void refresh(), 4000);
    return () => window.clearInterval(id);
  }, [status, userId, refresh]);

  return null;
}
