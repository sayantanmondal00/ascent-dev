import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { AskToChange, LeaderboardSwitch } from "@/components/student/FamilyParts";
import { parent, student } from "@/lib/data/student";

export const metadata: Metadata = { title: "Family and privacy" };

const SEES = ["How long you study each day", "Quiz and test scores", "Chapters and their levels", "Your streak and badges", "Requests you send"];
const PRIVATE = ["Doubts you ask", "Each answer you chose", "How you rate flashcards", "What you search for"];

export default function FamilyPage() {
  return (
    <main className="page">
      <div className="stack">
        <section className="stack-2">
          <Link href="/me" className="text-link" style={{ alignSelf: "flex-start" }}>
            <Icon name="chevron-left" size={18} />
            Me
          </Link>
          <div>
            <p className="muted p0" style={{ fontSize: 14 }}>Who can see your progress</p>
            <h1 className="title-1" style={{ marginTop: 2 }}>Family</h1>
          </div>
        </section>
        <div className="split">
          <div className="stack">
            <section className="panel row" style={{ borderRadius: 20, flexDirection: "row" }}>
              <span className="ico ico-sunken" style={{ width: 48, height: 48, borderRadius: "50%", color: "var(--ink)" }}><Icon name="users" size={24} /></span>
              <div className="grow">
                <div className="title-3">Linked to your parent</div>
                <div className="small muted">Since {parent.linkedSince} · they set your daily goal</div>
              </div>
            </section>
            <div className="g2">
              <section className="panel" style={{ borderRadius: 20, gap: 6 }}>
                <h2 className="title-2" style={{ fontSize: 19 }}>Your parent sees</h2>
                <ul className="bullets">
                  {SEES.map((s) => (
                    <li key={s}><Icon name="eye" size={18} style={{ color: "var(--pine-ink)" }} />{s}</li>
                  ))}
                </ul>
              </section>
              <section className="panel" style={{ borderRadius: 20, gap: 6 }}>
                <h2 className="title-2" style={{ fontSize: 19 }}>Stays private</h2>
                <ul className="bullets">
                  {PRIVATE.map((s) => (
                    <li key={s}><Icon name="eye-off" size={18} style={{ color: "var(--ink-muted)" }} />{s}</li>
                  ))}
                </ul>
              </section>
            </div>
            <AskToChange />
          </div>
          <aside className="stack">
            <section className="panel" style={{ borderRadius: 20, gap: 10 }}>
              <h2 className="title-2" style={{ fontSize: 19 }}>Notes from your parent</h2>
              <div className="panel-gold" style={{ padding: 12, borderRadius: 14 }}>
                <div className="title-3" style={{ fontSize: 15 }}>&ldquo;Well done on the Acids test!&rdquo;</div>
                <div className="small muted">Monday</div>
              </div>
              <div className="panel-gold" style={{ padding: 12, borderRadius: 14 }}>
                <div className="title-3" style={{ fontSize: 15 }}>Reward: finish Electricity → new cricket bat</div>
                <div className="small muted">2 of 5 topics mastered</div>
              </div>
            </section>
            <LeaderboardSwitch displayName={`${student.firstName} ${student.lastInitial}.`} />
            <section className="panel" style={{ borderRadius: 20, gap: 10 }}>
              <h2 className="title-2" style={{ fontSize: 19 }}>Link another guardian</h2>
              <p className="muted p0" style={{ fontSize: 14 }}>Give this code to a parent or guardian setting up Ascent. It works for 24 hours.</p>
              <div className="title-1 tnum" style={{ fontSize: 28, letterSpacing: 4, textAlign: "center", padding: 12, borderRadius: 14, background: "var(--ground)" }}>KQ7-M2P</div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
