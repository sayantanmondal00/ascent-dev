"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button, XPRing, cx } from "@/components/ui/primitives";
import { SegmentedControl, Toggle } from "@/components/ui/forms";
import { ParentHeader } from "@/components/parent/ParentHeader";

/* P6 · Plan: parents set how much and when, never what or how. The finish-date projection is sample logic
   (ASSUMED: "on track" = every chapter done two weeks before the first paper). */
const PROJ: Record<number, { title: string; body: string; tone: "danger" | "neutral" | "pine" }> = {
  30: { title: "Behind: done by about 18 Dec", body: "That is after the boards. Iba would miss about 3 chapters.", tone: "danger" },
  40: { title: "A little behind: done by about 2 Dec", body: "Only 5 days before the Science exam, with little time to revise.", tone: "neutral" },
  50: { title: "On target: done by about 23 Nov", body: "Two weeks left for revision and past papers.", tone: "pine" },
  60: { title: "Ahead: done by about 16 Nov", body: "Three weeks left for revision.", tone: "pine" },
  90: { title: "Well ahead: done by about 6 Nov", body: "This is a heavy load on top of school. Watch for tiredness.", tone: "neutral" },
};
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const FOCUS_NOTE = {
  bal: "Ascent mixes subjects by what is due and what carries the most marks.",
  maths: "Maths tasks come first each day. Science still gets at least a third of the time.",
  sci: "Physics and Chemistry tasks come first each day. Maths still gets at least a third of the time.",
};
const BASE = { mins: 40, days: "1111111", maths: 65, sci: 60, focus: "bal", paused: false };

export default function ParentPlan() {
  const child = "Iba";
  const [mins, setMins] = useState(40);
  const [days, setDays] = useState([1, 1, 1, 1, 1, 1, 1]);
  const [maths, setMaths] = useState(65);
  const [sci, setSci] = useState(60);
  const [focus, setFocus] = useState<"bal" | "maths" | "sci">("bal");
  const [paused, setPaused] = useState(false);
  const [saved, setSaved] = useState(false);
  const touch = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setSaved(false); };

  const changes = [mins !== BASE.mins, days.join("") !== BASE.days, maths !== BASE.maths, sci !== BASE.sci, focus !== BASE.focus, paused !== BASE.paused].filter(Boolean).length;
  const proj = PROJ[mins];
  const xp = Math.round(mins * 1.5);
  const on = days.filter(Boolean).length;
  const projStyle = proj.tone === "danger" ? { background: "var(--danger-soft)", color: "var(--danger)" } : proj.tone === "pine" ? { background: "var(--pine-soft)", color: "var(--pine-ink)" } : { background: "var(--sunken)", color: "var(--ink)" };

  return (
    <>
      <main className="page">
        <div className="stack">
          <section className="stack-3" style={{ gap: 14 }}>
            <ParentHeader />
            <div>
              <p className="muted p0" style={{ fontSize: 14 }}>You set the pace. {child} chooses what to study within it.</p>
              <h1 className="title-1" style={{ marginTop: 2 }}>{child}&apos;s plan</h1>
            </div>
          </section>
          <div className="split">
            <div className="stack">
              <section aria-labelledby="time-h" className="panel" style={{ borderRadius: 20 }}>
                <h2 id="time-h" className="title-2" style={{ fontSize: 19 }}>Daily study time</h2>
                <div role="radiogroup" aria-labelledby="time-h" style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 6 }}>
                  {[30, 40, 50, 60, 90].map((n) => (
                    <button key={n} type="button" role="radio" aria-checked={mins === n} className={cx("as-chip", "as-chip--button", mins === n && "is-pressed")} style={{ height: 54, borderRadius: 12, flexDirection: "column", gap: 0, justifyContent: "center", lineHeight: 1.1, fontSize: 16, padding: 0 }} onClick={() => touch(setMins)(n)}>
                      {n}
                      <span style={{ fontSize: 12, fontWeight: 500 }}>min</span>
                    </button>
                  ))}
                </div>
                <div className="stack-2" style={{ gap: 4, padding: 12, borderRadius: 14, background: projStyle.background }}>
                  <div className="title-3" style={{ fontSize: 15, color: projStyle.color }}>{proj.title}</div>
                  <div style={{ fontSize: 14 }}>{proj.body}</div>
                </div>
                <p className="note">
                  In {child}&apos;s app this becomes about <strong style={{ color: "var(--ink)" }}>{xp} XP a day</strong>. The most you can set is 2 hours: longer sessions make less of it stick.
                </p>
              </section>

              <section aria-labelledby="days-h" className="panel" style={{ borderRadius: 20 }}>
                <h2 id="days-h" className="title-2" style={{ fontSize: 19 }}>Study days</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6 }}>
                  {DAYS.map((full, i) => (
                    <button key={full} type="button" aria-pressed={!!days[i]} aria-label={`${full}, ${days[i] ? "study day" : "day off"}`} onClick={() => { const d = days.slice(); d[i] = d[i] ? 0 : 1; touch(setDays)(d); }} style={{ height: 48, borderRadius: 12, border: days[i] ? "1px solid var(--pine)" : "1px dashed var(--line-strong)", background: days[i] ? "var(--pine-soft)" : "var(--surface)", color: days[i] ? "var(--pine-ink)" : "var(--ink-muted)", fontWeight: 700, fontSize: 15, cursor: "pointer", font: "inherit" }}>
                      {full.slice(0, 2)}
                    </button>
                  ))}
                </div>
                <p className="note">{on === 7 ? "Every day." : `${on} study days a week.`} Days off never break {child}&apos;s streak.</p>
                <div className="row" style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid var(--line)" }}>
                  <div className="grow">
                    <div className="title-3" style={{ fontSize: 15 }}>Sunday: 20 minutes</div>
                    <div className="small muted">Lighter day · {child} asked, you approved today</div>
                  </div>
                  <Button variant="secondary">Change</Button>
                </div>
              </section>

              <section aria-labelledby="tgt-h" className="panel" style={{ borderRadius: 20 }}>
                <div>
                  <h2 id="tgt-h" className="title-2" style={{ fontSize: 19 }}>Target marks</h2>
                  <p className="note" style={{ marginTop: 4 }}>Ascent uses these to choose which chapters to suggest first. Ask {child} what feels right.</p>
                </div>
                {[
                  { name: "Mathematics", note: "Last test average: 22 of 25", v: maths, set: touch(setMaths) },
                  { name: "Science (Physics and Chemistry)", note: "Biology is not on Ascent yet", v: sci, set: touch(setSci) },
                ].map((t) => (
                  <div key={t.name} className="row" style={{ padding: "8px 0", borderTop: "1px solid var(--line)" }}>
                    <div className="grow">
                      <div className="title-3" style={{ fontSize: 15 }}>{t.name}</div>
                      <div className="small muted">{t.note}</div>
                    </div>
                    <button type="button" className="icon-btn" style={{ borderColor: "var(--line-strong)" }} aria-label={`Lower ${t.name} target`} onClick={() => t.set(Math.max(30, t.v - 5))}><Icon name="minus" size={20} /></button>
                    <span aria-live="polite" className="title-2 tnum" style={{ minWidth: 64, textAlign: "center" }}>
                      {t.v}
                      <span className="muted" style={{ fontSize: 14 }}>/80</span>
                    </span>
                    <button type="button" className="icon-btn" style={{ borderColor: "var(--line-strong)" }} aria-label={`Raise ${t.name} target`} onClick={() => t.set(Math.min(80, t.v + 5))}><Icon name="plus" size={20} /></button>
                  </div>
                ))}
              </section>

              <section aria-labelledby="first-h" className="panel" style={{ borderRadius: 20 }}>
                <h2 id="first-h" className="title-2" style={{ fontSize: 19 }}>What to put first</h2>
                <SegmentedControl label="What to put first" value={focus} onChange={touch(setFocus)} options={[{ id: "bal", label: "Balanced" }, { id: "maths", label: "Maths first" }, { id: "sci", label: "Science first" }]} />
                <p className="note">{FOCUS_NOTE[focus]}</p>
              </section>

              <section className="panel" style={{ borderRadius: 20, gap: 4 }}>
                <Toggle checked={paused} onChange={touch(setPaused)} label="Holiday pause" description={`Goals and the streak pause. ${child} can still study.`} />
                {paused && (
                  <div className="g2" style={{ paddingBottom: 6 }}>
                    <label className="as-field"><span className="as-field-label">From</span><span className="as-input-wrap"><input className="as-input" type="date" defaultValue="2026-12-24" /></span></label>
                    <label className="as-field"><span className="as-field-label">To</span><span className="as-input-wrap"><input className="as-input" type="date" defaultValue="2027-01-01" /></span></label>
                  </div>
                )}
              </section>

              <section className="panel" style={{ borderRadius: 20, gap: 4 }}>
                <h2 className="title-2" style={{ fontSize: 19, marginBottom: 6 }}>Board exam dates</h2>
                <div className="between" style={{ minHeight: 44, alignItems: "center", borderTop: "1px solid var(--line)" }}><span className="strong">Science</span><span>around 7 December</span></div>
                <div className="between" style={{ minHeight: 44, alignItems: "center", borderTop: "1px solid var(--line)" }}><span className="strong">Mathematics</span><span>[Date from MBOSE routine]</span></div>
                <p className="note" style={{ marginTop: 4 }}>Ascent updates these when MBOSE publishes the exam routine.</p>
              </section>
            </div>

            <aside className="stack">
              <section className="panel" style={{ borderRadius: 20 }}>
                <h2 className="title-2" style={{ fontSize: 19 }}>What {child} will see</h2>
                <div className="row" style={{ padding: 12, borderRadius: 16, background: "var(--ground)" }}>
                  <XPRing value={Math.round(xp / 3)} goal={xp} size={52} />
                  <div>
                    <div className="title-2" style={{ fontSize: 17 }}>Today&apos;s goal · {xp} XP</div>
                    <div className="small muted">Set by your parent</div>
                  </div>
                </div>
                <p className="p0" style={{ fontSize: 14, lineHeight: 1.45 }}>
                  When you save, {child} gets a short notice: <em>&ldquo;Your parent changed your plan: {mins} minutes a day.&rdquo;</em> {child} can ask you to change it from the app.
                </p>
              </section>
              <section className="panel panel-sunken" style={{ borderRadius: 20, gap: 10 }}>
                <div className="row strong" style={{ gap: 8, fontSize: 15 }}><Icon name="lock" size={18} />{child} stays in charge of</div>
                <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6, fontSize: 14, lineHeight: 1.4 }}>
                  <li>Which chapter to study next. Every chapter stays open, in MBOSE order.</li>
                  <li>The steps inside a topic: watch, read, simulate, recall, test.</li>
                  <li>Quiz answers and doubts. You see scores, not answers.</li>
                  <li>Swapping today&apos;s tasks, as long as the daily time is met.</li>
                </ul>
              </section>
              <section className="panel" style={{ borderRadius: 20, gap: 4 }}>
                <h2 className="title-2" style={{ fontSize: 19, marginBottom: 6 }}>Plan history</h2>
                {saved && <div style={{ fontSize: 14, padding: "8px 0", borderTop: "1px solid var(--line)" }}><strong>Now</strong> · Daily time {mins} min (you)</div>}
                <div style={{ fontSize: 14, padding: "8px 0", borderTop: "1px solid var(--line)" }}><strong>Today</strong> · Sunday set to 20 min ({child} asked)</div>
                <div style={{ fontSize: 14, padding: "8px 0", borderTop: "1px solid var(--line)" }}><strong>20 Oct</strong> · Daily time 30 → 40 min (you)</div>
                <div style={{ fontSize: 14, padding: "8px 0", borderTop: "1px solid var(--line)" }}><strong>2 Oct</strong> · First plan set up (you)</div>
              </section>
            </aside>
          </div>
        </div>
      </main>
      <div className="foot above-tabs">
        <div className="foot-in">
          <span aria-live="polite" className="grow muted" style={{ fontSize: 14 }}>
            {saved ? `Saved. ${child} has been told.` : changes ? `${changes} ${changes === 1 ? "change" : "changes"} not saved` : "No changes yet"}
          </span>
          <Button size="lg" disabled={!changes || saved} onClick={() => setSaved(true)}>
            {saved ? "Saved" : "Save plan"}
          </Button>
        </div>
      </div>
    </>
  );
}
