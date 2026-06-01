import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, LogOut } from "lucide-react";
import { PlanifyLogo } from "@/components/brand/planify-logo";
import { navItems, navGroupLabelKey, type NavItem } from "@/config/navigation";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";
import { useLogout } from "@/hooks/use-logout";
import { useI18n } from "@/hooks/use-i18n";
import { PlanBadge } from "@/components/billing/plan-badge";
import { cn, getInitials } from "@/lib/utils";
import { usePlan } from "@/hooks/use-plan";

const groupOrder: NavItem["group"][] = ["main", "spaces", "wellness", "system"];

export function Sidebar() {
  const { user } = useAuth();
  const { t } = useI18n();
  const logout = useLogout();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const { isPaid } = usePlan();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-card/50 py-6 transition-[width] duration-300 lg:flex",
        collapsed ? "w-[72px] px-2" : "w-64 px-4",
      )}
    >
      <div className={cn("mb-6 flex items-center", collapsed ? "justify-center" : "justify-between px-2")}>
        <NavLink to="/" className="focus-ring flex items-center gap-2.5">
          {collapsed ? (
            <PlanifyLogo variant="icon" size="sm" />
          ) : (
            <PlanifyLogo variant="full" size="sm" />
          )}
        </NavLink>
        {!collapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={t("nav.collapseSidebar")}
            className="focus-ring rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={t("nav.expandSidebar")}
          className="focus-ring mx-auto mb-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4 rotate-180" />
        </button>
      )}

      {!collapsed && !isPaid ? (
        <Link
          to="/app/plans"
          className="focus-ring mb-4 block rounded-2xl bg-gradient-to-r from-primary to-[hsl(var(--brand-beige))] p-3 text-center text-sm font-semibold text-primary-foreground shadow-glow"
        >
          {t("plans.upgradeCta")}
        </Link>
      ) : null}

      <nav className="flex-1 space-y-6 overflow-y-auto pr-1">
        {groupOrder.map((group) => (
          <div key={group}>
            {!collapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t(navGroupLabelKey[group])}
              </p>
            )}
            <ul className="space-y-1">
              {navItems
                .filter((item) => item.group === group)
                .map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/app"}
                      title={collapsed ? t(item.labelKey) : undefined}
                      className={({ isActive }) =>
                        cn(
                          "focus-ring group relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-colors",
                          collapsed ? "justify-center px-2" : "px-3",
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.span
                              layoutId="sidebar-active"
                              className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-primary to-accent shadow-glow"
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 32,
                              }}
                            />
                          )}
                          <item.icon className="h-[18px] w-[18px] shrink-0" />
                          {!collapsed && t(item.labelKey)}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-4 space-y-2">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-3">
              <Avatar fallback={getInitials(user?.name)} src={user?.avatarUrl} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user?.name ?? t("common.guest")}</p>
                <div className="mt-1">
                  <PlanBadge />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void logout()}
              className="focus-ring flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-[18px] w-[18px]" />
              {t("common.signOut")}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => void logout()}
            aria-label={t("common.signOut")}
            className="focus-ring mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>
    </aside>
  );
}
