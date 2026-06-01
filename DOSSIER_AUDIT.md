# Audit — Dossier `planify_dossier_startup_ia.html`

Comparaison du projet Planify avec le dossier stratégique universitaire (sans modifier le fichier HTML).

## ✅ Conforme ou couvert

| Exigence dossier | Statut dans le projet |
|------------------|----------------------|
| Slogan « Plan Your Life. Powered by AI. » | Landing + branding |
| 4 espaces Work / Gym / Study / Personal | Routes + nav groupe **4 Espaces** |
| Matrice Eisenhower IA | `EisenhowerMatrix` sur `/app/work` |
| Pomodoro Study Space | `PomodoroTimer` sur `/app/study` |
| Darija + FR + EN + AR (notifications) | `src/lib/localization/` + profil langue |
| Onboarding émotionnel (focus + langue) | `/onboarding` |
| AI Coach / chatbot | `/app/chat` + `ai-coach-service` |
| Mood tracker | `/app/mood` + widget dashboard |
| Habitudes / eau / sommeil | Pages wellness + dashboard |
| Auth login / signup / verify | Backend Express + mock |
| Notifications | API + inbox `/app/notifications` |
| Journal + liste courses (Personal) | `JournalCard` + `ShoppingList` |
| Citation quotidienne 4 langues | `DailyQuoteCard` |
| Landing compteur bêta | `BetaCounter` (objectif 1 000) |
| Parrainage (structure) | Bloc Settings |
| Mobile-first + dark/light | Oui |
| Gamification / défis | Awards + daily challenges |

## ⚠️ Partiel (MVP / démo — cohérent avec dossier section 15)

| Exigence | Note |
|----------|------|
| GPT-4 API live | Mock coach + TODO — dossier prévoit Custom GPT en phase jury |
| Glide / Figma / Framer | Projet = **vraie app React** (au-delà du MVP no-code du dossier) |
| Palette #2E7EFF + beige #F5F0E8 | App utilise bleu/jaune health — **non changé** pour ne pas casser l’UI existante |
| Typo Syne / Instrument Sans | Inter système — cosmétique |
| B2B MAD 599 / Premium MAD 49 | Business model documenté dans le HTML, pas encore facturé dans l’app |
| TikTok / campus marketing | Hors scope code |
| Voice darija / PLANIFY Social | Roadmap An 2–3 dans le dossier |

## Fichiers ajoutés pour alignement dossier

- `src/lib/localization/` — messages darija/FR/EN/AR
- `src/components/work/eisenhower-matrix.tsx`
- `src/components/study/pomodoro-timer.tsx`
- `src/components/personal/journal-card.tsx`, `shopping-list.tsx`
- `src/components/shared/daily-quote.tsx`
- `src/components/landing/beta-counter.tsx`
- `server/src/lib/localized-notifications.ts`

## Conclusion

Le **cœur produit du dossier** (4 espaces, darija, Eisenhower, Pomodoro, IA coach, onboarding, notifications, landing bêta) est **implémenté en complément** de la couche health (food scan, water, sleep, etc.) déjà présente. Le projet dépasse le MVP « sans coder » du dossier grâce au stack React + API réelle.
