"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Badge, LEVEL_LABEL } from "@/components/ui/primitives";
import { ReminderButtons } from "./TodayParts";
import type { QuizResult } from "./QuizRunner";
import type { Level } from "@/lib/types";

/* Shown when the page is opened directly (the designed sample: 8 of 10 on Ohm's law). */
const SAMPLE: Omit<QuizResult, "topicId"> = {
  score: 8,
  total: 10,
  hintsUsed: 0,
  mistakes: [
    { n: 3, type: "MCQ", prompt: "If the length of a wire is doubled, its resistance", yours: "halves", right: "doubles", fix: { label: "Rewatch “Factors affecting resistance” at 1:20", href: "?step=watch" } },
    { n: 7, type: "MCQ", prompt: "The SI unit of resistivity is", yours: "Ω", right: "Ω m", fix: { label: "Read notes, section 4", href: "?step=read" } },
  ],
};

export function ResultView({ topicId, topicTitle, chapterHref, next, first, demo }: { topicId: string; topicTitle: string; chapterHref: string; next: { title: string; minutes: number; href: string } | null; first: boolean; demo?: boolean }) {
  const [r, setR] = useState<Omit<QuizResult, "topicId">>(SAMPLE);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`ascent-quiz-${topicId}`);
      if (raw) setR(JSON.parse(raw));
    } catch {}
  }, [topicId]);

  const level: Level = r.score >= 9 ? "mastered" : r.score >= 6 ? "practised" : "learning";
  const passed = r.score >= 6;
  const correctXp = r.score * 2;
  const bonus = passed ? 20 : 0;
  const totalXp = Math.max(0, correctXp + bonus - r.hintsUsed);
  const goal = first ? 30 : 60;
  const before = first ? 0 : 30;
  const levels: Level[] = ["learning", "practised", "mastered"];
  const fixHref = (h: string) => (h.startsWith("?") ? `/topic/${topicId}${h}` : h);

  return (
    <div className="app">
      <main className="page medium">
        <div className="stack-3" style={{ gap: 18 }}>
          <header style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link href={demo ? "/" : first ? "/today" : chapterHref} className="icon-btn" aria-label="Close">
              <Icon name="cross" size={20} />
            </Link>
          </header>

          <section className="stack-2" style={{ alignItems: "center", textAlign: "center" }}>
            <p className="muted p0" style={{ fontSize: 14 }}>{topicTitle} · practice mode</p>
            <h1 className="display tnum" style={{ fontSize: 64, lineHeight: 1 }}>
              {r.score}
              <span className="muted" style={{ fontSize: 32 }}> / {r.total}</span>
            </h1>
            {level === "mastered" ? (
              <p className="title-2" style={{ color: "var(--pine-ink)" }}>Summit reached. This topic is mastered.</p>
            ) : (
              <Badge tone={level}>{level === "practised" ? "This topic is now Practised" : "Still Learning · retry with new questions"}</Badge>
            )}
          </section>

          <div className="g2">
            <section className="panel panel-lg" style={{ gap: 12 }}>
              <h2 className="title-3" style={{ fontSize: 15 }}>Your mastery</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 6 }}>
                {levels.map((l) => (
                  <div key={l} className="stack-2" style={{ gap: 6 }}>
                    <div style={{ height: 10, borderRadius: 5, background: l === level || levels.indexOf(l) < levels.indexOf(level) ? `var(--level-${l})` : "var(--level-none)", outline: l === level ? "3px solid var(--pine)" : undefined, outlineOffset: 2 }} />
                    <span className="label" style={{ fontWeight: l === level ? 700 : 400, color: l === level ? "var(--ink)" : "var(--ink-muted)" }}>
                      {LEVEL_LABEL[l]}
                      {l === level ? " · you" : ""}
                    </span>
                  </div>
                ))}
              </div>
              <p className="p0" style={{ fontSize: 14 }}>
                {level === "mastered" ? "Flashcards will keep it fresh. A short refresh comes back in a few weeks." : level === "practised" ? "Score 9 or 10 on a retry to master it. The retry uses new questions." : `${r.score} of ${r.total}. Watch the video again, then retry with new questions.`}
              </p>
            </section>
            <section className="panel panel-gold panel-lg" style={{ gap: 8 }}>
              <div className="between" style={{ flexWrap: "wrap" }}>
                <h2 className="title-2" style={{ fontSize: 21 }}>+{totalXp} XP</h2>
                <span className="small strong" style={{ color: "var(--gold-ink)" }}>
                  {before + totalXp >= goal ? `${first ? "First-week goal" : "Daily goal"} reached · ${before + totalXp} / ${goal}` : `Daily goal · ${before + totalXp} / ${goal}`}
                </span>
              </div>
              {passed && <div className="between" style={{ fontSize: 14 }}><span>Quiz passed</span><span className="strong">+20</span></div>}
              <div className="between" style={{ fontSize: 14 }}><span>{r.score} correct answers × 2</span><span className="strong">+{correctXp}</span></div>
              {r.hintsUsed > 0 && <div className="between" style={{ fontSize: 14 }}><span>Hints used</span><span className="strong">−{r.hintsUsed}</span></div>}
              <div className="row" style={{ gap: 8, marginTop: 4, fontSize: 14, fontWeight: 500 }}>
                <Icon name="flame" size={18} style={{ color: "var(--gold-ink)" }} />
                {first ? "Day 1 of your streak · leaderboards unlocked" : "13-day streak · up to #3 in your class"}
              </div>
            </section>
          </div>

          {r.mistakes.length > 0 ? (
            <section className="stack-3" style={{ gap: 10 }}>
              <h2 className="title-2" style={{ fontSize: 19 }}>Review your {r.mistakes.length} {r.mistakes.length === 1 ? "mistake" : "mistakes"}</h2>
              <div className="g2">
                {r.mistakes.map((m) => (
                  <div key={m.n} className="panel panel-lg" style={{ gap: 8, padding: 14 }}>
                    <div className="label muted">Question {m.n} · {m.type}</div>
                    <div className="title-3" style={{ fontSize: 15, lineHeight: 1.35 }}>{m.prompt}</div>
                    <div style={{ fontSize: 14 }}>
                      <span className="strong" style={{ color: "var(--danger)" }}>You: {m.yours}</span> · <span className="strong" style={{ color: "var(--pine-ink)" }}>Answer: {m.right}</span>
                    </div>
                    <Link href={fixHref(m.fix.href)} className="text-link" style={{ alignSelf: "flex-start" }}>
                      <Icon name={m.fix.href.includes("read") ? "notes" : "play"} size={16} />
                      {m.fix.label}
                    </Link>
                  </div>
                ))}
              </div>
              <p className="note">{r.mistakes.length === 1 ? "It is" : "Both are"} added to your weak spots and flashcards.</p>
            </section>
          ) : (
            <p className="panel panel-pine p0" style={{ color: "var(--pine-ink)" }}>No mistakes this time. Nice work.</p>
          )}

          {first && (
            <section className="hero xl" style={{ gap: 12 }}>
              <div className="small strong on-hero-muted">Your first topic is done</div>
              <h2 className="title-2" style={{ fontSize: 22 }}>Come back tomorrow?</h2>
              <p className="p0 on-hero-muted">Students who study the next day are the ones who keep going. We&apos;ll remind you once, at the time you usually study.</p>
              <ReminderButtons />
            </section>
          )}

          {demo && (
            <section className="hero xl" style={{ gap: 12 }}>
              <div className="small strong on-hero-muted">Your demo topic is done</div>
              <h2 className="title-2" style={{ fontSize: 22 }}>Keep your score and your first XP</h2>
              <p className="p0 on-hero-muted">Sign up with a phone number. Your score stays on this phone until your parent agrees.</p>
              <Link href={`/signup?demo=${r.score}`} className="as-btn as-btn--reward as-btn--lg as-btn--block">Sign up · about 2 min</Link>
            </section>
          )}

          {!demo && <section className="stack-2" style={{ gap: 10 }}>
            {next ? (
              <Link href={next.href} className="as-btn as-btn--primary as-btn--lg as-btn--block" style={{ flexDirection: "column", gap: 0, minHeight: 56, padding: 6 }}>
                Next topic
                <span className="small on-hero-muted" style={{ fontWeight: 500, color: "var(--on-pine-muted)" }}>
                  {next.title} · {next.minutes} min
                </span>
              </Link>
            ) : (
              <Link href={chapterHref} className="as-btn as-btn--primary as-btn--lg as-btn--block">Back to the chapter</Link>
            )}
            {level !== "mastered" && (
              <Link href={`/quiz/${topicId}`} className="text-link" style={{ alignSelf: "center", fontSize: 15 }}>
                Retry to master · new questions
              </Link>
            )}
          </section>}
        </div>
      </main>
    </div>
  );
}
