"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/primitives";
import { student } from "@/lib/data/student";

/* P1 · Shared phone: who's using Ascent? The child opens straight away; the parent area needs a 4-digit PIN.
   Sample: any 4 digits open the parent area. */
export default function SwitchPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"pick" | "pin">("pick");
  const [pin, setPin] = useState("");
  const press = (k: string) => {
    if (k === "del") return setPin((p) => p.slice(0, -1));
    if (pin.length < 4) {
      const next = pin + k;
      setPin(next);
      if (next.length === 4) setTimeout(() => router.push("/parent/home"), 250);
    }
  };
  return (
    <div className="app">
      <main className="page narrow" style={{ maxWidth: 480, paddingTop: 32 }}>
        <div className="stack">
          <Logo size={40} />
          {mode === "pick" ? (
            <>
              <h1 className="title-1">Who&apos;s using Ascent?</h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                <Link href="/today" className="panel" style={{ alignItems: "center", padding: "24px 16px", textDecoration: "none", color: "var(--ink)" }}>
                  <span className="avatar" style={{ width: 72, height: 72, fontSize: 30, fontFamily: "var(--font-display)" }} aria-hidden>{student.firstName[0]}</span>
                  <span className="title-3" style={{ fontSize: 18 }}>{student.firstName}</span>
                  <span className="small muted" style={{ textAlign: "center" }}>Class {student.classLevel} {student.section} · {student.streakDays}-day streak</span>
                </Link>
                <button type="button" onClick={() => setMode("pin")} className="panel" style={{ alignItems: "center", padding: "24px 16px", cursor: "pointer", font: "inherit", color: "var(--ink)" }}>
                  <span className="ico ico-sunken" style={{ width: 72, height: 72, borderRadius: "50%", color: "var(--ink)" }}><Icon name="users" size={32} /></span>
                  <span className="title-3" style={{ fontSize: 18 }}>Parent</span>
                  <span className="row small muted" style={{ gap: 4 }}><Icon name="lock" size={14} />Needs your PIN</span>
                </button>
              </div>
              <p className="row panel-sunken p0" style={{ alignItems: "flex-start", padding: 14, borderRadius: 16, fontSize: 14, lineHeight: 1.45 }}>
                <Icon name="phone" size={20} />
                <span>This screen appears only on a phone you share. If you and {student.firstName} have separate phones, each of you signs in with your own number.</span>
              </p>
              <p className="note" style={{ textAlign: "center" }}>New parent? <Link href="/parent/setup" className="strong">Set up the parent area</Link></p>
            </>
          ) : (
            <>
              <button type="button" className="text-link" style={{ alignSelf: "flex-start" }} onClick={() => { setMode("pick"); setPin(""); }}>
                <Icon name="chevron-left" size={18} />
                Back
              </button>
              <div className="stack-2" style={{ textAlign: "center" }}>
                <h1 className="title-1" style={{ fontSize: 26 }}>Enter your parent PIN</h1>
                <p className="muted p0" style={{ fontSize: 14 }}>Keeps the parent area private on a shared phone</p>
              </div>
              <div role="img" aria-label={`${pin.length} of 4 digits entered`} className="row" style={{ justifyContent: "center", gap: 16, padding: "8px 0" }}>
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--pine)", background: i < pin.length ? "var(--pine)" : "transparent" }} />
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, maxWidth: 320, width: "100%", margin: "0 auto" }}>
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k, i) =>
                  k === "" ? (
                    <span key={i} />
                  ) : (
                    <button key={i} type="button" onClick={() => press(k)} aria-label={k === "del" ? "Delete last digit" : k} className="title-2" style={{ height: 60, borderRadius: 16, border: k === "del" ? "none" : "1px solid var(--line)", background: k === "del" ? "transparent" : "var(--surface)", color: "var(--ink)", fontSize: 24, cursor: "pointer", display: "grid", placeItems: "center" }}>
                      {k === "del" ? <Icon name="arrow-left" size={24} /> : k}
                    </button>
                  )
                )}
              </div>
              <p className="muted p0" style={{ textAlign: "center", fontSize: 14 }}>
                Forgot your PIN? <Link href="/parent/setup" className="strong">Get an SMS code</Link> on +91 98xxxxxx21
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
