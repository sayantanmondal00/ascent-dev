"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState, useState } from "react";
import { Button } from "@/components/ui/primitives";
import { PasswordField, SegmentedControl, TextField } from "@/components/ui/forms";
import { OnboardHeader, OnboardPage } from "@/components/onboarding/parts";
import { login, type LoginState } from "@/app/auth-actions";

function LoginInner() {
  const sp = useSearchParams();
  const [as, setAs] = useState<"student" | "parent">(sp.get("as") === "parent" ? "parent" : "student");
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} noValidate>
      <OnboardPage
        footer={
          <>
            <Button type="submit" size="lg" block disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
            <p className="p0 muted" style={{ textAlign: "center", fontSize: 14 }}>
              New to Ascent?{" "}
              <Link href={as === "parent" ? "/parent/setup" : "/signup"} className="strong">
                {as === "parent" ? "Set up the parent area" : "Sign up"}
              </Link>
            </p>
          </>
        }
      >
        <OnboardHeader back="/" />
        <div className="stack-2">
          <h1 className="title-1" style={{ fontSize: 28 }}>Sign in</h1>
          <p className="muted p0">Use the username and password you made when you signed up.</p>
        </div>
        <div className="as-field">
          <span className="as-field-label">I&apos;m a</span>
          <SegmentedControl label="Who is signing in" value={as} onChange={setAs} options={[{ id: "student", label: "Student" }, { id: "parent", label: "Parent" }]} />
        </div>
        <input type="hidden" name="as" value={as} />
        <input type="hidden" name="next" value={sp.get("next") ?? ""} />
        <TextField label="Username" name="username" autoComplete="username" defaultValue={state.username} />
        <PasswordField label="Password" name="password" />
        {state.error && (
          <p className="as-field-error" role="alert">
            {state.error}
          </p>
        )}
        <p className="note">
          Forgot your password? {as === "student" ? "Ask your parent to reset it from the parent area." : "Reset it with the code from your consent SMS (coming soon)."}
        </p>
      </OnboardPage>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
