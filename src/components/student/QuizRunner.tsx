"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Badge, Button } from "@/components/ui/primitives";
import { AnswerOption, Explanation, NumericAnswer, ShortAnswer, type AnswerState } from "@/components/ui/learning";
import type { Question, Topic } from "@/lib/types";

export type QuizResult = { topicId: string; score: number; total: number; hintsUsed: number; mistakes: { n: number; type: string; prompt: string; yours: string; right: string; fix: { label: string; href: string } }[] };

const TYPE_LABEL: Record<Question["type"], string> = { mcq: "MCQ", numeric: "Numerical", short: "Short answer" };
const LETTERS = ["A", "B", "C", "D", "E"];

export function QuizRunner({ topic, backHref, flow }: { topic: Topic; backHref: string; flow?: "demo" | "first" }) {
  const router = useRouter();
  const qs = topic.quiz;
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [checked, setChecked] = useState<null | boolean>(null);
  const [yours, setYours] = useState("");
  const [error, setError] = useState(false);
  const [hint, setHint] = useState(false);
  const [more, setMore] = useState(false);
  const [flagged, setFlagged] = useState<string | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [mistakes, setMistakes] = useState<QuizResult["mistakes"]>([]);
  const [hints, setHints] = useState(0);
  const q = qs[i];
  const xp = results.filter(Boolean).length * 2 - hints;

  function record(ok: boolean, answerText: string) {
    setChecked(ok);
    setYours(answerText);
    setResults((r) => [...r, ok]);
    if (!ok) {
      const right = q.type === "mcq" ? q.options[q.answer] : q.type === "numeric" ? `${q.answer}${q.unit ? " " + q.unit : ""}` : "See the model answer";
      setMistakes((m) => [...m, { n: i + 1, type: TYPE_LABEL[q.type], prompt: q.prompt, yours: answerText, right, fix: q.links[0] ? { label: q.links[0].label, href: `/topic/${topic.id}${q.links[0].href}` } : { label: "Open the notes", href: `/topic/${topic.id}?step=read` } }]);
    }
  }

  function checkMcq() {
    if (q.type !== "mcq") return;
    if (pick === null) return setError(true);
    record(pick === q.answer, q.options[pick]);
  }

  function next() {
    if (i + 1 >= qs.length) {
      const score = results.filter(Boolean).length;
      const result: QuizResult = { topicId: topic.id, score, total: qs.length, hintsUsed: hints, mistakes };
      try {
        sessionStorage.setItem(`ascent-quiz-${topic.id}`, JSON.stringify(result));
      } catch {}
      router.push(`/result/${topic.id}?from=quiz${flow ? `&${flow}=1` : ""}`);
      return;
    }
    setI(i + 1);
    setPick(null);
    setChecked(null);
    setYours("");
    setHint(false);
    setMore(false);
    setError(false);
    setFlagged(null);
    window.scrollTo({ top: 0 });
  }

  const optionState = (k: number): AnswerState => {
    if (q.type !== "mcq") return "idle";
    if (checked === null) return pick === k ? "selected" : "idle";
    if (k === q.answer) return "correct";
    if (k === pick) return "wrong";
    return "idle";
  };

  return (
    <div className="app">
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <header className="bar">
          <div className="bar-in" style={{ maxWidth: 920 }}>
            <div className="bar-row" style={{ gap: 10 }}>
              <Link href={backHref} className="icon-btn" aria-label="Leave quiz">
                <Icon name="cross" size={20} />
              </Link>
              <div className="grow">
                <div className="title-3" style={{ fontSize: 15 }}>{topic.title}</div>
                <div className="small muted">
                  Practice mode · question {i + 1} of {qs.length}
                </div>
              </div>
              <span className="pill gold tnum" style={{ height: 30 }}>
                {xp >= 0 ? "+" : "−"}
                {Math.abs(xp)} XP
              </span>
            </div>
            <div role="img" aria-label={`Question ${i + 1} of ${qs.length}. ${results.filter(Boolean).length} right so far.`} style={{ display: "grid", gridTemplateColumns: `repeat(${qs.length}, minmax(0, 1fr))`, gap: 4 }}>
              {qs.map((_, k) => (
                <span key={k} style={{ height: 8, borderRadius: 4, background: k < results.length ? (results[k] ? "var(--pine)" : "var(--danger)") : k === i ? "var(--gold)" : "var(--line)" }} />
              ))}
            </div>
          </div>
        </header>

        <main className="page medium">
          <div className="stack-3" style={{ gap: 16 }}>
            <span style={{ alignSelf: "flex-start" }}>
              <Badge tone="neutral">
                {TYPE_LABEL[q.type]} · {q.marks} {q.marks === 1 ? "mark" : "marks"}
              </Badge>
            </span>
            <h1 className="title-2" style={{ fontSize: 24, lineHeight: 1.3, fontWeight: 600, maxWidth: 720 }}>{q.prompt}</h1>

            {q.type === "mcq" && (
              <div role="radiogroup" aria-label="Answer options" className="g2">
                {q.options.map((o, k) => (
                  <AnswerOption key={k} letter={LETTERS[k]} state={optionState(k)} disabled={checked !== null} onClick={() => { setPick(k); setError(false); }}>
                    {o}
                  </AnswerOption>
                ))}
              </div>
            )}
            {q.type === "numeric" && <NumericAnswer key={q.id} answer={q.answer} unit={q.unit} tolerance={q.tolerance} onResult={(ok, v) => record(ok, `${v}${q.unit ? " " + q.unit : ""}`)} />}
            {q.type === "short" && <ShortAnswer key={q.id} model={q.model} points={q.points} marks={q.marks} onSelfMark={(m) => checked === null && record(m === "all", m === "all" ? "Got it all" : m === "some" ? "Got some" : "Missed it")} />}

            {error && (
              <p role="alert" className="as-field-error">
                Choose an answer first.
              </p>
            )}

            {checked === null && (
              <div className="row-wrap">
                {q.hint && (
                  <button type="button" className="as-chip as-chip--button" aria-expanded={hint} onClick={() => { if (!hint) setHints((h) => h + 1); setHint(true); }}>
                    Hint · −1 XP
                  </button>
                )}
                <button type="button" className="as-chip as-chip--button" aria-expanded={more} aria-label="More options" onClick={() => setMore(!more)} style={{ width: 44, padding: 0, justifyContent: "center" }}>
                  <Icon name="more" size={20} />
                </button>
              </div>
            )}
            {more && checked === null && (
              <div role="menu" className="panel" style={{ alignSelf: "flex-start", padding: 6, gap: 0, borderRadius: 14, boxShadow: "var(--shadow-overlay)", minWidth: 240 }}>
                {["Flag for later", "Report a problem with this question"].map((label) => (
                  <button key={label} type="button" role="menuitem" className="as-btn as-btn--ghost" style={{ justifyContent: "flex-start", color: "var(--ink)", fontWeight: 500 }} onClick={() => { setFlagged(label === "Flag for later" ? "Flagged for later." : "Thanks. We'll check this question within 48 hours."); setMore(false); }}>
                    {label}
                  </button>
                ))}
              </div>
            )}
            {flagged && <p className="note" role="status">{flagged}</p>}
            {hint && q.hint && <p className="p0 panel-gold" style={{ padding: "12px 14px", borderRadius: 12 }}>{q.hint}</p>}

            {checked !== null && (
              <div style={{ maxWidth: 720 }}>
                <Explanation tone={checked ? "correct" : "wrong"} title={checked ? "Correct · +2 XP" : q.type === "numeric" ? `Not quite. The answer is ${q.answer}${q.unit ? " " + q.unit : ""}.` : "Not quite"} links={checked ? undefined : q.links.map((l) => ({ label: l.label, href: `/topic/${topic.id}${l.href}`, icon: l.icon }))}>
                  {q.reason}
                  {!checked && yours && q.type !== "short" && <span className="small muted" style={{ display: "block", marginTop: 6 }}>Your answer: {yours}</span>}
                </Explanation>
              </div>
            )}
          </div>
        </main>

        <footer className="foot">
          <div className="foot-in" style={{ maxWidth: 920 }}>
            {checked === null ? (
              q.type === "mcq" ? (
                <Button size="lg" className="cta" onClick={checkMcq}>Check answer</Button>
              ) : (
                <span className="cta small muted" style={{ textAlign: "center" }}>{q.type === "numeric" ? "Enter your answer and tap Check." : "Write your answer, then compare with the model answer."}</span>
              )
            ) : (
              <Button size="lg" className="cta" onClick={next}>{i + 1 >= qs.length ? "See your result" : "Next question"}</Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
