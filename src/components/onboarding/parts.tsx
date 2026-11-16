import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/primitives";

export function OnboardHeader({ back, step }: { back?: string; step?: string }) {
  return (
    <header className="row" style={{ gap: 10 }}>
      {back && (
        <Link href={back} className="icon-btn" aria-label="Back">
          <Icon name="chevron-left" size={20} />
        </Link>
      )}
      <Logo size={34} />
      {step && (
        <span className="steps-label" style={{ marginLeft: "auto" }}>
          {step}
        </span>
      )}
    </header>
  );
}

/* Full-height onboarding page with a sticky bottom action area (max 520 px wide). */
export function OnboardPage({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="app">
      <div className="onboard">
        <main className="onboard-in" style={{ maxWidth: 520 }}>{children}</main>
        {footer && (
          <div className="foot">
            <div className="foot-in" style={{ maxWidth: 520, flexDirection: "column", alignItems: "stretch" }}>
              {footer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PhoneField({ label, value, onChange, note, id }: { label: string; value: string; onChange: (v: string) => void; note?: ReactNode; id: string }) {
  return (
    <div className="as-field">
      <label htmlFor={id} className="as-field-label">{label}</label>
      <div className="row" style={{ gap: 8 }}>
        <span className="strong" style={{ height: 50, padding: "0 12px", borderRadius: 12, background: "var(--sunken)", display: "grid", placeItems: "center" }}>+91</span>
        <div className="as-input-wrap" style={{ minHeight: 50 }}>
          <input id={id} className="as-input" type="tel" inputMode="numeric" autoComplete="tel-national" value={value} onChange={(e) => onChange(e.target.value.replace(/[^\d ]/g, "").slice(0, 11))} placeholder="98765 43210" />
        </div>
      </div>
      {note && <p className="as-field-hint">{note}</p>}
    </div>
  );
}

export function maskPhone(v: string) {
  const d = v.replace(/\D/g, "");
  if (d.length < 4) return "+91 " + (d || "98xxxxxx21");
  return `+91 ${d.slice(0, 2)}xxxxxx${d.slice(-2)}`;
}
