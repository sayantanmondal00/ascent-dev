"use client";

import { useState } from "react";
import { Badge, Button, cx } from "@/components/ui/primitives";
import { TextField, Toggle } from "@/components/ui/forms";

export function AskToChange() {
  const [ask, setAsk] = useState(0);
  const [why, setWhy] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const labels = ["Daily time", "A lighter day", "Subject order"];
  return (
    <section className="panel" style={{ borderRadius: 20 }}>
      <h2 className="title-2" style={{ fontSize: 19 }}>Ask to change your plan</h2>
      <p className="muted p0" style={{ fontSize: 14 }}>Now: 40 minutes a day, every day. Your parent decides, and gets your request straight away.</p>
      <div role="radiogroup" aria-label="What to change" className="row-wrap">
        {labels.map((l, i) => (
          <button key={l} type="button" role="radio" aria-checked={ask === i} className={cx("as-chip", "as-chip--button", ask === i && "is-pressed")} onClick={() => { setAsk(i); setSent(null); }}>
            {l}
          </button>
        ))}
      </div>
      <TextField label="Why? (helps your parent say yes)" placeholder="e.g. I have choir practice on Sundays" value={why} onChange={(e) => setWhy(e.target.value)} />
      <Button onClick={() => setSent(labels[ask])}>Send request</Button>
      {sent && <p role="status" className="p0 strong" style={{ fontSize: 14, color: "var(--pine-ink)" }}>Sent. You&apos;ll see the answer here and on Today.</p>}
      <div className="row" style={{ alignItems: "flex-start", padding: 12, borderRadius: 14, border: "1px solid var(--line)" }}>
        <div className="grow">
          <div className="title-3" style={{ fontSize: 15 }}>{sent ? `Change: ${sent.toLowerCase()}` : "Make Sunday 20 minutes"}</div>
          <div className="small muted">{sent ? "Sent just now" : "Sent 2 hours ago"}</div>
        </div>
        <Badge tone="neutral">Waiting</Badge>
      </div>
    </section>
  );
}

export function LeaderboardSwitch({ displayName }: { displayName: string }) {
  const [show, setShow] = useState(true);
  return (
    <section className="panel" style={{ borderRadius: 20, gap: 4 }}>
      <h2 className="title-2" style={{ fontSize: 19, marginBottom: 4 }}>Leaderboards</h2>
      <Toggle checked={show} onChange={setShow} label="Show me on leaderboards" description={show ? `Class and school boards, as “${displayName}”. Your parent can also hide you.` : "Hidden from every leaderboard. You still earn XP and badges."} />
    </section>
  );
}
