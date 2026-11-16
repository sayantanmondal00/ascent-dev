"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button, cx } from "@/components/ui/primitives";
import { cheers, request } from "@/lib/data/parent";

export function RequestCard({ child }: { child: string }) {
  const [state, setState] = useState<"open" | "yes" | "no">("open");
  return (
    <section aria-labelledby="req-h" className="panel" style={{ borderRadius: 20, order: -1 }}>
      <div className="row" style={{ gap: 10 }}>
        <span className="ico"><Icon name="message" size={20} /></span>
        <div className="grow">
          <div id="req-h" className="title-3" style={{ fontSize: 15 }}>Request from {child}</div>
          <div className="small muted">{request.ago}</div>
        </div>
      </div>
      <p className="p0" style={{ lineHeight: 1.45 }}>
        {request.ask} <strong>{request.detail}</strong> {request.instead}
      </p>
      <p className="p0 muted" style={{ fontSize: 14, lineHeight: 1.45, paddingLeft: 12, borderLeft: "3px solid var(--line)" }}>&ldquo;{request.reason}&rdquo;</p>
      {state === "open" ? (
        <div className="row-wrap">
          <Button className="grow" onClick={() => setState("yes")}>Approve</Button>
          <Button variant="secondary" className="grow" onClick={() => setState("no")}>Not this time</Button>
        </div>
      ) : (
        <p role="status" className="row p0 panel-pine strong" style={{ gap: 8, padding: "10px 12px", borderRadius: 12, color: "var(--pine-ink)", fontSize: 14 }}>
          <Icon name="check" size={18} strokeWidth={2.4} />
          {state === "yes" ? `Approved. Sunday is now 20 minutes and ${child} has been told.` : `${child} has been told. You can talk about it at home.`}
        </p>
      )}
      <Link href="/parent/messages" className="text-link" style={{ minHeight: 32 }}>Offer a middle option or reply</Link>
    </section>
  );
}

export function Encourage({ child }: { child: string }) {
  const [sent, setSent] = useState(-1);
  return (
    <section className="panel" style={{ borderRadius: 20 }}>
      <div className="row" style={{ gap: 10 }}>
        <span className="ico ico-gold"><Icon name="heart" size={20} /></span>
        <h2 className="title-2" style={{ fontSize: 19 }}>Encourage {child}</h2>
      </div>
      <p className="p0 muted" style={{ fontSize: 14 }}>A short note shows on {child}&apos;s Today screen.</p>
      <div className="row-wrap">
        {cheers.map((c, i) => (
          <button key={c} type="button" aria-pressed={sent === i} className={cx("as-chip", "as-chip--button", sent === i && "is-pressed")} onClick={() => setSent(i)}>
            {sent === i ? `Sent: ${c}` : c}
          </button>
        ))}
        <Link href="/parent/messages" className="as-chip as-chip--button" style={{ borderStyle: "dashed", color: "var(--pine)" }}>Write your own</Link>
      </div>
      {sent >= 0 && <p role="status" className="p0 strong" style={{ fontSize: 14, color: "var(--pine-ink)" }}>Sent. {child} will see it next time Ascent opens.</p>}
      <div className="stack-2 panel-gold" style={{ padding: 12, borderRadius: 14 }}>
        <div className="row label" style={{ gap: 8, color: "var(--gold-ink)", fontSize: 13 }}><Icon name="gift" size={16} />Reward you set</div>
        <div className="title-3" style={{ fontSize: 15 }}>Finish Electricity → new cricket bat</div>
        <div className="as-bar as-bar--gold" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} aria-label="Reward progress"><div className="as-bar-fill" style={{ width: "40%" }} /></div>
        <div className="small muted">2 of 5 topics mastered</div>
      </div>
      <Link href="/parent/messages" className="text-link" style={{ minHeight: 32 }}>Messages and rewards</Link>
    </section>
  );
}
