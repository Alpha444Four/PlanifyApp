import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { PlanifyLogo } from "@/components/brand/planify-logo";
import { navItems, navGroupLabelKey, type NavItem } from "@/config/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/store/auth-store";
import { useLogout } from "@/hooks/use-logout";
import { useI18n } from "@/hooks/use-i18n";
import { cn, getInitials, providerLabel } from "@/lib/utils";

const groupOrder: NavItem["group"][] = ["main", "spaces", "wellness", "system"];

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { t } = useI18n();
  const logout = useLogout();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <motion.div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t("common.openMenu")}
            initial={prefersReducedMotion ? { x: 0, opacity: 0 } : { x: "-100%" }}
            animate={prefersReducedMotion ? { x: 0, opacity: 1 } : { x: 0 }}
            exit={prefersReducedMotion ? { x: 0, opacity: 0 } : { x: "-100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 36 }}
            className="absolute left-0 top-0 flex h-full w-72 max-w-[85%] flex-col border-r border-border bg-card px-4 py-5 shadow-soft-lg"
          >
            <div className="mb-6 flex items-center justify-between">
              <PlanifyLogo variant="full" size="sm" href="/" />
              <button
                type="button"
                onClick={onClose}
                aria-label={t("common.cancel")}
                className="focus-ring rounded-lg p-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <LanguageSwitcher variant="drawer" />
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto pr-1">
              {groupOrder.map((group) => (
                <div key={group}>
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t(navGroupLabelKey[group])}
                  </p>
                  <ul className="space-y-1">
                    {navItems
                      .filter((item) => item.group === group)
                      .map((item) => (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            end={item.to === "/app"}
                            onClick={onClose}
                            className={({ isActive }) =>
                              cn(
                                "focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                              )
                            }
                          >
                            <item.icon className="h-[18px] w-[18px]" />
                            {t(item.labelKey)}
                          </NavLink>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-3">
                <Avatar fallback={getInitials(user?.name)} src={user?.avatarUrl} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {user?.name ?? t("common.guest")}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {providerLabel(user?.provider)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  void logout();
                }}
                className="focus-ring flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-[18px] w-[18px]" />
                {t("common.signOut")}
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
