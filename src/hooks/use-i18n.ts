import { useCallback } from "react";
import { translate } from "@/i18n";
import { useLocaleStore } from "@/store/locale-store";

export function useI18n() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) =>
      translate(locale, key, params),
    [locale],
  );

  return { locale, setLocale, t };
}
