import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { bottomNavItems } from "@/config/navigation";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const { t } = useI18n();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="glass mx-3 mb-3 flex items-center justify-around rounded-2xl px-2 py-1.5 shadow-soft-lg">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/app"}
            className={({ isActive }) =>
              cn(
                "focus-ring relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="bottomnav-active"
                    className="absolute -top-px h-1 w-8 rounded-full bg-gradient-to-r from-primary to-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="h-5 w-5" />
                {t(item.labelKey).split(/\s+/)[0]}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
