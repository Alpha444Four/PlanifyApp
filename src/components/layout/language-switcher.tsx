import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import type { AppLanguage } from "@/lib/localization/languages";
import { useI18n } from "@/hooks/use-i18n";
import { useUserDataStore } from "@/store/user-data-store";
import { springSnappy } from "@/lib/motion";
import { cn } from "@/lib/utils";

const LOCALES: AppLanguage[] = ["darija", "ar", "fr", "en"];

const LOCALE_META: Record<
  AppLanguage,
  { flag: string; short: string; labelKey: string }
> = {
  darija: { flag: "🇲🇦", short: "MA", labelKey: "lang.darija" },
  ar: { flag: "🇲🇦", short: "AR", labelKey: "lang.ar" },
  fr: { flag: "🇫🇷", short: "FR", labelKey: "lang.fr" },
  en: { flag: "🇬🇧", short: "EN", labelKey: "lang.en" },
};

type LanguageSwitcherProps = {
  className?: string;
  variant?: "navbar" | "drawer";
};

export function LanguageSwitcher({
  className,
  variant = "navbar",
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();
  const updatePreferences = useUserDataStore((s) => s.updatePreferences);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const prefersReducedMotion = useReducedMotion();
  const meta = LOCALE_META[locale];

  const updateMenuPosition = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }
    const id = window.setTimeout(() => {
      document.addEventListener("mousedown", onDoc);
    }, 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function pick(next: AppLanguage) {
    setLocale(next);
    updatePreferences({ languagePref: next });
    setOpen(false);
  }

  if (variant === "drawer") {
    return (
      <div
        className={cn(
          "flex gap-1 rounded-xl border border-border bg-muted/40 p-1",
          className,
        )}
        role="listbox"
        aria-label={t("lang.select")}
      >
        {LOCALES.map((code) => {
          const m = LOCALE_META[code];
          const active = locale === code;
          return (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={active}
              aria-label={t(m.labelKey)}
              onClick={() => pick(code)}
              className={cn(
                "focus-ring relative flex flex-1 flex-col items-center gap-0.5 rounded-lg py-2 text-[10px] font-semibold tracking-wide transition-colors",
                active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-accent shadow-glow"
                />
              )}
              <span className="relative z-[1] text-base leading-none">{m.flag}</span>
              <span className="relative z-[1]">{m.short}</span>
            </button>
          );
        })}
      </div>
    );
  }

  const slide = prefersReducedMotion
    ? { initial: false, animate: {}, exit: {} }
    : {
        initial: { y: 6, opacity: 0, filter: "blur(4px)" },
        animate: { y: 0, opacity: 1, filter: "blur(0px)" },
        exit: { y: -6, opacity: 0, filter: "blur(4px)" },
      };

  const menu = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          role="presentation"
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.92, y: -4 }
          }
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.95, y: -4 }
          }
          transition={springSnappy}
          style={{ top: menuPos.top, right: menuPos.right }}
          className="fixed z-[200] min-w-[10.5rem] origin-top-right"
        >
          <ul
            role="listbox"
            aria-label={t("lang.select")}
            className="overflow-hidden rounded-xl border border-border bg-card p-1 shadow-lg"
          >
            {LOCALES.map((code, i) => {
              const m = LOCALE_META[code];
              const active = locale === code;
              return (
                <motion.li
                  key={code}
                  role="option"
                  aria-selected={active}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    ...springSnappy,
                    delay: prefersReducedMotion ? 0 : i * 0.03,
                  }}
                >
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(code)}
                    className={cn(
                      "focus-ring relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-left",
                      active
                        ? "text-primary"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-lg bg-primary/10"
                      />
                    )}
                    <span className="relative z-[1] text-base leading-none">{m.flag}</span>
                    <span className="relative z-[1] min-w-0 flex-1 truncate text-xs font-medium">
                      {t(m.labelKey)}
                    </span>
                    <span className="relative z-[1] text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {m.short}
                    </span>
                    {active && (
                      <span className="relative z-[1] flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen((o) => {
            const next = !o;
            if (next) requestAnimationFrame(updateMenuPosition);
            return next;
          });
        }}
        aria-label={t("lang.select")}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "focus-ring relative inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-border bg-card px-1.5 text-card-foreground shadow-sm transition-colors hover:bg-muted",
          open && "border-primary/40 bg-primary/5 ring-2 ring-primary/20",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={locale}
            {...slide}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none flex items-center gap-1"
          >
            <span className="text-sm leading-none" aria-hidden>
              {meta.flag}
            </span>
            <span className="min-w-[1.15rem] text-[10px] font-bold uppercase tracking-wider">
              {meta.short}
            </span>
          </motion.span>
        </AnimatePresence>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={springSnappy}
          className="pointer-events-none flex text-muted-foreground"
        >
          <ChevronDown className="h-3 w-3" strokeWidth={2.5} />
        </motion.span>
      </button>

      {typeof document !== "undefined" && createPortal(menu, document.body)}
    </div>
  );
}
