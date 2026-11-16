"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button, cx } from "@/components/ui/primitives";
import { SegmentedControl, TextField } from "@/components/ui/forms";
import { OnboardHeader, OnboardPage } from "@/components/onboarding/parts";
import { schools } from "@/lib/data/schools";

/* D6 · About you (step 3 of 3): first name, class, school (search, no school codes at launch), study time. */
export default function AboutYouPage() {
  const router = useRouter();
  const [name, setName] = useState("Iba");
  const [cls, setCls] = useState<"9" | "10">("10");
  const [q, setQ] = useState("st mar");
  const [school, setSchool] = useState<string | null>("sch-1");
  const [typed, setTyped] = useState(false);
  const [time, setTime] = useState("evening");
  const [err, setErr] = useState("");
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const results = schools.filter((s) => words.every((w) => `${s.name} ${s.town}`.toLowerCase().includes(w)));
  const times = [["morning", "Before school"], ["afternoon", "After school"], ["evening", "Evening · 7 pm"], ["night", "Late night"]] as const;

  function next() {
    if (!name.trim()) return setErr("Add your first name.");
    if (!school && !(typed && q.trim())) return setErr("Find your school, or type its name.");
    router.push("/today?mode=day1");
  }

  return (
    <OnboardPage footer={<Button size="lg" block onClick={next}>Start learning</Button>}>
      <OnboardHeader step="Step 3 of 3" />
      <div className="stack-2">
        <h1 className="title-1" style={{ fontSize: 28 }}>About you</h1>
        <p className="muted p0">Three quick things, then your first topic.</p>
      </div>
      <TextField label="First name" value={name} autoComplete="given-name" onChange={(e) => { setName(e.target.value); setErr(""); }} />
      <div className="as-field">
        <span className="as-field-label">Class</span>
        <SegmentedControl label="Class" value={cls} onChange={setCls} options={[{ id: "9", label: "Class 9" }, { id: "10", label: "Class 10" }]} />
      </div>
      <div className="as-field">
        <span className="as-field-label">School</span>
        <div style={{ border: "1px solid var(--line-strong)", borderRadius: 12, background: "var(--surface)", overflow: "hidden" }}>
          <label className="row" style={{ gap: 10, height: 50, padding: "0 14px", color: "var(--ink-muted)" }}>
            <Icon name="search" size={18} />
            <input type="search" value={q} aria-label="Search for your school" placeholder="School name or town" onChange={(e) => { setQ(e.target.value); setSchool(null); setTyped(false); }} style={{ flex: 1, minWidth: 0, border: "none", fontSize: 16, color: "var(--ink)", background: "transparent", outline: "none" }} />
          </label>
          {!typed &&
            results.map((s) => (
              <button key={s.id} type="button" onClick={() => setSchool(s.id)} aria-pressed={school === s.id} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, minHeight: 56, padding: "8px 12px", border: "none", borderTop: "1px solid var(--line)", background: school === s.id ? "var(--pine-soft)" : "transparent", textAlign: "left", color: "var(--ink)", width: "100%", cursor: "pointer", font: "inherit" }}>
                <span className="strong" style={{ fontSize: 15 }}>{s.name}</span>
                <span className="small muted">{s.town} · {s.district}</span>
              </button>
            ))}
          <button type="button" onClick={() => { setTyped(true); setSchool(null); }} className="text-link" style={{ width: "100%", justifyContent: "center", borderTop: "1px solid var(--line)", minHeight: 48 }}>
            {typed ? `We'll match “${q || "your school"}” later` : "My school isn't listed"}
          </button>
        </div>
      </div>
      <div className="as-field">
        <span className="as-field-label">When do you usually study?</span>
        <div role="radiogroup" aria-label="Study time" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {times.map(([id, label]) => (
            <button key={id} type="button" role="radio" aria-checked={time === id} className={cx("choice", time === id && "is-on")} style={{ minHeight: 50, justifyContent: "center", fontWeight: 700 }} onClick={() => setTime(id)}>
              {label}
            </button>
          ))}
        </div>
        <p className="as-field-hint">We&apos;ll remind you once a day at this time. You can turn it off in Me → Settings.</p>
      </div>
      {err && <p className="as-field-error" role="alert">{err}</p>}
    </OnboardPage>
  );
}
