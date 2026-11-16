import Link from "next/link";
import type { Metadata } from "next";
import { Badge, LEVEL_LABEL, ProgressBar, SubjectMark } from "@/components/ui/primitives";
import { ParentHeader } from "@/components/parent/ParentHeader";
import { subjects } from "@/lib/data/content";
import { SUBJECT_STATS, chapterProgress, chaptersFor, student } from "@/lib/data/student";
import { subjectDetail, timeThisMonth, trendWeeks } from "@/lib/data/parent";
import type { SubjectId } from "@/lib/types";

export const metadata: Metadata = { title: "Progress · Parent" };

/* P5 · Iba's progress: exam marks covered, chapters in MBOSE order with level and score, trend, weak spots. */
export default async function ParentProgress({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const sp = await searchParams;
  const sid: SubjectId = (["maths", "physics", "chemistry"] as const).find((s) => s === sp.subject) ?? "maths";
  const subject = subjects.find((s) => s.id === sid)!;
  const d = subjectDetail[sid];
  const child = student.firstName;
  const list = chaptersFor(sid);
  return (
    <main className="page">
      <div className="stack">
        <section className="stack-3" style={{ gap: 14 }}>
          <ParentHeader />
          <div>
            <p className="muted p0" style={{ fontSize: 14 }}>Class {student.classLevel} {student.section} · updated tonight</p>
            <h1 className="title-1" style={{ marginTop: 2 }}>{child}&apos;s progress</h1>
          </div>
          <nav className="subject-tabs" aria-label="Choose a subject">
            {subjects.map((s) => (
              <Link key={s.id} href={`/parent/progress?subject=${s.id}`} className="subject-tab" aria-current={s.id === sid ? "page" : undefined}>
                <span className={`subject-dot ${s.id}`} />
                {s.short}
              </Link>
            ))}
          </nav>
        </section>
        <div className="split">
          <div className="stack">
            <section className="panel" style={{ borderRadius: 20 }}>
              <div className="row">
                <SubjectMark subject={sid} size={44} />
                <div className="grow">
                  <h2 className="title-2" style={{ fontSize: 19 }}>{subject.name}</h2>
                  <div className="small muted">{d.paper}</div>
                </div>
                <span className="title-1 tnum" style={{ fontSize: 28 }}>{SUBJECT_STATS[sid].pct}%</span>
              </div>
              <div className="stack-2" style={{ gap: 6, padding: 12, borderRadius: 14, background: "var(--ground)" }}>
                <div className="between" style={{ fontSize: 14 }}>
                  <span className="strong">Exam marks covered</span>
                  <span className="strong tnum">about {d.cov} of {d.of}</span>
                </div>
                <ProgressBar value={d.cov} max={d.of} label="Exam marks covered" />
                <div className="small muted">Chapters {child} has Practised or Mastered, weighted by the MBOSE marks split.</div>
              </div>
            </section>
            <section className="stack-2" style={{ gap: 10 }}>
              <div className="between" style={{ flexWrap: "wrap" }}>
                <h2 className="title-2" style={{ fontSize: 19 }}>Chapters</h2>
                <span className="small muted">MBOSE syllabus order</span>
              </div>
              <div className="g2">
                {list.map((c, i) => {
                  const p = chapterProgress(c.id);
                  const [last, score] = d.rows[i] ?? ["", ""];
                  const low = /^Quiz [0-5]\//.test(score);
                  return (
                    <div key={c.id} className="as-card" style={{ borderRadius: 18, padding: 14, gap: 10 }}>
                      <div className="as-chapter-top">
                        <span className="as-chapter-num">{c.bookNumber}</span>
                        <div className="as-chapter-text"><div className="as-chapter-title" style={{ fontSize: 15, lineHeight: "20px" }}>{c.title}</div></div>
                        <Badge tone={p.level}>{LEVEL_LABEL[p.level]}</Badge>
                      </div>
                      <ProgressBar value={p.pct} tone={p.level === "none" ? "none" : p.level} label={`${c.title} progress`} />
                      <div className="between small muted">
                        <span>{last}</span>
                        <span className="strong" style={{ color: low ? "var(--danger)" : "var(--ink)" }}>{score}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
          <aside className="stack">
            <section className="panel" style={{ borderRadius: 20 }}>
              <h2 className="title-2" style={{ fontSize: 19 }}>Quiz scores over time</h2>
              <p className="p0 strong" style={{ fontSize: 14, color: "var(--pine-ink)" }}>{d.trendLine}</p>
              <div role="img" aria-label={"Average quiz score by week: " + d.trend.map((v, i) => `${trendWeeks[i]} ${v}%`).join(", ")} style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 8, alignItems: "end", height: 130, borderBottom: "1px solid var(--line)" }}>
                {d.trend.map((v, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 4, height: "100%" }}>
                    <span className="label tnum">{v}</span>
                    <div style={{ width: "100%", maxWidth: 30, height: v, borderRadius: "6px 6px 2px 2px", background: i === 5 ? "var(--chart-1)" : "var(--chart-4)" }} />
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 8, textAlign: "center" }} className="label muted">
                {trendWeeks.map((w) => <span key={w} style={{ fontWeight: 400 }}>{w}</span>)}
              </div>
              <p className="note">Average of every quiz {child} took that week, in %.</p>
            </section>
            <section className="panel" style={{ borderRadius: 20, gap: 4 }}>
              <h2 className="title-2" style={{ fontSize: 19, marginBottom: 6 }}>Weak spots</h2>
              {d.weak.length ? (
                d.weak.map((w) => (
                  <div key={w.name} className="stack-2" style={{ gap: 4, padding: "10px 0", borderTop: "1px solid var(--line)" }}>
                    <div className="between"><span className="title-3" style={{ fontSize: 15 }}>{w.name}</span><span className="strong tnum" style={{ fontSize: 14, color: "var(--danger)", flex: "none" }}>{w.score}</span></div>
                    <div className="small muted" style={{ lineHeight: 1.4 }}><strong style={{ color: "var(--ink)" }}>What Ascent is doing:</strong> {w.doing}</div>
                  </div>
                ))
              ) : (
                <p className="p0 muted" style={{ padding: "10px 0", borderTop: "1px solid var(--line)", fontSize: 14 }}>No weak spots right now. Topics scored below 60% show up here.</p>
              )}
            </section>
            <section className="panel" style={{ borderRadius: 20, gap: 10 }}>
              <h2 className="title-2" style={{ fontSize: 19 }}>Time this month</h2>
              {timeThisMonth.map((t) => (
                <div key={t.name} className="stack-2" style={{ gap: 4 }}>
                  <div className="between" style={{ fontSize: 14 }}><span className="strong">{t.name}</span><span className="tnum">{t.label}</span></div>
                  <ProgressBar value={t.pct} label={`${t.name} time`} />
                </div>
              ))}
              <p className="note">Chemistry got the least time this month. You can put it first in the <Link href="/parent/plan" className="strong">Plan</Link>.</p>
            </section>
            <section className="panel row" style={{ borderRadius: 20, flexDirection: "row", gap: 14 }}>
              <span className="display" style={{ fontSize: 36, lineHeight: 1, color: "var(--pine)" }}>#4</span>
              <div style={{ fontSize: 14, lineHeight: 1.4 }}>
                <strong>of 38 in Class 10 B this week</strong>
                <br />
                <span className="muted">Based on study effort, not marks.</span>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
