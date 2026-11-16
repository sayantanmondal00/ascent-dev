# Ascent web app

Ascent is a study app for MBOSE Class 9 and 10 students, covering Maths, Physics and Chemistry. This is the first build: every screen from the design canvas, built in Next.js and running on **sample data**. The sample data has the same shape as the planned Supabase tables, so the database can be added next without rewriting the screens.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

Open **/screens** to see every screen listed under its canvas board number (D1–D8, 1–10, P1–P8).

## Deploy on Vercel

1. Push this repo to GitHub.
2. In Vercel, choose **Add New → Project** and import the repo.
3. Keep the default settings (Framework: Next.js) and deploy. No environment variables are needed yet.

## Sign-in

- Students and parents sign in at `/login` with a **username and password** (no phone codes).
- Demo accounts: `admin` (student, opens Today) and `parent` (parent, opens the parent area). Only salted scrypt hashes of the passwords are stored, in `src/lib/auth/users.ts`. Remove these accounts before the real launch.
- The parent area (`/parent/*`, except sign-up) needs a parent account. A student who opens it is asked to sign in as a parent.
- Sessions use a signed, httpOnly cookie that lasts 30 days. **Set `AUTH_SECRET`** in Vercel (Settings → Environment Variables) to any long random string, then redeploy. Without it, the app uses a fallback secret that is not safe for production.
- Signed-in pages: `/today`, `/learn`, `/me`, `/topic`, `/quiz`, `/result` and `/parent/*`. The demo topic (`?demo=1`) and the sign-up pages stay open.
- Until Supabase is connected, new sign-ups are not saved. Finishing sign-up signs the person in on that device only, and only the demo account can sign in again later.

## Where things are

| Path | What it holds |
|---|---|
| `src/styles/tokens.css` | Brand System v2 tokens (light, plus dark under `data-theme="dark"`) |
| `src/styles/components.css` | Styles for the 39 Brand System components (`as-` class prefix) |
| `src/styles/layout.css` | Layout system: phone tab bar under 768 px, icon rail from 768 to 1099 px, sidebar from 1100 px |
| `src/components/ui/` | Components ported from the Brand System: Logo, Icon, Button, Badge, LevelGlyph, XPRing, MasteryBar, AnswerOption, Flashcard, SimFrame, VideoPlayer, OTPInput, Toggle, BottomSheet and more |
| `src/components/shell/AppShell.tsx` | Navigation for the student app (Today, Learn, Me) and the parent area |
| `src/lib/types.ts` | Data types that match the planned database |
| `src/lib/data/` | **Sample data.** Replace these files with Supabase queries |
| `src/app/` | Routes (listed below) |
| `public/brand/` | Logo SVGs: mark, reversed, mono and app icon |

## Routes

- **Day one:** `/` (welcome), `/login`, `/signup`, `/signup/parent`, `/signup/consent`, `/signup/waiting`, `/signup/about`
- **Student:** `/today?mode=normal|day1|back|revision`, `/learn/[subject]`, `/learn/[subject]/[chapter]`, `/topic/[id]?step=`, `/quiz/[id]`, `/result/[id]`, `/me`, `/me/family`
- **Parent:** `/parent` (profile switcher with PIN), `/parent/setup`, `/parent/home`, `/parent/progress`, `/parent/plan`, `/parent/messages`, `/parent/settings`
- **Flows:** add `?demo=1` to a topic for the demo topic you can try without signing up, or `?first=1` for the day-one first-win flow
- **Not designed yet:** these open `/coming-soon` (chapter tests, past papers, flashcard review, formula sheets, search, student settings)

## What's still placeholder

- **Content:** only "Ohm's law and resistance" and "Real numbers: Euclid's division lemma" have full sample quizzes. Every other topic shows `[Your video]` and `[Your notes]`.
- **Sign-in:** new accounts aren't stored yet (no database). The parent PIN on a shared phone is simulated, so any 4 digits work.
- **Not built yet:** the PWA offline service worker, and FSRS scheduling for flashcards (the flashcard ratings are visual only for now).
- **Placeholders in the text:** `[Price]`, `[School name]`, `[Year]`, and the Maths exam date.
