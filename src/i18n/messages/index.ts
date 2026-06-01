import type { AppLanguage } from "@/lib/localization/languages";
import { en, type MessageTree } from "./en";
import { fr } from "./fr";
import { ar } from "./ar";
import { darija } from "./darija";

export const allMessages: Record<AppLanguage, MessageTree> = {
  en,
  fr,
  ar,
  darija,
};

export type { MessageTree };
