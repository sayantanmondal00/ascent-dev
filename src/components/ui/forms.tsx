"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Icon } from "./Icon";
import { cx } from "./primitives";

export function TextField({ label, hint, error, prefix, value, onChange, placeholder, type = "text", inputMode, autoComplete, id: idProp, name, defaultValue }: {
  name?: string; defaultValue?: string; label: string; hint?: string; error?: string; prefix?: string; value?: string; onChange?: (e: ChangeEvent<HTMLInputElement>) => void; placeholder?: string;
  type?: string; inputMode?: "text" | "numeric" | "tel" | "search" | "email" | "decimal"; autoComplete?: string; id?: string;
}) {
  const gen = useId();
  const id = idProp ?? gen;
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className="as-field">
      <label htmlFor={id} className="as-field-label">{label}</label>
      {hint && <p id={`${id}-hint`} className="as-field-hint">{hint}</p>}
      <div className={cx("as-input-wrap", error && "has-error")}>
        {prefix && <span className="as-input-prefix">{prefix}</span>}
        <input id={id} name={name} defaultValue={defaultValue} className="as-input" type={type} inputMode={inputMode} autoComplete={autoComplete} value={value} placeholder={placeholder} onChange={onChange} aria-invalid={error ? true : undefined} aria-describedby={describedBy} />
      </div>
      {error && (
        <p id={`${id}-err`} className="as-field-error">
          <Icon name="cross" size={14} />
          {error}
        </p>
      )}
    </div>
  );
}

export function OTPInput({ value, onChange, length = 6, label = "Enter the 6-digit code", error, hint }: { value: string; onChange: (v: string) => void; length?: number; label?: string; error?: string; hint?: ReactNode }) {
  const id = useId();
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const v = value.slice(0, length);
  function setAt(i: number, ch: string) {
    const arr = v.split("");
    while (arr.length < length) arr.push("");
    arr[i] = ch;
    onChange(arr.join("").replace(/\s/g, ""));
  }
  return (
    <div className="as-otp" role="group" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className="as-field-label">{label}</span>
      <div className={cx("as-otp-boxes", error && "has-error")}>
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            className="as-otp-box"
            inputMode="numeric"
            maxLength={1}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${i + 1} of ${length}`}
            value={v[i] ?? ""}
            aria-invalid={error ? true : undefined}
            onChange={(e) => {
              const d = e.target.value.replace(/\D/g, "");
              if (d.length > 1) {
                onChange(d.slice(0, length));
                refs.current[Math.min(d.length, length) - 1]?.focus();
                return;
              }
              setAt(i, d);
              if (d) refs.current[i + 1]?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !v[i]) refs.current[i - 1]?.focus();
            }}
          />
        ))}
      </div>
      {error && (
        <p className="as-field-error">
          <Icon name="cross" size={14} />
          {error}
        </p>
      )}
      {hint && <p className="as-field-hint">{hint}</p>}
    </div>
  );
}

export function SegmentedControl<T extends string>({ options, value, onChange, label }: { options: { id: T; label: ReactNode }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="as-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" className={cx("as-seg-btn", o.id === value && "is-on")} aria-pressed={o.id === value} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: ReactNode }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className={cx("as-toggle", checked && "is-on")} onClick={() => onChange(!checked)}>
      <span className="as-toggle-text">
        <span className="as-toggle-label">{label}</span>
        {description && <span className="as-toggle-desc">{description}</span>}
      </span>
      <span className="as-toggle-track" aria-hidden>
        <span className="as-toggle-knob" />
      </span>
    </button>
  );
}

export function BottomSheet({ open, onClose, title, children, actions }: { open: boolean; onClose: () => void; title: string; children?: ReactNode; actions?: ReactNode }) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("button, a, input, textarea")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="as-sheet-scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={panel} className="as-sheet" role="dialog" aria-modal="true" aria-labelledby={`${id}-t`}>
        <div className="as-sheet-handle" aria-hidden />
        <h2 id={`${id}-t`} className="as-sheet-title">{title}</h2>
        {children && <div className="as-sheet-body">{children}</div>}
        {actions && <div className="as-sheet-actions">{actions}</div>}
      </div>
    </div>
  );
}

export function Toast({ message, tone = "neutral", action }: { message: string; tone?: "neutral" | "success" | "danger" | "offline"; action?: { label: string; onClick: () => void } }) {
  const icon = tone === "success" ? "check-circle" : tone === "danger" ? "cross" : tone === "offline" ? "wifi-off" : null;
  return (
    <div className="as-toast-host">
      <div className="as-toast" role="status">
        {icon && <Icon name={icon} size={20} />}
        <span className="as-toast-msg">{message}</span>
        {action && (
          <button type="button" className="as-toast-action" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

/* Password field with a show/hide button. */
export function PasswordField({ label, name, value, onChange, error, hint, autoComplete = "current-password", id: idProp }: {
  label: string; name?: string; value?: string; onChange?: (e: ChangeEvent<HTMLInputElement>) => void; error?: string; hint?: string; autoComplete?: string; id?: string;
}) {
  const gen = useId();
  const id = idProp ?? gen;
  const [show, setShow] = useState(false);
  return (
    <div className="as-field">
      <label htmlFor={id} className="as-field-label">{label}</label>
      {hint && <p id={`${id}-hint`} className="as-field-hint">{hint}</p>}
      <div className={cx("as-input-wrap", error && "has-error")} style={{ paddingRight: 4 }}>
        <input id={id} name={name} className="as-input" type={show ? "text" : "password"} autoComplete={autoComplete} value={value} onChange={onChange} aria-invalid={error ? true : undefined} aria-describedby={[hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined} />
        <button type="button" className="icon-btn plain" aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} onClick={() => setShow(!show)}>
          <Icon name={show ? "eye-off" : "eye"} size={20} />
        </button>
      </div>
      {error && (
        <p id={`${id}-err`} className="as-field-error">
          <Icon name="cross" size={14} />
          {error}
        </p>
      )}
    </div>
  );
}
