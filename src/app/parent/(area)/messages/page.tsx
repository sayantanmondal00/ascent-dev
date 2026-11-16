"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Badge, Button, cx } from "@/components/ui/primitives";
import { TextField } from "@/components/ui/forms";
import { request } from "@/lib/data/parent";

/* P7 · Messages with the child: requests (approve / offer a middle option / decline, optional reply), notes, rewards, milestones. */
export default function ParentMessages() {
  const child = "Iba";
  const [req, setReq] = useState<"open" | "yes" | "counter" | "no">("open");
  const [reply, setReply] = useState("");
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const [goal, setGoal] = useState(0);
  const [reward, setReward] = useState("");
  const [rewardSet, setRewardSet] = useState<string | null>(null);
  const quick = ["Great week!", "Proud of your streak", "Dinner is your choice on Friday"];
  const goals = [`When ${child} finishes a chapter`, `When ${child} keeps a 14-day streak`, `When ${child} masters 3 chapters this month`];
  const msgs = { yes: `Approved. Sunday is now 20 minutes. ${child} has been told.`, counter: `Offered 30 minutes. ${child} can accept or reply.`, no: `${child} has been told. Talk about it at home.` };

  return (
    <main className="page">
      <div className="stack">
        <section className="stack-2">
          <Link href="/parent/home" className="text-link" style={{ alignSelf: "flex-start" }}>
            <Icon name="chevron-left" size={18} />
            This week
          </Link>
          <div>
            <p className="muted p0" style={{ fontSize: 14 }}>Requests, notes and rewards</p>
            <h1 className="title-1" style={{ marginTop: 2 }}>Messages with {child}</h1>
          </div>
        </section>
        <div className="split">
          <div className="stack">
            <section className="panel" style={{ borderRadius: 20 }}>
              <div className="between" style={{ alignItems: "center" }}>
                <h2 className="title-2" style={{ fontSize: 19 }}>Waiting for you</h2>
                <Badge tone={req === "open" ? "danger" : "neutral"}>{req === "open" ? "1 new" : "All done"}</Badge>
              </div>
              <div className="stack-2" style={{ gap: 10, padding: 14, borderRadius: 16, border: "1px solid var(--line)" }}>
                <div className="small muted">{child} asked · {request.ago}</div>
                <div className="title-3">{request.ask.replace(":", "")}: {request.detail} {request.instead.replace(".", "")}</div>
                <p className="p0 muted" style={{ fontSize: 14, paddingLeft: 12, borderLeft: "3px solid var(--line)" }}>&ldquo;{request.reason}&rdquo;</p>
                {req === "open" ? (
                  <>
                    <div className="row-wrap">
                      <Button className="grow" onClick={() => setReq("yes")}>Approve</Button>
                      <Button variant="secondary" className="grow" onClick={() => setReq("counter")}>Offer 30 min</Button>
                      <Button variant="secondary" className="grow" onClick={() => setReq("no")}>Not this time</Button>
                    </div>
                    <TextField label="Add a reply (optional)" placeholder="e.g. OK, but finish your flashcards on Saturday" value={reply} onChange={(e) => setReply(e.target.value)} />
                  </>
                ) : (
                  <p role="status" className="row p0 panel-pine strong" style={{ gap: 8, padding: "10px 12px", borderRadius: 12, color: "var(--pine-ink)", fontSize: 14 }}>
                    <Icon name="check" size={18} strokeWidth={2.4} />
                    {msgs[req]}
                    {reply && ` Your reply: “${reply}”`}
                  </p>
                )}
              </div>
              <h3 className="small muted p0" style={{ fontWeight: 700, fontSize: 14, marginTop: 6 }}>Earlier</h3>
              <div className="list">
                <div className="list-row" style={{ alignItems: "flex-start", minHeight: 0, padding: "10px 0" }}>
                  <div className="grow"><div className="title-3" style={{ fontSize: 15 }}>Swap Chemistry for Maths on Friday</div><div className="small muted">21 Oct · &ldquo;Maths test at school on Saturday&rdquo;</div></div>
                  <Badge tone="mastered" icon="check">Approved</Badge>
                </div>
                <div className="list-row" style={{ alignItems: "flex-start", minHeight: 0, padding: "10px 0" }}>
                  <div className="grow"><div className="title-3" style={{ fontSize: 15 }}>20 minutes a day during school exams</div><div className="small muted">12 Oct · You replied: &ldquo;Let&apos;s keep 30, you&apos;re doing well&rdquo;</div></div>
                  <Badge tone="neutral">Changed to 30</Badge>
                </div>
              </div>
            </section>

            <section className="panel" style={{ borderRadius: 20 }}>
              <h2 className="title-2" style={{ fontSize: 19 }}>Send {child} a note</h2>
              <div className="row-wrap">
                {quick.map((q) => (
                  <button key={q} type="button" className="as-chip as-chip--button" style={{ fontWeight: 500, minHeight: 40 }} onClick={() => setDraft(q)}>{q}</button>
                ))}
              </div>
              <div className="as-field">
                <label htmlFor="note" className="as-field-label">Your note</label>
                <textarea id="note" className="as-input as-textarea" rows={3} maxLength={120} value={draft} onChange={(e) => setDraft(e.target.value)} style={{ minHeight: 88 }} />
              </div>
              <div className="row">
                <span className="grow small muted">{draft.length} of 120 characters · shows on {child}&apos;s Today</span>
                <Button onClick={() => { if (draft.trim()) { setSent([draft.trim(), ...sent]); setDraft(""); } }}>Send</Button>
              </div>
              <h3 className="small muted p0" style={{ fontWeight: 700, fontSize: 14, marginTop: 6 }}>Sent</h3>
              <div className="list">
                {[...sent.map((t) => ({ t, m: "Just now" })), { t: "Well done on the Acids test!", m: "Mon · seen" }, { t: "Don’t forget your flashcards tonight", m: "22 Oct · seen" }].map((s, i) => (
                  <div key={i} className="list-row" style={{ minHeight: 0, padding: "10px 0" }}>
                    <div className="grow" style={{ fontSize: 15 }}>{s.t}</div>
                    <span className="small muted" style={{ flex: "none" }}>{s.m}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="stack">
            <section className="panel" style={{ borderRadius: 20 }}>
              <div className="row" style={{ gap: 10 }}>
                <span className="ico ico-gold"><Icon name="gift" size={20} /></span>
                <h2 className="title-2" style={{ fontSize: 19 }}>Rewards</h2>
              </div>
              <div className="stack-2 panel-gold" style={{ padding: 12, borderRadius: 14 }}>
                <div className="title-3" style={{ fontSize: 15 }}>Finish Electricity → new cricket bat</div>
                <div className="as-bar as-bar--gold" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} aria-label="Reward progress"><div className="as-bar-fill" style={{ width: "40%" }} /></div>
                <div className="small muted">2 of 5 topics mastered · set 20 Oct</div>
              </div>
              {rewardSet && (
                <div className="stack-2 panel-gold" style={{ padding: 12, borderRadius: 14 }}>
                  <div className="title-3" style={{ fontSize: 15 }}>{rewardSet}</div>
                  <div className="small muted">Just set · {child} has been told</div>
                </div>
              )}
              <h3 className="title-3" style={{ fontSize: 15, marginTop: 4 }}>Set a new reward</h3>
              <div role="radiogroup" aria-label={`When ${child} earns it`} className="stack-2" style={{ gap: 6 }}>
                {goals.map((g, i) => (
                  <button key={g} type="button" role="radio" aria-checked={goal === i} className={cx("choice", goal === i && "is-on")} style={{ minHeight: 46, padding: "0 12px", fontWeight: 700, fontSize: 14 }} onClick={() => setGoal(i)}>
                    {g}
                  </button>
                ))}
              </div>
              <TextField label="The reward" placeholder="e.g. Sunday trip to Ward's Lake" value={reward} onChange={(e) => setReward(e.target.value)} />
              <Button variant="secondary" onClick={() => { if (reward.trim()) { setRewardSet(`${goals[goal].replace("When ", "")} → ${reward.trim()}`); setReward(""); } }}>Set reward</Button>
              <p className="note">Rewards for effort (finishing, keeping a streak) work better than rewards for marks. Only you and {child} see them.</p>
            </section>
            <section className="panel" style={{ borderRadius: 20, gap: 4 }}>
              <h2 className="title-2" style={{ fontSize: 19, marginBottom: 6 }}>{child}&apos;s milestones</h2>
              {[
                { icon: "flame" as const, t: "12-day study streak", s: "Today" },
                { icon: "trophy" as const, t: "Badge: Circuit starter", s: "Mastered a first Electricity topic · Tue" },
                { icon: "check" as const, t: "Acids, Bases and Salts mastered", s: "Chapter test 22/25 · Mon" },
              ].map((m) => (
                <div key={m.t} className="row" style={{ gap: 10, padding: "10px 0", borderTop: "1px solid var(--line)" }}>
                  <Icon name={m.icon} size={20} />
                  <div className="grow"><div className="title-3" style={{ fontSize: 15 }}>{m.t}</div><div className="small muted">{m.s}</div></div>
                </div>
              ))}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
