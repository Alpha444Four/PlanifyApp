import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppLanguage } from "@/lib/localization/languages";
import { DEFAULT_LANGUAGE } from "@/lib/localization/languages";
import { localeDir, localeHtmlLang } from "@/i18n";

type LocaleState = {
  locale: AppLanguage;
  setLocale: (locale: AppLanguage) => void;
};

function applyDocumentLocale(locale: AppLanguage) {
  const root = document.documentElement;
  root.lang = localeHtmlLang(locale);
  root.dir = localeDir(locale);
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LANGUAGE,
      setLocale: (locale) => {
        applyDocumentLocale(locale);
        set({ locale });
      },
    }),
    {
      name: "planify-locale",
      onRehydrateStorage: () => (state) => {
        if (state?.locale) applyDocumentLocale(state.locale);
      },
    },
  ),
);

applyDocumentLocale(DEFAULT_LANGUAGE);
