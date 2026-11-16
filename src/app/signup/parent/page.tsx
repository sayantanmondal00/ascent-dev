"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, cx } from "@/components/ui/primitives";
import { OnboardHeader, OnboardPage, PhoneField } from "@/components/onboarding/parts";

/* D3 · Ask a parent to agree (step 2 of 3). */
export default function AskParentPage() {
  const router = useRouter();
  const [way, setWay] = useState<"here" | "link">("here");
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");
  function next() {
    if (way === "here") return router.push("/signup/consent");
    if (phone.replace(/\D/g, "").length !== 10) return setErr("Enter your parent's 10-digit mobile number.");
    try {
      sessionStorage.setItem("ascent-parent-phone", phone);
    } catch {}
    router.push("/signup/waiting");
  }
  return (
    <OnboardPage footer={<Button size="lg" block onClick={next}>{way === "here" ? "Hand the phone to my parent" : "Send the link"}</Button>}>
      <OnboardHeader back="/signup" step="Step 2 of 3" />
      <div className="stack-2">
        <h1 className="title-1" style={{ fontSize: 28 }}>Now your parent needs to agree</h1>
        <p className="muted p0" style={{ lineHeight: 1.5 }}>You&apos;re under 18, so the law needs a parent or guardian to say yes before Ascent saves your progress. It takes them about 2 minutes.</p>
      </div>
      <div role="radiogroup" aria-label="How will your parent agree" className="stack-2" style={{ gap: 10 }}>
        {([["here", "My parent is here", "Hand them this phone"], ["link", "Send my parent a link", "They agree on their own phone"]] as const).map(([id, title, sub]) => (
          <button key={id} type="button" role="radio" aria-checked={way === id} className={cx("choice", way === id && "is-on")} onClick={() => setWay(id)}>
            <span className="grow">
              <span className="title-3" style={{ display: "block" }}>{title}</span>
              <span className="muted" style={{ display: "block", fontSize: 14 }}>{sub}</span>
            </span>
          </button>
        ))}
      </div>
      {way === "link" && (
        <>
          <PhoneField id="pphone" label="Your parent's mobile number" value={phone} onChange={(v) => { setPhone(v); setErr(""); }} note={<>They get an SMS from &ldquo;ASCENT&rdquo; with your name and a link.</>} />
          {err && <p className="as-field-error" role="alert">{err}</p>}
        </>
      )}
    </OnboardPage>
  );
}
