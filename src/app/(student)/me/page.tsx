import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { Leaderboard } from "@/components/student/Leaderboard";
import { subjects } from "@/lib/data/content";
import { SUBJECT_STATS, chapterProgress, chaptersFor, student } from "@/lib/data/student";
import { badges, week } from "@/lib/data/social";
import { LEVEL_LABEL } from "@/components/ui/primitives";
import { cookies } from "next/headers";
import { logout } from "@/app/auth-actions";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Me" };

export default async function MePage() {
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  const maxM = Math.max(...week.map((d) => d.value));
  return (
    <main className="page">
      <div className="split">
        <div className="stack">
          <header className="row" style={{ gap: 14 }}>
            <span className="avatar" style={{ width: 60, height: 60, fontFamily: "var(--font-display)", fontSize: 26 }} aria-hidden>
              {student.firstName[0]}
            </span>
            <div className="grow">
              <h1 className="title-1" style={{ fontSize: 28 }}>{student.firstName}</h1>
              <p className="muted p0" style={{ fontSize: 14, marginTop: 2 }}>
                Class {student.classLevel} {student.section} · {student.school}, {student.town}
              </p>
            </div>
          </header>

          <section className="panel" style={{ borderRadius: 20 }}>
            <div className="between" style={{ flexWrap: "wrap" }}>
              <h2 className="title-2" style={{ fontSize: 19 }}>This week</h2>
              <span className="small strong" style={{ color: "var(--pine-ink)" }}>+1h 15m on last week</span>
            </div>
            <p className="p0">
              <strong>4h 20m studied</strong> · goal met on 5 of 6 days · 3 topics finished
            </p>
            <div role="img" aria-label={"Minutes studied: " + week.map((d) => `${d.label} ${d.value}`).join(", ") + " so far"} style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 8, alignItems: "end", height: 96 }}>
              {week.map((d, i) => (
                <div key={d.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
                  <span className="label tnum">{d.value}</span>
                  <div style={{ width: "100%", maxWidth: 40, borderRadius: 6, height: Math.max(6, Math.round((d.value / maxM) * 52)), background: i === week.length - 1 ? "var(--chart-2)" : "var(--chart-1)" }} />
                  <span className="label muted" style={{ fontWeight: 400 }}>{d.label}</span>
                </div>
              ))}
            </div>
            <div className="row-wrap">
              <span className="pill gold"><Icon name="flame" size={16} />{student.streakDays}-day streak · best {student.bestStreak}</span>
              <span className="pill pine">Level {student.level} · {student.xpToNext} XP to Level {student.level + 1}</span>
            </div>
          </section>

          <section className="panel" style={{ borderRadius: 20, gap: 14 }}>
            <div>
              <h2 className="title-2" style={{ fontSize: 19 }}>Mastery map</h2>
              <p className="note" style={{ marginTop: 2 }}>Each square is a chapter. Tap one to open it.</p>
            </div>
            {subjects.map((s) => (
              <div key={s.id} className="stack-2">
                <div className="between" style={{ fontSize: 14 }}>
                  <span className="strong">{s.short}</span>
                  <span className="muted">{SUBJECT_STATS[s.id].pct}%</span>
                </div>
                <div className="mmap">
                  {chaptersFor(s.id).map((c, i) => {
                    const p = chapterProgress(c.id);
                    return (
                      <Link key={c.id} href={`/learn/${s.id}/${c.id}`} className={`${p.level}${p.refreshDue ? " due" : ""}`} aria-label={`Chapter ${c.bookNumber}, ${c.title}: ${LEVEL_LABEL[p.level]}${p.refreshDue ? ", refresh due" : ""}`}>
                        {i + 1}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="as-mbar-legend">
              <span><span className="as-swatch as-swatch--mastered" />Mastered</span>
              <span><span className="as-swatch as-swatch--practised" />Practised</span>
              <span><span className="as-swatch as-swatch--learning" />Learning</span>
              <span><span className="as-swatch as-swatch--notStarted" />Not started</span>
              <span><span className="as-swatch" style={{ boxShadow: "inset 0 0 0 2px var(--chart-2)" }} />Refresh due</span>
            </div>
          </section>
        </div>

        <div className="stack">
          <Leaderboard displayName={`${student.firstName} ${student.lastInitial}.`} />
          <section className="panel" style={{ borderRadius: 20, gap: 0, paddingTop: 8, paddingBottom: 8 }}>
            <div className="list">
              <Link href="/me/family" className="list-row" style={{ minHeight: 56 }}>
                <span className="grow">
                  <span className="title-3" style={{ display: "block", fontSize: 15 }}>Family and privacy</span>
                  <span className="small muted">What your parent sees · ask to change your plan</span>
                </span>
                <Icon name="chevron-right" size={18} className="chev" />
              </Link>
              <Link href="/coming-soon?what=Settings" className="list-row" style={{ minHeight: 56 }}>
                <span className="grow">
                  <span className="title-3" style={{ display: "block", fontSize: 15 }}>Settings</span>
                  <span className="small muted">Reminders · data saver · offline downloads · language</span>
                </span>
                <Icon name="chevron-right" size={18} className="chev" />
              </Link>
              <form action={logout} className="list-row" style={{ minHeight: 56 }}>
                <span className="grow">
                  <span className="title-3" style={{ display: "block", fontSize: 15 }}>Signed in as {session?.u ?? "–"}</span>
                  <span className="small muted">Sign out on a shared phone so the next person starts fresh</span>
                </span>
                <button type="submit" className="as-btn as-btn--secondary">
                  <Icon name="logout" size={18} />
                  Sign out
                </button>
              </form>
            </div>
          </section>
          <section className="stack-2" style={{ gap: 10 }}>
            <h2 className="title-2" style={{ fontSize: 19 }}>Badges · {badges.filter((b) => b.got).length} of 24</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
              {badges.map((b) => (
                <div key={b.name} className={`badge-tile${b.got ? "" : " locked"}`}>
                  <span className="badge-ico"><Icon name="trophy" size={22} /></span>
                  <span className="small strong" style={{ lineHeight: 1.2 }}>{b.name}</span>
                  <span className="label muted" style={{ fontWeight: 400, lineHeight: 1.25 }}>{b.how}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
