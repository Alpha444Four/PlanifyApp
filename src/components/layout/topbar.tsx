import { Link } from "react-router-dom";
import { Bell, Menu, Search } from "lucide-react";
import { PlanifyIcon } from "@/components/brand/planify-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useNotificationStore } from "@/store/notification-store";
import { useUiStore } from "@/store/ui-store";
import { useAuth } from "@/store/auth-store";
import { useI18n } from "@/hooks/use-i18n";
import { getInitials } from "@/lib/utils";

export function Topbar({ title }: { title: string }) {
  const { user } = useAuth();
  const { t } = useI18n();
  const menuOpen = useUiStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label={t("common.openMenu")}
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-card-foreground transition-colors hover:bg-muted lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link
          to="/"
          className="focus-ring flex items-center gap-2 lg:hidden"
          aria-label={t("common.appName")}
        >
          <PlanifyIcon size="xs" />
        </Link>

        <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">
          {title}
        </h1>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder={t("common.search")}
              aria-label={t("common.search")}
              className="focus-ring h-10 w-48 rounded-xl border border-border bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground"
            />
          </div>
          <LanguageSwitcher />
          <Link
            to="/app/notifications"
            aria-label={t("common.notifications")}
            className="focus-ring relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-card-foreground transition-colors hover:bg-muted"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground ring-2 ring-card">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </Link>
          <ThemeToggle />
          <Link
            to="/app/profile"
            aria-label={t("common.profile")}
            className="focus-ring rounded-full"
          >
            <Avatar
              fallback={getInitials(user?.name)}
              src={user?.avatarUrl}
              className="h-10 w-10"
            />
          </Link>
        </div>
      </header>

      <MobileSidebar open={menuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
