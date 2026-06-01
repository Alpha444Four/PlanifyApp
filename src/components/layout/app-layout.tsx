import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Topbar } from "@/components/layout/topbar";
import { navItems } from "@/config/navigation";
import { pageTransition } from "@/lib/motion";
import { NotificationSync } from "@/components/notifications/notification-sync";
import { QuickAddDialog } from "@/components/widgets/quick-add-dialog";
import { useI18n } from "@/hooks/use-i18n";

function titleKeyForPath(pathname: string): string | null {
  const match = [...navItems]
    .sort((a, b) => b.to.length - a.to.length)
    .find((item) =>
      item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to),
    );
  return match?.labelKey ?? null;
}

export function AppLayout() {
  const location = useLocation();
  const { t } = useI18n();
  const titleKey = titleKeyForPath(location.pathname);
  const title = titleKey ? t(titleKey) : t("common.appName");
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex min-h-screen bg-background">
      <NotificationSync />
      <QuickAddDialog />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 px-4 pb-28 pt-6 sm:px-6 lg:pb-10">
          <div className="mx-auto w-full max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: 16, filter: "blur(4px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, y: -10, filter: "blur(4px)" }
                }
                transition={
                  prefersReducedMotion ? { duration: 0 } : pageTransition
                }
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
