"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Badge, Button } from "@/components/ui/primitives";
import { BottomSheet, Toggle } from "@/components/ui/forms";
import { ParentHeader } from "@/components/parent/ParentHeader";
import { logout } from "@/app/auth-actions";

/* P8 · Settings: children, guardians, leaderboards (both must allow), sign-in, notifications, data use, account, consent and data. */
function Row({ icon, title, sub, href = "#", danger, onClick }: { icon: IconName; title: string; sub: string; href?: string; danger?: boolean; onClick?: () => void }) {
  const inner = (
    <>
      <span className="ico ico-sunken" style={danger ? { background: "var(--danger-soft)", color: "var(--danger)" } : { color: "var(--ink)" }}>
        <Icon name={icon} size={20} />
      </span>
      <span className="grow">
        <span className="title-3" style={{ display: "block", fontSize: 15, color: danger ? "var(--danger)" : undefined }}>{title}</span>
        <span className="small muted" style={{ display: "block" }}>{sub}</span>
      </span>
      <Icon name="chevron-right" size={18} className="chev" />
    </>
  );
  if (onClick)
    return (
      <button type="button" className="list-row" onClick={onClick} style={{ width: "100%", background: "none", border: "none", borderTop: "1px solid var(--line)", font: "inherit", textAlign: "left", cursor: "pointer" }}>
        {inner}
      </button>
    );
  return <Link href={href} className="list-row" style={{ borderTop: "1px solid var(--line)" }}>{inner}</Link>;
}

function Card({ title, children, note }: { title: string; children: ReactNode; note?: string }) {
  return (
    <section className="panel" style={{ borderRadius: 20, gap: 2 }}>
      <h2 className="title-2" style={{ fontSize: 19, marginBottom: 8 }}>{title}</h2>
      {children}
      {note && <p className="note" style={{ marginTop: 8 }}>{note}</p>}
    </section>
  );
}

function T({ label, desc, on, set }: { label: string; desc: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <div style={{ borderTop: "1px solid var(--line)", padding: "6px 0" }}>
      <Toggle checked={on} onChange={set} label={label} description={desc} />
    </div>
  );
}

export default function ParentSettings() {
  const child = "Iba";
  const [s, setS] = useState({ cls: true, sch: true, meg: false, wk: true, miss: true, test: true, pin: true, wifi: true, saver: true });
  const set = (k: keyof typeof s) => (v: boolean) => setS({ ...s, [k]: v });
  const [del, setDel] = useState(false);
  const [deleted, setDeleted] = useState(false);
  return (
    <main className="page">
      <div className="stack">
        <section className="stack-3" style={{ gap: 14 }}>
          <ParentHeader />
          <div>
            <p className="muted p0" style={{ fontSize: 14 }}>Family, privacy and account</p>
            <h1 className="title-1" style={{ marginTop: 2 }}>Settings</h1>
          </div>
        </section>
        <div className="g2" style={{ alignItems: "start" }}>
          <div className="stack">
            <Card title="Children">
              <div className="row" style={{ minHeight: 64, padding: "6px 0" }}>
                <span className="avatar" style={{ background: "var(--sunken)", color: "var(--ink)", fontSize: 18 }} aria-hidden>{child[0]}</span>
                <span className="grow">
                  <span className="title-3" style={{ display: "block", fontSize: 15 }}>{child}</span>
                  <span className="small muted" style={{ display: "block" }}>Class 10 B · St Mary&apos;s School, Shillong</span>
                </span>
                <Badge tone="mastered" icon="link">Linked</Badge>
              </div>
              <Row icon="plus" title="Add another child" sub="Each child gets their own plan and progress" href="/parent/setup?step=3" />
            </Card>
            <Card title="Guardians" note="Only the main guardian can pay or delete an account.">
              <div className="row" style={{ minHeight: 60, padding: "6px 0" }}>
                <span className="ico ico-sunken" style={{ color: "var(--ink)" }}><Icon name="user" size={20} /></span>
                <span className="grow">
                  <span className="title-3" style={{ display: "block", fontSize: 15 }}>You</span>
                  <span className="small muted" style={{ display: "block" }}>Main guardian · +91 98xxxxxx21</span>
                </span>
              </div>
              <Row icon="users" title="Invite a second guardian" sub="They see the same things and can approve requests" href="/coming-soon?what=Guardian%20invites" />
            </Card>
            <Card title={`${child} on leaderboards`} note={`${child} can hide too. ${child} appears on a leaderboard only if you both allow it.`}>
              <T label="Class leaderboard" desc={`Shows as “${child} K.” in Class 10 B`} on={s.cls} set={set("cls")} />
              <T label="School leaderboard" desc="St Mary’s, Class 10" on={s.sch} set={set("sch")} />
              <T label="All Meghalaya" desc="Shown as a percentile with nearby students" on={s.meg} set={set("meg")} />
            </Card>
            <Card title="Sign-in and this phone">
              <T label="Ask for my PIN" desc={`Needed when you and ${child} share this phone`} on={s.pin} set={set("pin")} />
              <Row icon="lock" title="Change PIN" sub="4 digits · forgot it? Verify with an SMS code" href="/coming-soon?what=Change%20PIN" />
              <div className="stack-2" style={{ gap: 2, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                <span className="label muted" style={{ marginBottom: 4, fontSize: 13 }}>Signed in on</span>
                <form action={logout} className="row" style={{ minHeight: 52 }}>
                  <Icon name="phone" size={20} />
                  <span className="grow"><span className="title-3" style={{ display: "block", fontSize: 15 }}>This phone</span><span className="small muted">Shared with {child} · parent area behind your PIN</span></span>
                  <Button type="submit" variant="secondary">Sign out</Button>
                </form>
                <div className="row" style={{ minHeight: 52 }}>
                  <Icon name="phone" size={20} />
                  <span className="grow"><span className="title-3" style={{ display: "block", fontSize: 15 }}>Your own phone</span><span className="small muted">Last used yesterday</span></span>
                  <Button variant="secondary">Sign out</Button>
                </div>
              </div>
            </Card>
          </div>
          <div className="stack">
            <Card title="Notifications">
              <T label="Weekly summary" desc="Sunday at 7 pm" on={s.wk} set={set("wk")} />
              <T label="Two days missed in a row" desc="A gentle heads-up, not an alarm" on={s.miss} set={set("miss")} />
              <T label="Chapter test results" desc="Score and what to work on" on={s.test} set={set("test")} />
              <div className="row" style={{ minHeight: 60, borderTop: "1px solid var(--line)" }}>
                <span className="grow"><span className="title-3" style={{ display: "block", fontSize: 15 }}>Requests from {child}</span><span className="small muted">Always on, so {child} is never left waiting</span></span>
                <span className="small strong muted">On</span>
              </div>
              <Row icon="clock" title="Quiet hours" sub="No notifications 9 pm to 7 am" href="/coming-soon?what=Quiet%20hours" />
            </Card>
            <Card title="Data use">
              <T label="Download videos on Wi-Fi only" desc="Saves mobile data. Notes and flashcards download any time" on={s.wifi} set={set("wifi")} />
              <T label={`Data saver for ${child}`} desc="Videos play at 240p · about 18 MB for 8 minutes" on={s.saver} set={set("saver")} />
            </Card>
            <Card title="Account">
              <Row icon="globe" title="Language" sub="English · Khasi and Garo coming soon" href="/coming-soon?what=Khasi%20and%20Garo" />
              <Row icon="star" title="Plan and payment" sub="Ascent Class 10 · [Price] a year · renews [date]" href="/coming-soon?what=Payments" />
              <Row icon="message" title="Help" sub="Call or email the Ascent team" href="/coming-soon?what=Help" />
            </Card>
            <Card title="Consent and data" note={`Under India’s data protection law, Ascent needs your consent to hold ${child}’s data. You can withdraw it any time.`}>
              <Row icon="shield" title="Your consent" sub="Given on 2 October 2026 · see what you agreed to" href="/privacy" />
              <Row icon="download" title={`Download ${child}’s data`} sub={`A copy of everything Ascent stores about ${child}`} href="/coming-soon?what=Data%20download" />
              <Row icon="trash" danger title={`Delete ${child}’s account`} sub={`Removes all of ${child}’s data. We ask you to confirm first`} onClick={() => setDel(true)} />
              {deleted && <p role="status" className="note" style={{ color: "var(--danger)" }}>Sample only: nothing was deleted.</p>}
            </Card>
          </div>
        </div>
      </div>
      <BottomSheet
        open={del}
        onClose={() => setDel(false)}
        title={`Delete ${child}’s account?`}
        actions={
          <>
            <button type="button" className="as-btn as-btn--block" style={{ background: "var(--danger)", color: "var(--on-danger)" }} onClick={() => { setDel(false); setDeleted(true); }}>
              <Icon name="cross" size={18} />
              Delete everything
            </button>
            <Button variant="secondary" block onClick={() => setDel(false)}>Keep the account</Button>
          </>
        }
      >
        This removes {child}&apos;s progress, scores, flashcards and streak for good. It can&apos;t be undone.
      </BottomSheet>
    </main>
  );
}
