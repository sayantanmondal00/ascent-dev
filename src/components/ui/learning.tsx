"use client";

import Link from "next/link";
import katex from "katex";
import { useState, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { Button, Chip, cx } from "./primitives";
import type { Formula } from "@/lib/types";

/* ---------- MathText (KaTeX → MathML) ---------- */
export function MathText({ tex, fallback, display, className }: { tex: string; fallback?: string; display?: boolean; className?: string }) {
  let html = "";
  try {
    html = katex.renderToString(tex, { output: "mathml", displayMode: !!display, throwOnError: false });
  } catch {
    html = "";
  }
  const Tag = display ? "div" : "span";
  if (html) return <Tag className={cx("as-math", display && "as-math--display", className)} dangerouslySetInnerHTML={{ __html: html }} />;
  return <Tag className={cx("as-math", "as-math--plain", display && "as-math--display", className)}>{fallback ?? tex}</Tag>;
}

/* ---------- FormulaCard (the one inverse panel) ---------- */
export function FormulaCard({ formula, chapter }: { formula: Formula; chapter?: string }) {
  return (
    <section className="as-formula" aria-label={`Formula: ${formula.name}`}>
      <div className="as-formula-head">
        <span>{formula.name}</span>
        {chapter && <span>{chapter}</span>}
      </div>
      <MathText tex={formula.tex} fallback={formula.fallback} display className="as-formula-math" />
      <dl className="as-formula-legend">
        {formula.legend.map((l, i) => (
          <div key={i}>
            <dt>{l.symbol}</dt>
            <dd>
              {l.meaning}
              {l.unit ? ` (${l.unit})` : ""}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------- AnswerOption ---------- */
export type AnswerState = "idle" | "selected" | "correct" | "wrong";
export function AnswerOption({ letter, state = "idle", onClick, disabled, children }: { letter: string; state?: AnswerState; onClick?: () => void; disabled?: boolean; children: ReactNode }) {
  const tag = state === "correct" ? "Correct" : state === "wrong" ? "Your answer" : "";
  return (
    <button type="button" role="radio" className={cx("as-answer", `as-answer--${state}`)} aria-checked={state === "selected" || state === "wrong"} onClick={onClick} disabled={disabled}>
      <span className="as-answer-key">{state === "correct" ? <Icon name="check" size={16} /> : state === "wrong" ? <Icon name="cross" size={16} /> : letter}</span>
      <span className="as-answer-label">{children}</span>
      {tag && <span className="as-answer-tag">{tag}</span>}
    </button>
  );
}

/* ---------- Explanation (why + where it is taught) ---------- */
export function Explanation({ tone = "info", title, links, children }: { tone?: "correct" | "wrong" | "info"; title: ReactNode; links?: { label: string; href: string; icon?: IconName }[]; children?: ReactNode }) {
  const icon: IconName = tone === "correct" ? "check-circle" : tone === "wrong" ? "cross" : "help";
  return (
    <section className={cx("as-explain", `as-explain--${tone}`)} role="status">
      <div className="as-explain-title">
        <Icon name={icon} size={20} />
        {title}
      </div>
      {children && <div className="as-explain-body">{children}</div>}
      {links && links.length > 0 && (
        <div className="as-explain-links">
          {links.map((l, i) => (
            <Link key={i} href={l.href} className="as-explain-link">
              {l.icon && <Icon name={l.icon} size={16} />}
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- Flashcard + FSRS rating ---------- */
export type Rating = "again" | "hard" | "good" | "easy";
export function FlashcardRating({ onRate, intervals }: { onRate?: (r: Rating) => void; intervals?: Record<Rating, string> }) {
  const iv = intervals ?? { again: "<1 min", hard: "6 min", good: "1 day", easy: "4 days" };
  const opts: [Rating, string][] = [["again", "Again"], ["hard", "Hard"], ["good", "Good"], ["easy", "Easy"]];
  return (
    <div className="as-rate" role="group" aria-label="How well did you remember?">
      {opts.map(([id, label]) => (
        <button key={id} type="button" className={`as-rate-btn as-rate-btn--${id}`} onClick={() => onRate?.(id)}>
          <span className="as-rate-label">{label}</span>
          <span className="as-rate-when">{iv[id]}</span>
        </button>
      ))}
    </div>
  );
}

export function Flashcard({ front, back, backNote, counter, onRate }: { front: string; back: string; backNote?: string; counter?: string; onRate?: (r: Rating) => void }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="as-flash-wrap">
      {counter && (
        <div className="as-flash-count">
          <span>{counter}</span>
          <span>{flipped ? "Rate how well you knew it" : "Tap the card to flip"}</span>
        </div>
      )}
      <button type="button" className={cx("as-flash", flipped && "is-flipped")} onClick={() => setFlipped(!flipped)} aria-label={flipped ? "Answer side. Tap to see the question." : "Question side. Tap to see the answer."}>
        <span className="as-flash-side">{flipped ? "Answer" : "Question"}</span>
        <span className="as-flash-text">{flipped ? back : front}</span>
        <span className="as-flash-note">{flipped ? backNote : "Recall it, then flip"}</span>
      </button>
      {flipped && (
        <FlashcardRating
          onRate={(r) => {
            setFlipped(false);
            onRate?.(r);
          }}
        />
      )}
    </div>
  );
}

/* ---------- SimFrame: PhET loads only on tap, size shown first, credit always ---------- */
export function SimFrame({ title, sizeMB, src }: { title: string; sizeMB: number; src?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <figure className="as-sim">
      <div className="as-sim-frame">
        {!loaded ? (
          <div className="as-sim-gate">
            <Icon name="flask" size={36} />
            <span className="as-sim-title">{title}</span>
            <span className="as-sim-size">About {sizeMB} MB. Loads only when you tap.</span>
            <span className="as-sim-size">On Wi-Fi? Save this topic offline and the simulation comes too.</span>
            <Button onClick={() => setLoaded(true)}>Load simulation</Button>
          </div>
        ) : src ? (
          <iframe className="as-sim-iframe" src={src} title={title} allowFullScreen />
        ) : (
          <div className="as-sim-gate as-sim-gate--loaded">
            <span className="as-sim-title">{title} runs here</span>
            <span className="as-sim-size">Turn your phone sideways for more room.</span>
          </div>
        )}
      </div>
      <figcaption className="as-sim-credit">Simulation by PhET Interactive Simulations, University of Colorado Boulder, CC BY 4.0</figcaption>
    </figure>
  );
}

/* ---------- VideoPlayer: data-saving, never autoplays ---------- */
export function VideoPlayer({ title, duration, sizeMB, quality = "240p", position, src }: { title: string; duration: string; sizeMB: number; quality?: string; position?: string; src?: string }) {
  const [saved, setSaved] = useState(false);
  const [captions, setCaptions] = useState(false);
  const [q, setQ] = useState(quality);
  const [speed, setSpeed] = useState("1×");
  const [playing, setPlaying] = useState(false);
  return (
    <div className="as-video">
      <div className="as-video-frame">
        {playing && src ? (
          <iframe className="as-video-el" src={src} title={title} allow="encrypted-media; picture-in-picture" allowFullScreen />
        ) : (
          <div className="as-video-poster">
            <button type="button" className="as-video-play" aria-label={`Play ${title}`} onClick={() => setPlaying(true)}>
              <Icon name="play" size={28} />
            </button>
            <span className="as-video-meta">
              {title}
              {position ? ` · ${position}` : ""} · {duration}
            </span>
            <span className="as-video-size">
              {q} · about {q === "144p" ? Math.round(sizeMB / 2) : sizeMB} MB
            </span>
            {playing && !src && <span className="as-video-meta" style={{ top: 12, bottom: "auto" }}>Video file not added yet</span>}
          </div>
        )}
      </div>
      <div className="as-video-controls">
        <Chip onClick={() => setQ(q === "240p" ? "144p" : q === "144p" ? "360p" : "240p")} pressed={false}>
          Quality: {q}
        </Chip>
        <Chip onClick={() => setSpeed(speed === "1×" ? "1.25×" : speed === "1.25×" ? "1.5×" : "1×")} pressed={false}>
          Speed {speed}
        </Chip>
        <Chip icon="download" onClick={() => setSaved(!saved)} pressed={saved}>
          {saved ? "Saved offline" : "Save offline"}
        </Chip>
        <Chip icon="captions" onClick={() => setCaptions(!captions)} pressed={captions}>
          Captions
        </Chip>
      </div>
    </div>
  );
}

/* ---------- NumericAnswer (number + unit, tolerance) ---------- */
export function NumericAnswer({ answer, unit, tolerance = 0, onResult, disabled }: { answer: number; unit?: string; tolerance?: number; onResult: (ok: boolean, value: string) => void; disabled?: boolean }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const [res, setRes] = useState<"correct" | "wrong" | null>(null);
  function check() {
    const t = val.trim();
    if (!t) return setErr("Enter an answer first.");
    const n = Number(t.replace(",", "."));
    if (Number.isNaN(n)) return setErr("Enter a number, like 2 or 0.5.");
    const ok = Math.abs(n - answer) <= tolerance;
    setRes(ok ? "correct" : "wrong");
    onResult(ok, t);
  }
  return (
    <div className="as-numeric">
      <label htmlFor="num-answer" className="as-field-label">
        Your answer
      </label>
      <div className="as-numeric-row">
        <div className={cx("as-input-wrap", err && "has-error", res && `is-${res}`)}>
          <input id="num-answer" className="as-input" inputMode="decimal" autoComplete="off" value={val} disabled={!!res || disabled} aria-invalid={err ? true : undefined} onChange={(e) => { setVal(e.target.value); setErr(""); }} onKeyDown={(e) => e.key === "Enter" && check()} />
          {unit && <span className="as-input-unit">{unit}</span>}
        </div>
        {!res && <Button onClick={check}>Check</Button>}
      </div>
      {err && <p className="as-field-error" role="alert">{err}</p>}
    </div>
  );
}

/* ---------- ShortAnswer (self-marked against the mark scheme) ---------- */
export function ShortAnswer({ model, points, marks, onSelfMark }: { model: string; points: string[]; marks: number; onSelfMark: (m: "all" | "some" | "none") => void }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const [shown, setShown] = useState(false);
  const [mark, setMark] = useState<string | null>(null);
  return (
    <div className="as-short">
      <label htmlFor="short-answer" className="as-field-label">
        Write your answer
      </label>
      <textarea id="short-answer" className="as-input as-textarea" rows={4} value={val} disabled={shown} onChange={(e) => { setVal(e.target.value); setErr(""); }} />
      {err && <p className="as-field-error" role="alert">{err}</p>}
      {!shown && (
        <Button variant="secondary" icon="eye" onClick={() => (val.trim() ? setShown(true) : setErr("Write your answer first, then compare."))}>
          Show model answer
        </Button>
      )}
      {shown && (
        <section className="as-short-model">
          <h3>Model answer · {marks} marks</h3>
          <p>{model}</p>
          <ul>
            {points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
          <div className="as-short-mark" role="group" aria-label="Mark your own answer">
            {([["all", "Got it all"], ["some", "Got some"], ["none", "Missed it"]] as const).map(([id, label]) => (
              <button key={id} type="button" className={cx("as-short-btn", mark === id && "is-on")} aria-pressed={mark === id} onClick={() => { setMark(id); onSelfMark(id); }}>
                {label}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
