"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/primitives";
import { PasswordField, TextField } from "@/components/ui/forms";
import { OnboardHeader, OnboardPage } from "@/components/onboarding/parts";
import { checkNewAccount } from "@/app/auth-actions";
import { passwordProblem, usernameProblem } from "@/lib/auth/rules";

/* D2 · Sign up (step 1 of 3): choose a username and password. Nothing is saved until a parent agrees. */
function SignupInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const demoScore = sp.get("demo");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<{ u?: string; p?: string; c?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (sp.get("signin") === "1") router.replace("/login");
  }, [sp, router]);

  async function next() {
    const u = username.trim().toLowerCase();
    const e = { u: usernameProblem(u) ?? undefined, p: passwordProblem(password) ?? undefined, c: confirm !== password ? "The two passwords don't match." : undefined };
    setErr(e);
    if (e.u || e.p || e.c) return;
    setBusy(true);
    const res = await checkNewAccount(u, password);
    setBusy(false);
    if (res.error) return setErr({ form: res.error });
    try {
      sessionStorage.setItem("ascent-signup", JSON.stringify({ username: u }));
    } catch {}
    router.push("/signup/parent");
  }

  return (
    <OnboardPage
      footer={
        <>
          <Button size="lg" block disabled={busy} onClick={next}>{busy ? "Checking…" : "Continue"}</Button>
          <p className="p0 muted" style={{ textAlign: "center", fontSize: 14 }}>
            Already have an account? <Link href="/login" className="strong">Sign in</Link>
          </p>
        </>
      }
    >
      <OnboardHeader back="/" step="Step 1 of 3" />
      {demoScore && (
        <div className="row panel-gold" style={{ padding: "12px 14px", borderRadius: 16 }}>
          <span className="title-2 tnum" style={{ color: "var(--gold-ink)", fontSize: 22 }}>{demoScore}/10</span>
          <span style={{ fontSize: 14, lineHeight: 1.4 }}>Nice start on Ohm&apos;s law. Sign up to keep your score and your first XP.</span>
        </div>
      )}
      <div className="stack-2">
        <h1 className="title-1" style={{ fontSize: 28 }}>Make your account</h1>
        <p className="muted p0">Pick a username and a password you&apos;ll remember. Others never see your password.</p>
      </div>
      <TextField label="Username" hint="3 to 20 letters, numbers, dots or underscores. Your friends never see it." autoComplete="username" value={username} onChange={(e) => { setUsername(e.target.value.toLowerCase().replace(/\s/g, "")); setErr({}); }} error={err.u} />
      <PasswordField label="Password" hint="At least 8 characters, with a letter and a number." autoComplete="new-password" value={password} onChange={(e) => { setPassword(e.target.value); setErr({}); }} error={err.p} />
      <PasswordField label="Type the password again" autoComplete="new-password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setErr({}); }} error={err.c} />
      {err.form && <p className="as-field-error" role="alert">{err.form}</p>}
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
