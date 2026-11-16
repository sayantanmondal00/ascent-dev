"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button, cx } from "@/components/ui/primitives";
import { PasswordField, TextField } from "@/components/ui/forms";
import { OnboardHeader, OnboardPage } from "@/components/onboarding/parts";
import { checkNewAccount } from "@/app/auth-actions";
import { passwordProblem, usernameProblem } from "@/lib/auth/rules";

/* D4 · Parent agrees on this phone and makes their own parent login. The daily goal is optional;
   skipping it starts at 30 XP a day. */
export default function ParentConsentPage() {
  const router = useRouter();
  const child = "Iba";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mins, setMins] = useState<number | null>(null);
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState<{ u?: string; p?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);

  async function next() {
    if (!agree) return;
    const u = username.trim().toLowerCase();
    const e = { u: usernameProblem(u) ?? undefined, p: passwordProblem(password) ?? undefined };
    setErr(e);
    if (e.u || e.p) return;
    setBusy(true);
    const res = await checkNewAccount(u, password);
    setBusy(false);
    if (res.error) return setErr({ form: res.error });
    try {
      sessionStorage.setItem("ascent-goal-minutes", String(mins ?? 20));
    } catch {}
    router.push("/signup/about");
  }

  return (
    <OnboardPage
      footer={
        <Button size="lg" block disabled={!agree || busy} onClick={next}>
          {busy ? "Checking…" : agree ? "Agree and continue" : "Tick the box to agree"}
        </Button>
      }
    >
      <OnboardHeader back="/signup/parent" step="Step 2 of 3" />
      <span className="pill gold" style={{ alignSelf: "flex-start" }}>For {child}&apos;s parent or guardian</span>
      <h1 className="title-1" style={{ fontSize: 26 }}>Do you agree to {child} using Ascent?</h1>
      <div className="panel" style={{ gap: 6, padding: "12px 14px", borderRadius: 14 }}>
        <div className="row strong" style={{ gap: 8, fontSize: 15 }}><Icon name="book" size={18} />What Ascent keeps</div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.45 }}>
          <li>{child}&apos;s name, class and school</li>
          <li>Study time, quiz scores and flashcard progress</li>
        </ul>
      </div>
      <div className="panel panel-pine" style={{ gap: 6, padding: "12px 14px", borderRadius: 14 }}>
        <div className="row strong" style={{ gap: 8, fontSize: 15, color: "var(--pine-ink)" }}><Icon name="shield" size={18} />What Ascent never does</div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.45 }}>
          <li>Show ads, sell data, or track {child} outside Ascent</li>
        </ul>
      </div>
      <p className="muted p0" style={{ fontSize: 14 }}>
        You can see {child}&apos;s progress, change the plan, or delete everything at any time. <Link href="/privacy" className="strong">Full privacy notice</Link>
      </p>
      <div className="stack-3">
        <div>
          <h2 className="title-3">Your parent login</h2>
          <p className="note" style={{ marginTop: 2 }}>You&apos;ll use this to open the parent area. Keep it different from {child}&apos;s.</p>
        </div>
        <TextField label="Your username" autoComplete="username" value={username} onChange={(e) => { setUsername(e.target.value.toLowerCase().replace(/\s/g, "")); setErr({}); }} error={err.u} />
        <PasswordField label="Your password" hint="At least 8 characters, with a letter and a number." autoComplete="new-password" value={password} onChange={(e) => { setPassword(e.target.value); setErr({}); }} error={err.p} />
        {err.form && <p className="as-field-error" role="alert">{err.form}</p>}
      </div>
      <div className="as-field">
        <span className="as-field-label">
          {child}&apos;s daily goal <span className="muted" style={{ fontWeight: 500 }}>(optional)</span>
        </span>
        <div role="radiogroup" aria-label="Daily study time" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6 }}>
          {[20, 30, 40, 60].map((m) => (
            <button key={m} type="button" role="radio" aria-checked={mins === m} className={cx("as-chip", "as-chip--button", mins === m && "is-pressed")} style={{ borderRadius: 12, height: 50, justifyContent: "center" }} onClick={() => setMins(mins === m ? null : m)}>
              {m} min
            </button>
          ))}
        </div>
        <p className="as-field-hint">{mins ? `${child} will see about ${Math.round(mins * 1.5)} XP a day. You can change it any time.` : `Skip this and ${child} starts at 30 XP a day (about 20 minutes). You can set it later.`}</p>
      </div>
      <label className={cx("choice", agree && "is-on")} style={{ alignItems: "flex-start", cursor: "pointer" }}>
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ width: 24, height: 24, margin: 0, accentColor: "var(--pine)", flex: "none" }} />
        <span style={{ fontSize: 15, lineHeight: 1.4 }}>I am {child}&apos;s parent or legal guardian, and I agree.</span>
      </label>
    </OnboardPage>
  );
}
