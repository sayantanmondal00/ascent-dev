"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button, Logo, cx } from "@/components/ui/primitives";
import { PasswordField, SegmentedControl, TextField } from "@/components/ui/forms";
import { checkNewAccount, finishSignup } from "@/app/auth-actions";
import { passwordProblem, usernameProblem } from "@/lib/auth/rules";

/* P2–P3 · Parent sign-up in 4 steps: verify phone, permission (consent), add your child, first plan.
   The first plan's daily time is optional; skipping it starts the child at 30 XP a day. */
function SetupInner() {
  const sp = useSearchParams();
  const [step, setStep] = useState(Math.min(4, Math.max(1, Number(sp.get("step") ?? 1))));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [agree, setAgree] = useState(false);
  const [kid, setKid] = useState<"link" | "new">("link");
  const [linkCode, setLinkCode] = useState("KQ7-M2P");
  const [cls, setCls] = useState<"9" | "10">("10");
  const [mins, setMins] = useState<number | null>(null);
  const [shared, setShared] = useState(true);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const names = ["Your login", "Permission", "Add your child", "First plan"];
  const child = "Iba";

  async function next() {
    setErr("");
    if (step === 1) {
      const u = username.trim().toLowerCase();
      const problem = usernameProblem(u) ?? passwordProblem(password);
      if (problem) return setErr(problem);
      setBusy(true);
      const res = await checkNewAccount(u, password);
      setBusy(false);
      if (res.error) return setErr(res.error);
    }
    if (step === 2 && !agree) return;
    if (step === 4) {
      if (shared && !/^\d{4}$/.test(pin)) return setErr("Choose a 4-digit PIN.");
      setBusy(true);
      return finishSignup(username, "parent");
    }
    setStep(step + 1);
    window.scrollTo({ top: 0 });
  }

  const blocked = step === 2 && !agree;
  const label = busy ? "Checking…" : step === 1 ? "Continue" : step === 2 ? (agree ? "I agree" : "Tick the box to agree") : step === 3 ? `Add ${child}` : "Start";

  return (
    <div className="app">
      <div className="onboard">
        <main className="onboard-in" style={{ gap: 18 }}>
          <div className="row" style={{ gap: 10 }}>
            <Logo size={36} />
            <span className="steps-label" style={{ marginLeft: "auto" }}>Parent sign-up</span>
          </div>
          <div className="stack-2">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6 }}>
              {[1, 2, 3, 4].map((i) => (
                <span key={i} style={{ height: 6, borderRadius: 3, background: i <= step ? "var(--pine)" : "var(--line)" }} />
              ))}
            </div>
            <span className="small muted">Step {step} of 4 · {names[step - 1]}</span>
          </div>

          {step === 1 && (
            <>
              <h1 className="title-1" style={{ fontSize: 28 }}>Your parent login</h1>
              <p className="muted p0" style={{ lineHeight: 1.45 }}>Make your own username and password, not {child}&apos;s. You&apos;ll use them to sign in to the parent area.</p>
              <TextField label="Username" autoComplete="username" value={username} onChange={(e) => { setUsername(e.target.value.toLowerCase().replace(/\s/g, "")); setErr(""); }} hint="3 to 20 letters, numbers, dots or underscores." />
              <PasswordField label="Password" autoComplete="new-password" value={password} onChange={(e) => { setPassword(e.target.value); setErr(""); }} hint="At least 8 characters, with a letter and a number." />
              <p className="note">Already have a parent login? <Link href="/login?as=parent" className="strong">Sign in</Link></p>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="title-1" style={{ fontSize: 28 }}>Your permission for {child}&apos;s account</h1>
              <p className="muted p0" style={{ lineHeight: 1.45 }}>{child} is under 18, so India&apos;s data protection law needs a parent or guardian to agree before Ascent keeps any of {child}&apos;s data.</p>
              <div className="panel" style={{ gap: 8, padding: 14, borderRadius: 16 }}>
                <div className="row strong" style={{ gap: 8, fontSize: 15 }}><Icon name="book" size={18} />What Ascent keeps</div>
                <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4, fontSize: 14, lineHeight: 1.4 }}>
                  <li>{child}&apos;s name, class and school</li>
                  <li>Study time, quiz scores and flashcard progress</li>
                  <li>Doubts {child} asks, so they can be answered</li>
                </ul>
              </div>
              <div className="panel panel-pine" style={{ gap: 8, padding: 14, borderRadius: 16 }}>
                <div className="row strong" style={{ gap: 8, fontSize: 15, color: "var(--pine-ink)" }}><Icon name="shield" size={18} />What Ascent never does</div>
                <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4, fontSize: 14, lineHeight: 1.4 }}>
                  <li>Show ads to {child}</li>
                  <li>Sell or share {child}’s data</li>
                  <li>Track {child} outside Ascent</li>
                  <li>Let strangers message {child}</li>
                </ul>
              </div>
              <div className="panel panel-sunken" style={{ gap: 8, padding: 14, borderRadius: 16 }}>
                <div className="row strong" style={{ gap: 8, fontSize: 15 }}><Icon name="user" size={18} />What you can do, any time</div>
                <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4, fontSize: 14, lineHeight: 1.4 }}>
                  <li>See {child}&apos;s progress and scores</li>
                  <li>Download or delete {child}&apos;s data</li>
                  <li>Withdraw your permission</li>
                </ul>
              </div>
              <label className={cx("choice", agree && "is-on")} style={{ alignItems: "flex-start" }}>
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ width: 24, height: 24, margin: 0, accentColor: "var(--pine)", flex: "none" }} />
                <span style={{ fontSize: 15, lineHeight: 1.4 }}>
                  I am {child}&apos;s parent or legal guardian, and I agree to Ascent keeping {child}&apos;s data as described. <Link href="/privacy" className="strong">Full privacy notice</Link>
                </span>
              </label>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="title-1" style={{ fontSize: 28 }}>Add your child</h1>
              <div role="radiogroup" aria-label="Does your child already use Ascent?" className="stack-2">
                {([["link", `${child} already uses Ascent`, `Link with a code from ${child}’s app`], ["new", "Create a new profile", `${child} will sign in with a code you share`]] as const).map(([id, title, sub]) => (
                  <button key={id} type="button" role="radio" aria-checked={kid === id} className={cx("choice", kid === id && "is-on")} onClick={() => setKid(id)}>
                    <span className="grow">
                      <span className="title-3" style={{ display: "block" }}>{title}</span>
                      <span className="muted" style={{ display: "block", fontSize: 14 }}>{sub}</span>
                    </span>
                  </button>
                ))}
              </div>
              {kid === "link" ? (
                <>
                  <TextField label={`Link code from ${child}'s app`} hint={`${child} finds it in Me → Family. It works for 24 hours.`} value={linkCode} onChange={(e) => setLinkCode(e.target.value.toUpperCase())} />
                  {linkCode.replace(/\W/g, "").length === 6 && (
                    <div className="row panel-pine" style={{ padding: 12, borderRadius: 14 }}>
                      <span className="avatar" style={{ width: 40, height: 40 }} aria-hidden>{child[0]}</span>
                      <div>
                        <div className="strong">{child} · Class 10 B</div>
                        <div className="small" style={{ color: "var(--pine-ink)" }}>St Mary&apos;s School, Shillong · found</div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <TextField label="Child's first name" value={child} />
                  <div className="as-field">
                    <span className="as-field-label">Class</span>
                    <SegmentedControl label="Class" value={cls} onChange={setCls} options={[{ id: "9", label: "Class 9" }, { id: "10", label: "Class 10" }]} />
                  </div>
                  <TextField label="School" placeholder="Start typing the school's name" />
                </>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <h1 className="title-1" style={{ fontSize: 28 }}>{child}&apos;s first plan</h1>
              <p className="muted p0">You can change this any time, and {child} can ask you to.</p>
              <div className="as-field">
                <span className="as-field-label">Daily study time <span className="muted" style={{ fontWeight: 500 }}>(optional)</span></span>
                <div role="radiogroup" aria-label="Daily study time" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6 }}>
                  {[30, 40, 50, 60].map((m) => (
                    <button key={m} type="button" role="radio" aria-checked={mins === m} className={cx("as-chip", "as-chip--button", mins === m && "is-pressed")} style={{ borderRadius: 12, height: 50, justifyContent: "center" }} onClick={() => setMins(mins === m ? null : m)}>
                      {m} min
                    </button>
                  ))}
                </div>
                <p className="as-field-hint">{mins ? `${child} will see about ${Math.round(mins * 1.5)} XP a day.` : `Skip this and ${child} starts at 30 XP a day (about 20 minutes). You can set it later in Plan.`}</p>
              </div>
              <div className="as-field">
                <span className="as-field-label">Will {child} use this phone too?</span>
                <div role="radiogroup" className="stack-2">
                  {([[true, "Yes, we share this phone", "Protect the parent area with a PIN"], [false, `No, ${child} has a phone`, `${child} signs in there with the link code`]] as const).map(([v, title, sub]) => (
                    <button key={String(v)} type="button" role="radio" aria-checked={shared === v} className={cx("choice", shared === v && "is-on")} onClick={() => setShared(v)} style={{ minHeight: 56 }}>
                      <span className="grow">
                        <span className="title-3" style={{ display: "block", fontSize: 15 }}>{title}</span>
                        <span className="small muted" style={{ display: "block" }}>{sub}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {shared && (
                <div className="as-field" style={{ maxWidth: 220 }}>
                  <label htmlFor="pin" className="as-field-label">Choose a 4-digit parent PIN</label>
                  <div className="as-input-wrap">
                    <input id="pin" className="as-input" type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setErr(""); }} style={{ letterSpacing: 8 }} />
                  </div>
                  <p className="as-field-hint" style={{ maxWidth: 320 }}>{child} opens Ascent straight away. The parent area asks for this PIN.</p>
                </div>
              )}
            </>
          )}
          {err && <p className="as-field-error" role="alert">{err}</p>}
        </main>
        <div className="foot">
          <div className="foot-in" style={{ maxWidth: 560 }}>
            {step > 1 && (
              <Button variant="secondary" size="lg" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button size="lg" className="cta" disabled={blocked || busy} onClick={next}>
              {label}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParentSetupPage() {
  return (
    <Suspense>
      <SetupInner />
    </Suspense>
  );
}
