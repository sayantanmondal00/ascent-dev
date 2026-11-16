import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { MasteryBar, StatTile, SubjectMark } from "@/components/ui/primitives";
import { ParentHeader } from "@/components/parent/ParentHeader";
import { Encourage, RequestCard } from "@/components/parent/HomeParts";
import { parentStats, readiness, recentScores, subjectSummary, weekMinutes } from "@/lib/data/parent";
import { student } from "@/lib/data/student";

export const metadata: Metadata = { title: "This week · Parent" };

/* P4 · Parent home. Visibility is "scores and trends": time, scores, levels, streak, requests. Never individual answers or doubts. */
export default function ParentHome() {
  const child = student.firstName;
  const goal = student.dailyGoalMinutes;
  const max = Math.max(...weekMinutes.map((d) => d.value), goal);
  return (
    <main className="page">
      <div className="phome">
        <section className="full stack-3" style={{ gap: 14, order: -3 }}>
          <ParentHeader />
          <div>
            <p className="muted p0" style={{ fontSize: 14 }}>{child} · Thu 22 to Wed 28 October</p>
            <h1 className="title-1" style={{ marginTop: 2 }}>This week</h1>
          </div>
          <div className="row-wrap">
            <span className="pill" style={{ fontWeight: 500 }}><Icon name="clock" size={15} />40 days to Science boards</span>
            <span className="pill" style={{ fontWeight: 500 }}>Last studied today, 6:40 pm</span>
          </div>
        </section>

        <div className="pcol mainc">
          <section className="hero xl" style={{ gap: 14, order: -2 }}>
            <div className="between small on-hero-muted" style={{ alignItems: "center" }}>
              <span className="strong">Board exam readiness</span>
              <span>Updated tonight</span>
            </div>
            <div>
              <h2 className="title-1" style={{ fontSize: 25, lineHeight: "29px", marginBottom: 6 }}>{readiness.verdict}</h2>
              <p className="p0 on-hero-muted" style={{ lineHeight: 1.45 }}>
                To finish every chapter two weeks before the boards, {child} needs about <strong style={{ color: "var(--on-hero)" }}>{readiness.needMinutes} minutes a day</strong>. This week {child} averaged <strong style={{ color: "var(--on-hero)" }}>{readiness.averageMinutes} minutes</strong>.
              </p>
            </div>
            <div className="stack-2" style={{ gap: 6 }}>
              <div className="between small on-hero-muted"><span>Syllabus done</span><span className="strong" style={{ color: "var(--on-hero)" }}>{readiness.syllabusPct}%</span></div>
              <div className="as-bar as-bar--hero" role="progressbar" aria-valuenow={readiness.syllabusPct} aria-valuemin={0} aria-valuemax={100} aria-label="Syllabus done"><div className="as-bar-fill" style={{ width: `${readiness.syllabusPct}%` }} /></div>
              <div className="between small on-hero-muted" style={{ flexWrap: "wrap" }}><span>At this pace: done by about {readiness.paceDone}</span><span>Target: {readiness.target}</span></div>
            </div>
            <div className="row-actions">
              <Link href="/parent/plan" className="as-btn as-btn--lg" style={{ background: "var(--surface)", color: "var(--pine-ink)" }}>
                Adjust the plan
                <Icon name="chevron-right" size={18} />
              </Link>
              <Link href="/parent/progress" className="as-btn as-btn--lg" style={{ background: "transparent", color: "var(--on-hero)", borderColor: "var(--hero-track)" }}>
                See what&apos;s left
              </Link>
            </div>
          </section>

          <div className="g4">
            {parentStats.map((s) => (
              <StatTile key={s.label} value={s.value} label={s.label} sub={s.sub} trend={s.up ? "up" : undefined} tone={s.gold ? "gold" : undefined} />
            ))}
          </div>

          <section className="panel" style={{ borderRadius: 20 }}>
            <div className="between" style={{ flexWrap: "wrap" }}>
              <h2 className="title-2" style={{ fontSize: 19 }}>Minutes studied each day</h2>
              <span className="small muted">Goal {goal} min</span>
            </div>
            <div role="img" aria-label={`Minutes studied: ${weekMinutes.map((d) => `${d.label} ${d.value}`).join(", ")}. Daily goal ${goal} minutes.`} style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 8, alignItems: "end", height: 160, paddingTop: 18, borderBottom: "1px solid var(--line)" }}>
              <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: Math.round((goal / max) * 118) + 20, borderTop: "2px dashed var(--chart-4)" }} />
              {weekMinutes.map((d, i) => (
                <div key={d.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 4, height: "100%" }}>
                  <span className="label tnum">{d.value}</span>
                  <div style={{ width: "100%", maxWidth: 36, height: Math.max(4, Math.round((d.value / max) * 118)), borderRadius: "6px 6px 2px 2px", background: i === weekMinutes.length - 1 ? "var(--chart-2)" : d.value >= goal ? "var(--chart-1)" : "var(--chart-4)" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 8, textAlign: "center" }} className="label muted">
              {weekMinutes.map((d, i) => (
                <span key={d.label} style={{ fontWeight: i === weekMinutes.length - 1 ? 700 : 400 }}>{d.label}</span>
              ))}
            </div>
            <p className="note">Dashed line: daily goal. Today&apos;s bar is so far; {child} usually studies after 7 pm.</p>
          </section>

          <section className="panel" style={{ borderRadius: 20 }}>
            <div className="between">
              <h2 className="title-2" style={{ fontSize: 19 }}>Subjects</h2>
              <Link href="/parent/progress" className="text-link">Full progress</Link>
            </div>
            <div className="list">
              {subjectSummary.map((s) => (
                <Link key={s.id} href="/parent/progress" className="list-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 8, padding: "12px 0" }}>
                  <div className="row">
                    <SubjectMark subject={s.id} size={38} />
                    <div className="grow">
                      <div className="title-3" style={{ fontSize: 15 }}>{s.name}</div>
                      <div className="small muted">{s.left}</div>
                    </div>
                    <span className="title-2 tnum">{s.pct}%</span>
                  </div>
                  <MasteryBar {...s.counts} label={s.name} />
                </Link>
              ))}
            </div>
            <div className="as-mbar-legend">
              <span><span className="as-swatch as-swatch--mastered" />Mastered</span>
              <span><span className="as-swatch as-swatch--practised" />Practised</span>
              <span><span className="as-swatch as-swatch--learning" />Learning</span>
              <span><span className="as-swatch as-swatch--notStarted" />Not started</span>
            </div>
          </section>

          <section className="panel" style={{ borderRadius: 20, gap: 4 }}>
            <h2 className="title-2" style={{ fontSize: 19, marginBottom: 6 }}>Recent scores</h2>
            <div className="list">
              {recentScores.map((t) => (
                <div key={t.name} className="list-row" style={{ minHeight: 56 }}>
                  <div className="grow">
                    <div className="title-3" style={{ fontSize: 15 }}>{t.name}</div>
                    <div className="small muted">{t.meta}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="title-2 tnum" style={{ fontSize: 19 }}>{t.score}</div>
                    <div className="label" style={{ color: t.good ? "var(--pine-ink)" : "var(--danger)" }}>{t.note}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="note" style={{ marginTop: 6 }}>Scores only. {child}&apos;s individual answers stay private.</p>
          </section>
        </div>

        <div className="pcol rail">
          <RequestCard child={child} />
          <section className="panel" style={{ borderRadius: 20, gap: 4 }}>
            <h2 className="title-2" style={{ fontSize: 19, marginBottom: 6 }}>Worth knowing</h2>
            {[
              { icon: "info" as const, cls: "ico", style: { background: "var(--danger-soft)", color: "var(--danger)" }, title: "Weak spot: Quadratic equations", body: `Scored 4 and 5 out of 10 on the discriminant. Ascent has added 5 practice questions to ${child}’s tasks.` },
              { icon: "clock" as const, cls: "ico ico-sunken", title: "Short day on Sunday", body: `20 of 40 minutes. ${child} asked to make Sundays lighter.` },
              { icon: "check" as const, cls: "ico", title: "Chapter test ready: The Human Eye", body: `All topics done. ${child} can take the 25-question test any time.` },
              { icon: "refresh" as const, cls: "ico ico-sunken", title: "Light chapter needs a refresh", body: "Mastered 3 weeks ago. Ascent has scheduled flashcards so it stays fresh." },
            ].map((w, i) => (
              <div key={w.title} className="row" style={{ alignItems: "flex-start", padding: "10px 0", borderTop: i ? "1px solid var(--line)" : "none" }}>
                <span className={w.cls} style={w.style}><Icon name={w.icon} size={20} /></span>
                <div className="grow">
                  <div className="title-3" style={{ fontSize: 15 }}>{w.title}</div>
                  <div className="small muted" style={{ lineHeight: 1.4 }}>{w.body}</div>
                </div>
              </div>
            ))}
          </section>
          <Encourage child={child} />
        </div>

        <section className="full row panel-sunken" style={{ alignItems: "flex-start", padding: 14, borderRadius: 18 }}>
          <Icon name="eye" size={20} style={{ color: "var(--ink-muted)", marginTop: 2 }} />
          <p className="p0" style={{ fontSize: 14, lineHeight: 1.45 }}>
            You see {child}&apos;s study time, scores and progress. {child}&apos;s doubts and individual answers stay private, so {child} can make mistakes freely. {child} can see exactly what you see. <Link href="/parent/settings" className="strong">Privacy settings</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
