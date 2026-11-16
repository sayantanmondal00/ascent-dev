"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { OnboardHeader, OnboardPage, maskPhone } from "@/components/onboarding/parts";
import { DEMO_TOPIC_ID, FIRST_TOPIC_ID } from "@/lib/data/content";

/* D5 · Waiting for a parent (link route). Demo scores stay on this phone until a parent agrees. */
export default function WaitingPage() {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  useEffect(() => {
    try {
      setPhone(sessionStorage.getItem("ascent-parent-phone") ?? "");
    } catch {}
  }, []);
  const rows = [
    { title: "Ohm’s law and resistance", sub: "Physics · done · 7/10", done: true, href: `/topic/${DEMO_TOPIC_ID}?demo=1&step=watch` },
    { title: "Real numbers: Euclid’s division", sub: "Maths · 10 min", done: false, href: `/topic/${FIRST_TOPIC_ID}?demo=1&step=watch` },
    { title: "Types of chemical reactions", sub: "Chemistry · 12 min", done: false, href: `/topic/che-reactions--types-of-chemical-reactions?demo=1&step=watch` },
  ];
  return (
    <OnboardPage>
      <OnboardHeader />
      <section className="panel" style={{ borderRadius: 20, padding: 18 }}>
        <div className="row">
          <span className="ico ico-gold" style={{ borderRadius: "50%", width: 44, height: 44 }}><Icon name="clock" size={22} /></span>
          <div>
            <h1 className="title-2" style={{ fontSize: 22 }}>Waiting for your parent</h1>
            <p className="muted p0" style={{ fontSize: 14, marginTop: 2 }}>Link sent to {maskPhone(phone)} · {sent ? "just now" : "12 min ago"}</p>
          </div>
        </div>
        <p className="p0" style={{ fontSize: 14, lineHeight: 1.45 }}>Ask them to open the SMS from &ldquo;ASCENT&rdquo;. We&apos;ll remind them in an hour and again tomorrow.</p>
        <div className="row-wrap">
          <button type="button" className="as-btn as-btn--secondary" style={{ flex: "1 1 140px" }} onClick={() => setSent(true)}>{sent ? "Sent again" : "Send again"}</button>
          <Link href="/signup/parent" className="as-btn as-btn--secondary" style={{ flex: "1 1 140px" }}>Change number</Link>
        </div>
        <Link href="/signup/consent" className="text-link">My parent is here now</Link>
      </section>
      <section className="stack-2" style={{ gap: 10 }}>
        <div>
          <h2 className="title-2" style={{ fontSize: 19 }}>While you wait</h2>
          <p className="muted p0" style={{ fontSize: 14, marginTop: 2 }}>Try two more topics. Your scores stay on this phone and move to your account once your parent agrees.</p>
        </div>
        {rows.map((r) => (
          <Link key={r.title} href={r.href} className="choice" style={{ minHeight: 60, padding: "8px 12px", borderColor: "var(--line)" }}>
            <span className="num-dot" style={{ width: 32, height: 32, background: r.done ? "var(--pine)" : "var(--sunken)", color: r.done ? "var(--on-pine)" : "var(--ink)" }}>
              <Icon name={r.done ? "check" : "play"} size={r.done ? 16 : 14} strokeWidth={r.done ? 3 : 2} />
            </span>
            <span className="grow">
              <span className="title-3" style={{ display: "block", fontSize: 15 }}>{r.title}</span>
              <span className="small muted" style={{ display: "block" }}>{r.sub}</span>
            </span>
            <Icon name="chevron-right" size={18} />
          </Link>
        ))}
      </section>
    </OnboardPage>
  );
}
