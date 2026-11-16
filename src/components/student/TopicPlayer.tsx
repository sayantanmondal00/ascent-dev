"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Badge, Button, cx } from "@/components/ui/primitives";
import { BottomSheet } from "@/components/ui/forms";
import { Flashcard, FormulaCard, SimFrame, VideoPlayer } from "@/components/ui/learning";
import { STEP_LABEL, STEP_ORDER, type StepId, type StepState, type Topic } from "@/lib/types";

const NEXT_LABEL: Record<StepId, string> = { watch: "Next: Read · 4 min", read: "Next: Simulate · 5 min", simulate: "Next: Recall · 2 min", recall: "Next: Test · 8 min", test: "" };

export function TopicPlayer({ topic, context, backHref, initialStates, startStep, flow }: { topic: Topic; context: string; backHref: string; initialStates: Record<StepId, StepState>; startStep: StepId; flow?: "demo" | "first" }) {
  const router = useRouter();
  const [states, setStates] = useState(initialStates);
  const [step, setStep] = useState<StepId>(states[startStep] === "locked" ? STEP_ORDER.find((s) => states[s] === "next") ?? "watch" : startStep);
  const [videoIdx, setVideoIdx] = useState(Math.min(1, topic.videos.length - 1));
  const [noteIdx, setNoteIdx] = useState(Math.min(1, topic.notes.sections.length - 1));
  const [cardIdx, setCardIdx] = useState(0);
  const [reviewed, setReviewed] = useState(initialStates.recall === "done" ? 2 : 0);
  const [simTask, setSimTask] = useState(1);
  const [simPick, setSimPick] = useState<string | null>(null);
  const [doubt, setDoubt] = useState(false);

  function advance() {
    const i = STEP_ORDER.indexOf(step);
    const nextId = STEP_ORDER[i + 1];
    if (!nextId) return;
    const ns = { ...states, [step]: "done" as StepState };
    if (ns[nextId] === "locked") ns[nextId] = "next";
    setStates(ns);
    setStep(nextId);
    window.scrollTo({ top: 0 });
  }

  const video = topic.videos[videoIdx];
  const card = topic.flashcards[cardIdx % topic.flashcards.length];
  const simChoices: [string, string][] = [["double", "The current doubles"], ["half", "The current halves"], ["same", "The current stays the same"]];

  return (
    <div className="app">
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <header className="bar">
          <div className="bar-in">
            <div className="bar-row" style={{ gap: 10 }}>
              <Link href={backHref} className="icon-btn" aria-label="Back to the chapter">
                <Icon name="chevron-left" size={22} />
              </Link>
              <div className="grow">
                <p className="small muted p0">{context}</p>
                <h1 className="title-2" style={{ fontSize: 21, lineHeight: "24px" }}>{topic.title}</h1>
              </div>
              {flow === "demo" && <span className="pill gold" style={{ height: 30 }}>Demo · no sign-up</span>}
              <span className="pill pine tab-up" style={{ height: 30 }}>Data saver on</span>
              <span className="pill gold" style={{ height: 30 }}>+{topic.xp} XP</span>
            </div>
            <div role="tablist" aria-label="Topic steps" className="as-steps">
              {STEP_ORDER.map((s, i) => {
                const st = states[s];
                return (
                  <button
                    key={s}
                    type="button"
                    role="tab"
                    aria-selected={s === step}
                    aria-disabled={st === "locked"}
                    aria-label={`${STEP_LABEL[s]}, ${st === "done" ? "done" : st === "next" ? "next" : "locked"}`}
                    className={cx("as-step", `as-step--${st}`, s === step && "is-current")}
                    onClick={() => st !== "locked" && setStep(s)}
                  >
                    <span className="as-step-dot">{st === "done" ? <Icon name="check" size={14} /> : st === "locked" ? <Icon name="lock" size={14} /> : i + 1}</span>
                    <span>{STEP_LABEL[s]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <main className="page">
          <div className="player">
            <div className="stack-3" style={{ gap: 14 }}>
              {step === "watch" && (
                <VideoPlayer key={video.id} title={video.title} duration={video.duration} sizeMB={video.sizeMB240} position={topic.videos.length > 1 ? `${videoIdx + 1} of ${topic.videos.length}` : undefined} src={video.url} />
              )}
              {step === "read" && (
                <>
                  {topic.notes.formula && <FormulaCard formula={topic.notes.formula} />}
                  <article className="as-notes-article">
                    {topic.notes.sections.map((s, i) => (
                      <section key={s.id} id={s.id} className="as-notes-section" hidden={i !== noteIdx}>
                        <h2>
                          {i + 1}. {s.title}
                        </h2>
                        {s.paragraphs.map((p, j) => (
                          <p key={j}>{p}</p>
                        ))}
                      </section>
                    ))}
                  </article>
                </>
              )}
              {step === "simulate" &&
                (topic.simulation ? (
                  <SimFrame title={topic.simulation.title} sizeMB={topic.simulation.sizeMB} src={topic.simulation.url} />
                ) : (
                  <div className="panel panel-sunken">
                    <div className="title-3">No simulation for this topic</div>
                    <p className="small muted p0">This topic is learned without one. Go on to Recall.</p>
                  </div>
                ))}
              {step === "recall" && (
                <Flashcard
                  key={card.id + cardIdx}
                  front={card.front}
                  back={card.back}
                  backNote={card.backNote}
                  counter={`Card ${(cardIdx % topic.flashcards.length) + 1} of ${topic.flashcards.length}`}
                  onRate={() => {
                    setReviewed((r) => Math.min(topic.flashcards.length, r + 1));
                    setCardIdx((c) => c + 1);
                  }}
                />
              )}
              {step === "test" && (
                <>
                  <section className="panel panel-lg" style={{ gap: 6 }}>
                    <h2 className="title-2" style={{ fontSize: 21 }}>Topic test</h2>
                    <p className="muted p0" style={{ fontSize: 14 }}>
                      {topic.quiz.length ? `${topic.quiz.length} questions · about 8 min · MCQs, numericals and one short answer you check yourself` : "Questions for this topic are being written."}
                    </p>
                  </section>
                  <div className="row panel-pine" style={{ alignItems: "flex-start", padding: 14, borderRadius: 16 }}>
                    <Icon name="check" size={20} strokeWidth={2.4} style={{ color: "var(--pine-ink)", marginTop: 2 }} />
                    <div style={{ fontSize: 14, lineHeight: 1.45 }}>
                      <strong style={{ fontSize: 15 }}>Practice mode</strong>
                      <br />
                      You see the answer and why after each question. Hints cost 1 XP. Up to +20 XP.
                    </div>
                  </div>
                  <p className="note">Timed test mode is used for chapter tests and past papers.</p>
                </>
              )}
            </div>

            <aside className="stack-3" style={{ gap: 14 }}>
              {step === "watch" && (
                <>
                  <section className="as-video-moments" aria-label="Key moments">
                    <h3>Key moments</h3>
                    {video.moments.map((m) => (
                      <button key={m.t} type="button" className="as-video-moment">
                        <span className="as-video-time">{m.t}</span>
                        {m.label}
                      </button>
                    ))}
                  </section>
                  <section className="stack-2">
                    <h2 className="title-3" style={{ fontSize: 15 }}>Videos in this topic</h2>
                    {topic.videos.map((v, i) => (
                      <button key={v.id} type="button" onClick={() => setVideoIdx(i)} className={cx("choice", i === videoIdx && "is-on")} style={{ minHeight: 48, padding: "10px 12px", fontSize: 14, borderColor: i === videoIdx ? undefined : "var(--line)" }}>
                        <span className="num-dot" style={{ width: 24, height: 24, fontSize: 12, background: i < videoIdx ? "var(--pine)" : i === videoIdx ? "var(--gold)" : "var(--line)", color: i < videoIdx ? "var(--on-pine)" : i === videoIdx ? "var(--on-gold)" : "var(--ink)" }}>
                          {i < videoIdx ? <Icon name="check" size={13} /> : i + 1}
                        </span>
                        <span className="grow" style={{ fontWeight: 500 }}>{v.title}</span>
                        <span className="muted tnum">{v.duration}</span>
                      </button>
                    ))}
                  </section>
                </>
              )}
              {step === "read" && (
                <>
                  <nav className="as-notes-nav" aria-label="In these notes">
                    <h2 className="title-3" style={{ fontSize: 15, margin: "8px 0 4px" }}>In these notes</h2>
                    {topic.notes.sections.map((s, i) => (
                      <button key={s.id} type="button" onClick={() => setNoteIdx(i)} className={cx("as-notes-link", i === noteIdx && "is-current")} style={{ background: "none", border: "none", borderTop: "1px solid var(--line)", textAlign: "left", font: "inherit", fontSize: 14, cursor: "pointer", padding: 0 }} aria-current={i === noteIdx ? "true" : undefined}>
                        <span className="as-notes-dot" style={{ background: i < noteIdx ? "var(--pine)" : i === noteIdx ? "var(--gold)" : undefined }} />
                        {i + 1}. {s.title}
                      </button>
                    ))}
                  </nav>
                  <div className="row-wrap">
                    <Button variant="secondary" icon="download" className="grow">Download PDF · {topic.notes.pdfSizeMB} MB</Button>
                    <Button variant="secondary" icon="flag" className="grow">Report a mistake</Button>
                  </div>
                </>
              )}
              {step === "simulate" && topic.simulation && (
                <section className="panel panel-lg" style={{ gap: 12 }}>
                  <h2 className="title-3">Try this · task {simTask + 1} of {topic.simulation.tasks.length}</h2>
                  <p className="p0">{topic.simulation.tasks[simTask]}</p>
                  {simTask === 1 && (
                    <>
                      <div className="stack-2">
                        {simChoices.map(([id, label]) => {
                          const picked = simPick === id;
                          const state = picked ? (id === "double" ? "correct" : "wrong") : "idle";
                          return (
                            <button key={id} type="button" onClick={() => setSimPick(id)} className={cx("as-answer", `as-answer--${state}`)} style={{ minHeight: 48, fontSize: 15 }}>
                              <span className="as-answer-label">{label}</span>
                            </button>
                          );
                        })}
                      </div>
                      {simPick && (
                        <p role="status" className="p0" style={{ fontSize: 14, fontWeight: 500, color: simPick === "double" ? "var(--pine-ink)" : "var(--danger)" }}>
                          {simPick === "double" ? "Correct, +10 XP. With R fixed, current is proportional to voltage." : "Not quite. Watch the ammeter as you move the voltage slider."}
                        </p>
                      )}
                    </>
                  )}
                  <div className="row-wrap">
                    <Button variant="ghost" icon="chevron-left" disabled={simTask === 0} onClick={() => { setSimTask(simTask - 1); setSimPick(null); }}>Previous task</Button>
                    <Button variant="ghost" iconAfter="chevron-right" disabled={simTask >= topic.simulation.tasks.length - 1} onClick={() => { setSimTask(simTask + 1); setSimPick(null); }}>Next task</Button>
                  </div>
                </section>
              )}
              {step === "recall" && (
                <section className="panel panel-lg" style={{ gap: 8, fontSize: 14 }}>
                  <h2 className="title-3" style={{ fontSize: 15 }}>How rating works</h2>
                  <p className="muted p0">Be honest. Cards you find hard come back sooner, and easy ones wait longer. Due cards show up in Today.</p>
                  <p className="strong p0">
                    {reviewed} of {topic.flashcards.length} reviewed in this topic
                  </p>
                </section>
              )}
              {step === "test" && (
                <section className="panel panel-lg" style={{ gap: 10 }}>
                  <h2 className="title-3" style={{ fontSize: 15 }}>What your score means</h2>
                  <div className="row" style={{ gap: 10, fontSize: 14 }}><span className="strong" style={{ width: 64 }}>Below 6</span><Badge tone="learning">Learning</Badge></div>
                  <div className="row" style={{ gap: 10, fontSize: 14 }}><span className="strong" style={{ width: 64 }}>6 to 8</span><Badge tone="practised">Practised</Badge></div>
                  <div className="row" style={{ gap: 10, fontSize: 14 }}><span className="strong" style={{ width: 64 }}>9 or 10</span><Badge tone="mastered">Mastered</Badge></div>
                  <p className="note">Retries use new questions. You earn XP only for answers you have not already got right.</p>
                </section>
              )}
            </aside>
          </div>
        </main>

        <footer className="foot">
          <div className="foot-in">
            <Button variant="secondary" size="lg" icon="help" onClick={() => setDoubt(true)}>
              Ask a doubt
            </Button>
            {step === "test" ? (
              <Button size="lg" className="cta" disabled={!topic.quiz.length} onClick={() => router.push(`/quiz/${topic.id}${flow ? `?${flow}=1` : ""}`)}>
                {topic.quiz.length ? "Start test · 8 min" : "Test coming soon"}
              </Button>
            ) : (
              <Button size="lg" className="cta" onClick={advance}>
                {NEXT_LABEL[step]}
              </Button>
            )}
          </div>
        </footer>
      </div>
      <BottomSheet open={doubt} onClose={() => setDoubt(false)} title="Ask a doubt" actions={<Button block onClick={() => setDoubt(false)}>OK</Button>}>
        Doubts will be answered inside Ascent. This part is being built. Until then, ask your teacher, and use “Report a mistake” if something in the notes looks wrong.
      </BottomSheet>
    </div>
  );
}
