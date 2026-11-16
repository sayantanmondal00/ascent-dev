"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { XPRing, cx } from "@/components/ui/primitives";
import type { Task } from "@/lib/types";

/* The Today card's goal ring + "Also today" tasks. Ticking a task adds its XP to the ring; tasks can be swapped. */
export function GoalAndTasks({ baseXp, goal, tasks, subline, children }: { baseXp: number; goal: number; tasks: Task[]; subline: React.ReactNode; children?: React.ReactNode }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [swapped, setSwapped] = useState<string | null>(null);
  const xp = Math.min(goal, baseXp + tasks.reduce((s, t) => s + (done[t.id] ? t.xp : 0), 0));
  return (
    <section className="panel" style={{ gridArea: "today", gap: 14 }}>
      <div className="row" style={{ gap: 14 }}>
        <XPRing value={xp} goal={goal} size={64} />
        <div className="grow">
          <h2 className="title-2" style={{ fontSize: 19 }}>Today&apos;s goal · {goal} XP</h2>
          <p className="small muted p0" style={{ marginTop: 2 }}>{subline}</p>
        </div>
      </div>
      {children}
      <div className="stack-2">
        <span className="eyebrow">Also today</span>
        {tasks.map((t) => {
          const on = !!done[t.id];
          return (
            <div key={t.id} className={cx("task", on && "is-done")}>
              <button type="button" className={cx("check-box", on && "is-on")} aria-pressed={on} aria-label={(on ? "Mark not done: " : "Mark done: ") + t.label} onClick={() => setDone({ ...done, [t.id]: !on })}>
                {on && <Icon name="check" size={20} strokeWidth={3} />}
              </button>
              <Link href={t.href} className="grow" style={{ color: "inherit", textDecoration: "none" }}>
                <div className="title-3" style={{ fontSize: 15 }}>{t.label}</div>
                <div className="small muted">
                  {t.sub} · +{t.xp} XP
                </div>
              </Link>
              <button type="button" className="icon-btn plain" aria-label={`Swap ${t.label} for another task`} onClick={() => setSwapped(t.label)}>
                <Icon name="swap" size={20} />
              </button>
            </div>
          );
        })}
        {swapped && (
          <p className="note" role="status">
            Swapping “{swapped}” is coming soon. Your daily time still counts whatever you study.
          </p>
        )}
      </div>
    </section>
  );
}

export function ReminderButtons() {
  const [set, setSet] = useState(false);
  return (
    <div className="row-wrap">
      <button type="button" className="as-btn as-btn--reward as-btn--lg" style={{ flex: "1 1 180px" }} onClick={() => setSet(true)}>
        {set ? "Reminder set for 7:00 pm" : "Remind me at 7:00 pm"}
      </button>
      <Link href="/coming-soon?what=Add%20to%20home%20screen" className="as-btn as-btn--lg" style={{ flex: "1 1 180px", background: "transparent", color: "var(--on-hero)", borderColor: "var(--hero-track)" }}>
        Add Ascent to home screen
      </Link>
    </div>
  );
}
