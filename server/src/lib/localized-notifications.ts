type Lang = "darija" | "fr" | "en" | "ar";

const hydration: Record<Lang, { title: string; body: string }> = {
  darija: { title: "💧 Ma khditchi bzaf dial lma", body: "Zid chi kassa d'eau." },
  fr: { title: "Hydratation", body: "Ajoute un verre d'eau." },
  en: { title: "Hydration check", body: "Add a glass of water?" },
  ar: { title: "تذكير الماء", body: "سجّل الماء اليوم." },
};

const meal: Record<Lang, { title: string; body: string }> = {
  darija: { title: "🍽️ Logi l'awel repas", body: "Bda nhar dialk b chi haja klitih." },
  fr: { title: "Log ton repas", body: "Commence par enregistrer ta nourriture." },
  en: { title: "Log your first meal", body: "Start your food log today." },
  ar: { title: "سجّل وجبتك", body: "ابدأ بتسجيل طعامك." },
};

const mood: Record<Lang, { title: string; body: string }> = {
  darija: { title: "😊 Kifach l'humeur ?", body: "Khod 10 secondes bach tchouf kifach rak." },
  fr: { title: "Check-in humeur", body: "10 secondes pour noter ton humeur." },
  en: { title: "Mood check", body: "How are you feeling today?" },
  ar: { title: "كيف مزاجك؟", body: "سجّل حالتك." },
};

const workout: Record<Lang, { title: string; body: string }> = {
  darija: { title: "💪 Yallah !", body: "Waqt dial Gym — dir session daba !" },
  fr: { title: "Sport", body: "C'est le moment de bouger." },
  en: { title: "Workout", body: "Log training or open Training." },
  ar: { title: "تمرين", body: "سجّل تمرينك." },
};

export function localized(
  kind: "water" | "meal" | "mood" | "workout",
  lang?: string,
): { title: string; body: string } {
  const l = (lang === "fr" || lang === "en" || lang === "ar" ? lang : "darija") as Lang;
  const map = { water: hydration, meal, mood, workout }[kind];
  return map[l];
}
