import type { AppLanguage } from "@/lib/localization/languages";
import { allMessages } from "./messages";

function getNested(obj: unknown, path: string[]): unknown {
  let cur: unknown = obj;
  for (const p of path) {
    if (cur && typeof cur === "object" && p in (cur as object)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return cur;
}

/** Dot-path key, e.g. `nav.dashboard`. Supports `{name}` placeholders. */
export function translate(
  locale: AppLanguage,
  key: string,
  params?: Record<string, string | number>,
): string {
  const path = key.split(".");
  let value = getNested(allMessages[locale], path);
  if (typeof value !== "string") {
    value = getNested(allMessages.en, path);
  }
  if (typeof value !== "string") return key;
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (_, k: string) =>
    params[k] !== undefined ? String(params[k]) : `{${k}}`,
  );
}

export function localeDir(locale: AppLanguage): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function localeHtmlLang(locale: AppLanguage): string {
  if (locale === "ar") return "ar";
  if (locale === "fr") return "fr";
  if (locale === "darija") return "ar-MA";
  return "en";
}
