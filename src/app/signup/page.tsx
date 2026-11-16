"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button, cx } from "@/components/ui/primitives";
import { OTPInput } from "@/components/ui/forms";
import { OnboardHeader, OnboardPage, PhoneField, maskPhone } from "@/components/onboarding/parts";

/* D2 · Sign up with a phone code (step 1 of 3). Codes are simulated until an SMS provider is connected:
   any 6 digits are accepted. */
function SignupInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const signin = sp.get("signin") === "1";
  const demoScore = sp.get("demo");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [owner, setOwner] = useState<"mine" | "parent">("mine");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [wait, setWait] = useState(30);
  const [called, setCalled] = useState(false);

  useEffect(() => {
    if (step !== "code" || wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [step, wait]);

  function next() {
    setErr("");
    if (step === "phone") {
      if (phone.replace(/\D/g, "").length !== 10) return setErr("Enter a 10-digit mobile number.");
      setStep("code");
      setWait(30);
      return;
    }
    if (code.length !== 6) return setErr("Enter all 6 digits.");
    try {
      sessionStorage.setItem("ascent-signup", JSON.stringify({ phone, owner }));
    } catch {}
    router.push(signin ? "/today" : `/signup/parent${owner === "parent" ? "?owner=parent" : ""}`);
  }

  return (
    <OnboardPage footer={<Button size="lg" block onClick={next}>{step === "phone" ? "Send code" : "Verify"}</Button>}>
      <OnboardHeader back="/" step={signin ? undefined : "Step 1 of 3"} />
      {demoScore && !signin && (
        <div className="row panel-gold" style={{ padding: "12px 14px", borderRadius: 16 }}>
          <span className="title-2 tnum" style={{ color: "var(--gold-ink)", fontSize: 22 }}>{demoScore}/10</span>
          <span style={{ fontSize: 14, lineHeight: 1.4 }}>Nice start on Ohm&apos;s law. Sign up to keep your score and your first XP.</span>
        </div>
      )}
      {step === "phone" ? (
        <>
          <div className="stack-2">
            <h1 className="title-1" style={{ fontSize: 28 }}>{signin ? "Sign in" : "Your phone number"}</h1>
            <p className="muted p0">We&apos;ll send a 6-digit code. No password needed.</p>
          </div>
          <PhoneField id="phone" label="Mobile number" value={phone} onChange={(v) => { setPhone(v); setErr(""); }} />
          {err && <p className="as-field-error" role="alert">{err}</p>}
          {!signin && (
            <div className="as-field">
              <span className="as-field-label">Whose number is this?</span>
              <div role="radiogroup" aria-label="Whose number is this" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {([["mine", "Mine"], ["parent", "My parent’s"]] as const).map(([id, label]) => (
                  <button key={id} type="button" role="radio" aria-checked={owner === id} className={cx("choice", owner === id && "is-on")} style={{ minHeight: 50, justifyContent: "center", fontWeight: 700 }} onClick={() => setOwner(id)}>
                    {label}
                  </button>
                ))}
              </div>
              <p className="as-field-hint">{owner === "mine" ? "No phone of your own? Use a parent’s number." : "Good. Your parent can agree on this phone in the next step."}</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="stack-2">
            <h1 className="title-1" style={{ fontSize: 28 }}>Enter the code</h1>
            <p className="muted p0">
              Sent by {called ? "phone call" : "SMS"} to {maskPhone(phone)}.{" "}
              <button type="button" className="text-link" style={{ minHeight: 0, textDecoration: "underline", fontSize: 15 }} onClick={() => { setStep("phone"); setCode(""); }}>
                Change number
              </button>
            </p>
          </div>
          <OTPInput value={code} onChange={(v) => { setCode(v); setErr(""); }} error={err || undefined} />
          <div className="row-wrap">
            {wait > 0 ? (
              <span className="pill" style={{ background: "var(--sunken)", borderColor: "var(--sunken)", color: "var(--ink-muted)", height: 44 }}>Resend in 0:{String(wait).padStart(2, "0")}</span>
            ) : (
              <button type="button" className="as-chip as-chip--button" onClick={() => setWait(30)}>Resend code</button>
            )}
            <button type="button" className="as-chip as-chip--button" onClick={() => { setCalled(true); setWait(30); }}>Get a call instead</button>
          </div>
          <p className="note">No SMS after 30 seconds? Check the number, or get the code by phone call.</p>
        </>
      )}
    </OnboardPage>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupInner />
    </Suspense>
  );
}
