import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { SubjectMark, cx } from "@/components/ui/primitives";
import { subjects } from "@/lib/data/content";
import { SUBJECT_STATS } from "@/lib/data/student";
import { STEP_LABEL, STEP_ORDER, type StepState } from "@/lib/types";

/* Five labelled step bars on a hero panel (Watch → Test). */
export function HeroSteps({ states }: { states: StepState[] }) {
  const label = STEP_ORDER.map((s, i) => `${STEP_LABEL[s]} ${states[i] === "done" ? "done" : states[i] === "next" ? "next" : "not yet"}`).join(", ");
  return (
    <ol className="hstrip" aria-label={label}>
      {STEP_ORDER.map((s, i) => (
        <li key={s} className={cx(states[i] === "done" && "done", states[i] === "next" && "next")}>
          <span />
          {STEP_LABEL[s]}
        </li>
      ))}
    </ol>
  );
}

export function SubjectsStrip({ revision = false }: { revision?: boolean }) {
  return (
    <section className="panel" style={{ gridArea: "subj", gap: 4 }}>
      <div className="between" style={{ marginBottom: 4 }}>
        <h2 className="title-s">{revision ? "Revised so far" : "Subjects"}</h2>
        <Link href="/learn/physics" className="text-link">
          Learn
        </Link>
      </div>
      <div className="list">
        {subjects.map((s) => {
          const st = SUBJECT_STATS[s.id];
          const pct = revision ? st.revisedPct : st.pct;
          return (
            <Link key={s.id} href={`/learn/${s.id}`} className="list-row">
              <SubjectMark subject={s.id} size={38} />
              <span className="grow stack-2" style={{ gap: 5 }}>
                <span className="between">
                  <span className="title-3" style={{ fontSize: 15 }}>{s.name}</span>
                  <span className="strong tnum" style={{ fontSize: 14 }}>{pct}%</span>
                </span>
                <span className="mini-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${s.name} ${pct}%`}>
                  <span style={{ width: `${pct}%` }} />
                </span>
                <span className="label muted" style={{ fontWeight: 400 }}>{revision ? st.revised : st.next}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="icon-btn" aria-label={label}>
      <Icon name="chevron-left" size={22} />
    </Link>
  );
}

/* Small preview switcher for screens that have several designed states (sample data only). */
export function DemoBar({ label, items, current }: { label: string; items: { id: string; label: string; href: string }[]; current: string }) {
  return (
    <div className="demo-bar" role="navigation" aria-label="Preview states">
      <span>{label}</span>
      {items.map((it) => (
        <Link key={it.id} href={it.href} aria-current={it.id === current ? "true" : undefined}>
          {it.label}
        </Link>
      ))}
    </div>
  );
}
