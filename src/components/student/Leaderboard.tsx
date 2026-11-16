"use client";

import { useState } from "react";
import { SegmentedControl, Toggle } from "@/components/ui/forms";
import { leaderboards, type Period, type Scope } from "@/lib/data/social";
import { cx } from "@/components/ui/primitives";

export function Leaderboard({ displayName }: { displayName: string }) {
  const [scope, setScope] = useState<Scope>("class");
  const [period, setPeriod] = useState<Period>("week");
  const [show, setShow] = useState(true);
  const board = leaderboards[scope][period];
  return (
    <>
      <section className="panel" style={{ borderRadius: 20 }}>
        <h2 className="title-2" style={{ fontSize: 19 }}>Leaderboards</h2>
        <SegmentedControl label="Leaderboard scope" value={scope} onChange={setScope} options={[{ id: "class", label: "Class" }, { id: "school", label: "School" }, { id: "state", label: "Meghalaya" }]} />
        <div role="group" aria-label="Leaderboard period" className="row-wrap">
          {([["week", "This week"], ["improved", "Most improved"], ["all", "All-time"]] as const).map(([id, label]) => (
            <button key={id} type="button" className="period-btn" aria-pressed={period === id} onClick={() => setPeriod(id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="panel-pine" style={{ padding: "12px 14px", borderRadius: 14 }}>
          <div className="title-2 tnum" style={{ fontSize: 22, color: "var(--pine-ink)" }}>{board.head}</div>
          <div className="small" style={{ color: "var(--pine-ink)" }}>{board.sub}</div>
        </div>
        <div className="stack-2" style={{ gap: 4 }}>
          {board.rows.map(([rank, name, xp]) => {
            const you = name === "YOU";
            return (
              <div key={rank} className={cx("as-lrow", you && "is-you")}>
                <span className="as-lrow-rank">#{rank}</span>
                <span className="as-lrow-name">{you ? (show ? "You" : "You (hidden from others)") : name}</span>
                <span className="as-lrow-xp">{xp}</span>
              </div>
            );
          })}
        </div>
        <p className="note">Based on study effort, not marks.</p>
      </section>
      <section className="panel" style={{ borderRadius: 20, gap: 10 }}>
        <Toggle checked={show} onChange={setShow} label="Show me on leaderboards" description={show ? `Others see you as “${displayName}”` : "Hidden. You still see your own rank."} />
        <p className="note">Your parent can also hide you from leaderboards.</p>
      </section>
    </>
  );
}
