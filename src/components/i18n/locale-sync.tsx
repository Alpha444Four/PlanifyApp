import { useEffect } from "react";
import { useLocaleStore } from "@/store/locale-store";
import { useUserDataStore } from "@/store/user-data-store";

/** Keeps UI locale aligned with saved profile preference when user data loads. */
export function LocaleSync() {
  const setLocale = useLocaleStore((s) => s.setLocale);
  const locale = useLocaleStore((s) => s.locale);
  const languagePref = useUserDataStore((s) => {
    const id = s.activeUserId;
    if (!id) return undefined;
    return s.dataByUser[id]?.preferences?.languagePref;
  });

  useEffect(() => {
    if (languagePref && languagePref !== locale) {
      setLocale(languagePref);
    }
  }, [languagePref, locale, setLocale]);

  return null;
}
