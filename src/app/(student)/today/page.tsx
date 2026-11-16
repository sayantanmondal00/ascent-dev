import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { StudentHeader } from "@/components/shell/AppShell";
import { DemoBar, HeroSteps, SubjectsStrip } from "@/components/student/blocks";
import { GoalAndTasks } from "@/components/student/TodayParts";
import { FIRST_TOPIC_ID, OHM_TOPIC_ID } from "@/lib/data/content";
import { student } from "@/lib/data/student";
import type { Task } from "@/lib/types";

export const metadata: Metadata = { title: "Today" };

type Mode = "normal" | "day1" | "back" | "revision";
const MODES: { id: Mode; label: string }[] = [
  { id: "normal", label: "Normal day" },
  { id: "day1", label: "Day one" },
  { id: "back", label: "Welcome back" },
  { id: "revision", label: "Revision season" },
];

const TASKS: Record<"normal" | "revision", Task[]> = {
  normal: [
    { id: "t2", label: "Fix weak spot: discriminant", sub: "Maths · 5 questions", xp: 15, href: "/learn/maths/mat-quadratic" },
    { id: "t3", label: "Review 12 flashcards", sub: "Mixed · 4 min", xp: 10, href: "/coming-soon?what=Flashcard%20review" },
  ],
  revision: [
    { id: "r1", label: "Mixed review: 15 questions", sub: "Your 3 weakest chapters · 12 min", xp: 20, href: "/coming-soon?what=Mixed%20review" },
    { id: "r2", label: "Formula sheet: Electricity", sub: "Read and self-test · 5 min", xp: 5, href: "/coming-soon?what=Formula%20sheets" },
  ],
};

const CHIP: Record<Mode, { text: string; cls: string }> = {
  normal: { text: "40 days to Science boards", cls: "pill" },
  day1: { text: "Goal 30 XP a day", cls: "pill pine" },
  back: { text: "Away 5 days", cls: "pill" },
  revision: { text: "Revision season · 40 days to Science", cls: "pill gold" },
};

export default async function TodayPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const sp = await searchParams;
  const mode: Mode = (["normal", "day1", "back", "revision"] as const).find((m) => m === sp.mode) ?? "normal";
  const name = student.firstName;
  const greeting = { normal: `Good evening, ${name}`, day1: `Welcome to Ascent, ${name}`, back: `Welcome back, ${name}`, revision: `Good evening, ${name}` }[mode];
  const dateLine = mode === "day1" ? "Your parent agreed · you’re all set" : "Wednesday, 28 October";

  return (
    <>
      <DemoBar label="Preview:" current={mode} items={MODES.map((m) => ({ id: m.id, label: m.label, href: `/today?mode=${m.id}` }))} />
      <main className="page">
        <div className="home">
          <section className="stack-3" style={{ gridArea: "hello", gap: 14 }}>
            <StudentHeader showStats={mode !== "day1"} />
            <div className="row-wrap" style={{ alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
              <div>
                <p className="muted p0" style={{ fontSize: 14 }}>{dateLine}</p>
                <h1 className="title-1" style={{ marginTop: 2 }}>{greeting}</h1>
              </div>
              <span className={CHIP[mode].cls}>
                <Icon name="clock" size={15} />
                {CHIP[mode].text}
              </span>
            </div>
          </section>

          {mode === "normal" && (
            <>
              <GoalAndTasks
                baseXp={student.xpToday}
                goal={student.dailyGoalXp}
                tasks={TASKS.normal}
                subline={
                  <>
                    Set by your parent · <Link href="/me/family" className="strong">Ask to change</Link>
                  </>
                }
              >
                <div className="hero">
                  <div className="row-wrap small" style={{ justifyContent: "space-between", color: "var(--on-hero-muted)" }}>
                    <span className="strong">Continue · Physics</span>
                    <span>Electricity · topic 3 of 5</span>
                  </div>
                  <div>
                    <h3 className="title-2" style={{ fontSize: 23, lineHeight: "27px", marginBottom: 4 }}>Ohm&apos;s law and resistance</h3>
                    <p className="p0 on-hero-muted" style={{ fontSize: 14 }}>Next: Test · 10 questions · 8 min · +20 XP</p>
                  </div>
                  <HeroSteps states={["done", "done", "done", "done", "next"]} />
                  <Link href={`/topic/${OHM_TOPIC_ID}?step=test`} className="as-btn as-btn--reward as-btn--lg as-btn--block">
                    Resume test
                    <Icon name="chevron-right" size={18} />
                  </Link>
                </div>
              </GoalAndTasks>
              <section className="panel panel-gold" style={{ gridArea: "news", gap: 10 }}>
                <div className="row" style={{ gap: 10 }}>
                  <span className="ico ico-surface">
                    <Icon name="heart" size={20} />
                  </span>
                  <div>
                    <div className="label" style={{ color: "var(--gold-ink)" }}>From your parent · 2 hours ago</div>
                    <div className="title-3" style={{ fontSize: 15 }}>Yes to lighter Sundays</div>
                  </div>
                </div>
                <p className="p0" style={{ lineHeight: 1.45 }}>&ldquo;OK, Sundays are 20 minutes now. Well done on the Acids test!&rdquo;</p>
                <Link href="/me/family" className="text-link">Messages and rewards</Link>
              </section>
              <SubjectsStrip />
            </>
          )}

          {mode === "day1" && (
            <>
              <section className="hero xl" style={{ gridArea: "today", gap: 14 }}>
                <span className="small strong on-hero-muted">Your first topic · everyone starts at chapter 1</span>
                <div>
                  <h2 className="title-1" style={{ fontSize: 27, lineHeight: "31px", marginBottom: 6 }}>Real numbers: Euclid&apos;s division lemma</h2>
                  <p className="p0 on-hero-muted">Maths · chapter 1, topic 1 · about 10 minutes</p>
                </div>
                <HeroSteps states={["next", "locked", "locked", "locked", "locked"]} />
                <Link href={`/topic/${FIRST_TOPIC_ID}?step=watch&first=1`} className="as-btn as-btn--reward as-btn--lg as-btn--block">
                  Start · 10 min
                  <Icon name="chevron-right" size={18} />
                </Link>
                <div className="row-wrap on-hero-muted" style={{ justifyContent: "center", fontSize: 14 }}>
                  Or start with
                  <Link href="/learn/physics" className="pill" style={{ background: "transparent", borderColor: "var(--hero-track)", color: "var(--on-hero)", minHeight: 40 }}>Physics</Link>
                  <Link href="/learn/chemistry" className="pill" style={{ background: "transparent", borderColor: "var(--hero-track)", color: "var(--on-hero)", minHeight: 40 }}>Chemistry</Link>
                </div>
              </section>
              <section className="panel" style={{ gridArea: "news", gap: 10 }}>
                <h2 className="title-s">How Ascent works</h2>
                <ul className="bullets">
                  <li><Icon name="target" size={20} style={{ color: "var(--pine)" }} /><span><strong>A goal each day.</strong> 30 XP for now; your parent can change it. One topic is about 35 XP.</span></li>
                  <li><Icon name="book" size={20} style={{ color: "var(--pine)" }} /><span><strong>Every topic in five steps.</strong> Watch, read, try the simulation, recall, then a short test.</span></li>
                  <li><Icon name="check" size={20} style={{ color: "var(--pine)" }} /><span><strong>Already did a chapter at school?</strong> Take its chapter quiz in Learn. Score 9 or more and it’s marked done.</span></li>
                  <li><Icon name="trophy" size={20} style={{ color: "var(--pine)" }} /><span><strong>Streaks, badges and class leaderboards</strong> start after your first topic. Your demo score on Ohm’s law is saved.</span></li>
                </ul>
              </section>
            </>
          )}

          {mode === "back" && (
            <>
              <section className="panel" style={{ gridArea: "today", gap: 14 }}>
                <div className="row panel-gold" style={{ padding: 12, borderRadius: 16 }}>
                  <span className="ico" style={{ background: "var(--gold)", color: "var(--on-gold)", width: 44, height: 44 }}>
                    <Icon name="flame" size={22} />
                  </span>
                  <div>
                    <div className="title-3">Your {student.streakDays}-day streak is safe</div>
                    <div className="small" style={{ color: "var(--gold-ink)" }}>We used this week&apos;s streak freeze. Study today to keep it going.</div>
                  </div>
                </div>
                <div className="hero">
                  <div className="small strong on-hero-muted">10-minute restart</div>
                  <ol className="stack-2" style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    <li className="hero-item"><span className="num-dot">1</span><span className="grow"><strong>Quick recap: Ohm&apos;s law</strong><br /><span className="small on-hero-muted">8 flashcards · 4 min</span></span></li>
                    <li className="hero-item"><span className="num-dot">2</span><span className="grow"><strong>Finish the Ohm&apos;s law test</strong><br /><span className="small on-hero-muted">You stopped at question 4 · 6 min</span></span></li>
                  </ol>
                  <Link href={`/topic/${OHM_TOPIC_ID}?step=recall`} className="as-btn as-btn--reward as-btn--lg as-btn--block">
                    Start the restart
                    <Icon name="chevron-right" size={18} />
                  </Link>
                </div>
                <p className="note">Today&apos;s goal is lighter: 30 XP. It goes back to 60 XP tomorrow.</p>
              </section>
              <section className="panel" style={{ gridArea: "news", gap: 4 }}>
                <h2 className="title-s" style={{ marginBottom: 6 }}>While you were away</h2>
                <div className="list">
                  <div className="list-row" style={{ minHeight: 0, padding: "10px 0", alignItems: "flex-start" }}>
                    <Icon name="message" size={20} style={{ color: "var(--pine)" }} />
                    <span style={{ fontSize: 14 }}><strong>Your doubt was answered</strong><br /><span className="muted">Why do resistors in series add up?</span></span>
                  </div>
                  <div className="list-row" style={{ minHeight: 0, padding: "10px 0", alignItems: "flex-start" }}>
                    <Icon name="check" size={20} style={{ color: "var(--pine)" }} />
                    <span style={{ fontSize: 14 }}><strong>Chapter test ready</strong><br /><span className="muted">The Human Eye · 25 questions</span></span>
                  </div>
                  <div className="list-row" style={{ minHeight: 0, padding: "10px 0", alignItems: "flex-start" }}>
                    <Icon name="heart" size={20} style={{ color: "var(--gold-ink)" }} />
                    <span style={{ fontSize: 14 }}><strong>Your parent wrote</strong><br /><span className="muted">&ldquo;Hope the school exams went well. Back to it!&rdquo;</span></span>
                  </div>
                </div>
              </section>
              <SubjectsStrip />
            </>
          )}

          {mode === "revision" && (
            <>
              <GoalAndTasks baseXp={15} goal={student.dailyGoalXp} tasks={TASKS.revision} subline="Revision season · new chapters only if time allows">
                <div className="hero">
                  <div className="row-wrap small" style={{ justifyContent: "space-between", color: "var(--on-hero-muted)" }}>
                    <span className="strong">Past paper practice</span>
                    <span>Timed · like the board exam</span>
                  </div>
                  <div>
                    <h3 className="title-2" style={{ fontSize: 23, lineHeight: "27px", marginBottom: 4 }}>MBOSE Science [Year], Section B</h3>
                    <p className="p0 on-hero-muted" style={{ fontSize: 14 }}>Electricity and Magnetism · 25 min · +40 XP</p>
                  </div>
                  <Link href="/coming-soon?what=Past%20papers" className="as-btn as-btn--reward as-btn--lg as-btn--block">
                    Start section B
                    <Icon name="chevron-right" size={18} />
                  </Link>
                </div>
              </GoalAndTasks>
              <section className="panel" style={{ gridArea: "news", gap: 10 }}>
                <div className="between">
                  <h2 className="title-s">Past paper scores</h2>
                  <span className="small muted">Science, out of 80</span>
                </div>
                <div role="img" aria-label="Science past paper scores: 52, 61, 66" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, alignItems: "end", height: 110, borderBottom: "1px solid var(--line)" }}>
                  {[52, 61, 66].map((v, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, justifyContent: "flex-end", height: "100%" }}>
                      <span className="label tnum">{v}</span>
                      <div style={{ width: "100%", maxWidth: 44, height: (v / 80) * 100, borderRadius: "6px 6px 2px 2px", background: i === 2 ? "var(--chart-1)" : "var(--chart-4)" }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, textAlign: "center" }} className="label muted">
                  <span style={{ fontWeight: 400 }}>Paper 1</span>
                  <span style={{ fontWeight: 400 }}>Paper 2</span>
                  <span style={{ fontWeight: 400 }}>Paper 3</span>
                </div>
                <p className="p0 strong" style={{ fontSize: 14, color: "var(--pine-ink)" }}>Up 14 marks in three papers</p>
                <p className="note">Weakest now: Carbon compounds, magnetic effects, light. They&apos;re in today&apos;s mixed review.</p>
              </section>
              <SubjectsStrip revision />
            </>
          )}
        </div>
      </main>
    </>
  );
}
