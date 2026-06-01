import type { AppLanguage } from "@/lib/localization/languages";

export type NotifTemplateKey =
  | "morning"
  | "hydration"
  | "meal"
  | "mood"
  | "workout"
  | "evening"
  | "stressed"
  | "taskDone";

type Template = { title: string; body: string };

const TEMPLATES: Record<NotifTemplateKey, Record<AppLanguage, Template>> = {
  morning: {
    darija: {
      title: "Sba7 lkhir {name} ! ☀️",
      body: "3ndek {count} tâches lyoum — Yallah ndawzo m3ak !",
    },
    fr: {
      title: "Bonjour {name} ! ☀️",
      body: "{count} tâches importantes t'attendent aujourd'hui. Commençons !",
    },
    en: {
      title: "Good morning, {name}! ☀️",
      body: "You have {count} important tasks today. Let's make it count 💪",
    },
    ar: {
      title: "صباح الخير {name}! ☀️",
      body: "لديك {count} مهام مهمة اليوم. لنبدأ!",
    },
  },
  hydration: {
    darija: {
      title: "💧 Ma khditchi bzaf dial lma",
      body: "Zid chi kassa d'eau — rakk t7ssen bser3a.",
    },
    fr: {
      title: "Hydratation",
      body: "Tu n'as pas beaucoup bu d'eau aujourd'hui. Ajoute un verre.",
    },
    en: {
      title: "Hydration check",
      body: "You haven't logged much water today. Add a glass?",
    },
    ar: {
      title: "تذكير الماء",
      body: "لم تسجل كمية كافية من الماء اليوم.",
    },
  },
  meal: {
    darija: {
      title: "🍽️ Logi l'awel repas",
      body: "Bda nhar dialk b chi haja klitih — Food Scanner kay3awn.",
    },
    fr: {
      title: "Log ton premier repas",
      body: "Commence ta journée en enregistrant ce que tu manges.",
    },
    en: {
      title: "Log your first meal",
      body: "Start your day by logging what you eat.",
    },
    ar: {
      title: "سجّل وجبتك",
      body: "ابدأ يومك بتسجيل ما تأكله.",
    },
  },
  mood: {
    darija: {
      title: "😊 Kifach l'humeur ?",
      body: "Khod 10 secondes bach tchouf kifach rak lyoum.",
    },
    fr: {
      title: "Check-in humeur",
      body: "Prends 10 secondes pour noter comment tu te sens.",
    },
    en: {
      title: "How are you feeling?",
      body: "Take 10 seconds to check in with your mood.",
    },
    ar: {
      title: "كيف مزاجك؟",
      body: "خذ 10 ثوانٍ لتسجيل حالتك.",
    },
  },
  workout: {
    darija: {
      title: "💪 Yallah {name} !",
      body: "Waqt dial Gym — mshitich lbara7 alors lyoum makaynch 3odra 😤",
    },
    fr: {
      title: "Séance sport",
      body: "C'est le moment de bouger — même 15 minutes comptent.",
    },
    en: {
      title: "Workout time",
      body: "Log a workout or open Training for a quick session.",
    },
    ar: {
      title: "وقت التمرين",
      body: "سجّل تمريناً أو افتح قسم التدريب.",
    },
  },
  evening: {
    darija: {
      title: "🌙 Kifach daz lyoum ?",
      body: "Diri 5 dqayeq journaling — had shi kayghadiw bzaf.",
    },
    fr: {
      title: "Bilan du soir",
      body: "5 minutes de journaling pour clôturer la journée.",
    },
    en: {
      title: "Wind down",
      body: "Take 5 minutes to reflect on your day.",
    },
    ar: {
      title: "نهاية اليوم",
      body: "خمس دقائق للتأمل على يومك.",
    },
  },
  stressed: {
    darija: {
      title: "🌙 Rahi ta3ban?",
      body: "Diri 10 min yoga — barak Allah ufik !",
    },
    fr: {
      title: "Pause bien-être",
      body: "Ton humeur semble basse. Essaie 2 minutes de respiration.",
    },
    en: {
      title: "Take a breath",
      body: "You seem stressed. Open Relax for a 2-minute reset.",
    },
    ar: {
      title: "خذ استراحة",
      body: "يبدو أنك متوتر. جرّب تمارين التنفس.",
    },
  },
  taskDone: {
    darija: {
      title: "✅ Tâche salat",
      body: "\"{title}\" tkmmlat — zwin !",
    },
    fr: {
      title: "✅ Tâche terminée",
      body: "\"{title}\" est faite — bravo !",
    },
    en: {
      title: "✅ Task completed",
      body: "\"{title}\" is done — nice work!",
    },
    ar: {
      title: "✅ تمت المهمة",
      body: "أنجزت \"{title}\" — أحسنت!",
    },
  },
};

export function formatTemplate(
  key: NotifTemplateKey,
  lang: AppLanguage,
  vars: { name?: string; count?: number; title?: string },
): Template {
  const t = TEMPLATES[key][lang] ?? TEMPLATES[key].darija;
  const name = vars.name ?? "there";
  const count = String(vars.count ?? 3);
  const taskTitle = vars.title ?? "";
  const apply = (s: string) =>
    s
      .replace("{name}", name)
      .replace("{count}", count)
      .replace("{title}", taskTitle);
  return {
    title: apply(t.title),
    body: apply(t.body),
  };
}

export const DAILY_QUOTES: Record<AppLanguage, string[]> = {
  darija: [
    "Diri Planning. Bsahel.",
    "L-ghad dyalek yessiwi — wa7ed nhar f wa7ed lmarra.",
    "Yallah, koulchi kaybda b wa7ed tâche.",
  ],
  fr: [
    "Ton IA. Ton rythme. Ta vie.",
    "La discipline bat la motivation quand la motivation dort.",
    "Organise ta semaine, libère ton esprit.",
  ],
  en: [
    "Plan Your Life. Powered by AI.",
    "Small steps, every day, compound forever.",
    "Your progress begins at zero — then you build.",
  ],
  ar: [
    "خطط لحياتك. مدعوم بالذكاء الاصطناعي.",
    "الخطوة الصغيرة اليوم تصنع الغد.",
    "ابدأ من الصفر، ثم ابنِ.",
  ],
};

export function dailyQuote(lang: AppLanguage): string {
  const list = DAILY_QUOTES[lang] ?? DAILY_QUOTES.darija;
  const day = new Date().getDate();
  return list[day % list.length];
}
