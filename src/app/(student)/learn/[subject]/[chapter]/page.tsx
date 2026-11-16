import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { Badge, LEVEL_LABEL, ProgressBar } from "@/components/ui/primitives";
import { chapters, subjects } from "@/lib/data/content";
import { chapterProgress, chapterTopicSummary } from "@/lib/data/student";
import { STEP_LABEL, STEP_ORDER } from "@/lib/types";

export function generateStaticParams() {
  return chapters.map((c) => ({ subject: c.subjectId, chapter: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }): Promise<Metadata> {
  const { chapter } = await params;
  return { title: chapters.find((c) => c.id === chapter)?.title ?? "Chapter" };
}

export default async function ChapterPage({ params }: { params: Promise<{ subject: string; chapter: string }> }) {
  const { subject: sid, chapter: cid } = await params;
  const chapter = chapters.find((c) => c.id === cid && c.subjectId === sid);
  const subject = subjects.find((s) => s.id === sid);
  if (!chapter || !subject) notFound();
  const prog = chapterProgress(chapter.id);
  const sum = chapterTopicSummary(chapter.id);
  const minsLeft = sum.list.filter((x) => x.progress.level === "none" || x.progress.level === "learning").reduce((s, x) => s + x.topic.minutes, 0);
  const hoursLeft = Math.max(0.5, Math.round((minsLeft / 60) * 2) / 2);

  return (
    <main className="page">
      <div className="chap">
        <header className="stack-2" style={{ gridArea: "head", gap: 10 }}>
          <nav aria-label="Breadcrumb" className="row small muted" style={{ gap: 6, fontSize: 14 }}>
            <Link href={`/learn/${subject.id}`} className="text-link">
              <Icon name="chevron-left" size={18} />
              {subject.short}
            </Link>
            <span aria-hidden>/</span>
            <span>Chapter {chapter.bookNumber}</span>
          </nav>
          <div className="row-wrap" style={{ gap: 12 }}>
            <h1 className="title-1">{chapter.title}</h1>
            <Badge tone={prog.level}>{LEVEL_LABEL[prog.level]}</Badge>
          </div>
        </header>

        <div className="stack-3" style={{ gridArea: "top", gap: 16 }}>
          <section className="panel" style={{ borderRadius: 20, gap: 10 }}>
            <div className="between">
              <span className="numeral" style={{ fontSize: 32, lineHeight: "36px" }}>{prog.pct}%</span>
              <span className="muted" style={{ fontSize: 14 }}>
                {sum.mastered} of {sum.total} topics mastered
              </span>
            </div>
            <ProgressBar value={prog.pct} tone={prog.level === "none" ? "none" : prog.level} label="Chapter progress" />
            <p className="note">{prog.pct >= 100 ? "Every topic is done. Take the chapter test to check it all." : `About ${hoursLeft} ${hoursLeft === 1 ? "hour" : "hours"} left.`}</p>
          </section>
          <Link href="/coming-soon?what=Chapter%20test-out%20quiz" className="testout">
            <span className="grow">
              <span className="title-3" style={{ display: "block", fontSize: 15 }}>Studied this at school?</span>
              <span className="small muted" style={{ display: "block" }}>Test out of the chapter · 15 min · topics you score 9+ on are marked done</span>
            </span>
            <Icon name="chevron-right" size={18} />
          </Link>
        </div>

        <section className="stack-3" style={{ gridArea: "topics", gap: 10 }}>
          <h2 className="title-2" style={{ fontSize: 19 }}>Topics</h2>
          {sum.list.map(({ topic, progress }) => {
            const next = STEP_ORDER.find((s) => progress.steps[s] === "next");
            const started = STEP_ORDER.some((s) => progress.steps[s] === "done");
            const current = started && !!next;
            const line =
              !next ? `Done · quiz ${progress.bestScore ?? "–"}/10` : started ? `Next: ${STEP_LABEL[next]}${next === "test" ? " · 8 min" : ""}` : `Starts with Watch · about ${topic.minutes} min`;
            return (
              <Link key={topic.id} href={`/topic/${topic.id}${next ? `?step=${next}` : ""}`} className={`topic-row${current ? " is-current" : ""}`}>
                <div className="row" style={{ alignItems: "flex-start" }}>
                  <span className="topic-num">{topic.order}</span>
                  <div className="grow">
                    <div className="title-3">{topic.title}</div>
                    <div className="small muted">
                      {topic.videos.length} {topic.videos.length === 1 ? "video" : "videos"}
                    </div>
                  </div>
                  <Badge tone={progress.level}>{LEVEL_LABEL[progress.level]}</Badge>
                </div>
                <div style={{ fontSize: 14, fontWeight: current ? 700 : 500, color: current ? "var(--pine-ink)" : "var(--ink-muted)" }}>{line}</div>
              </Link>
            );
          })}
          <p className="note">Inside each topic: Watch, Read, Simulate, Recall, then Test, always in that order.</p>
        </section>

        <div className="stack-3" style={{ gridArea: "bottom", gap: 16 }}>
          {sum.quizzesDone < sum.total ? (
            <section className="locked-card">
              <span className="ico ico-surface" style={{ color: "var(--ink-muted)", width: 44, height: 44 }}>
                <Icon name="lock" size={22} />
              </span>
              <div className="grow">
                <div className="title-3" style={{ fontSize: 15, color: "var(--ink)" }}>Chapter test · 25 questions</div>
                <div className="small">
                  Opens after all {sum.total} topic quizzes · {sum.quizzesDone} of {sum.total} done
                </div>
                <div className="mini-bar" style={{ marginTop: 8 }}>
                  <span style={{ width: `${(sum.quizzesDone / sum.total) * 100}%`, background: "var(--ink-muted)" }} />
                </div>
              </div>
            </section>
          ) : (
            <Link href="/coming-soon?what=Chapter%20tests" className="panel" style={{ textDecoration: "none", color: "var(--ink)" }}>
              <div className="row">
                <span className="ico"><Icon name="check-circle" size={22} /></span>
                <div className="grow">
                  <div className="title-3" style={{ fontSize: 15 }}>Chapter test · 25 questions</div>
                  <div className="small muted">Ready · timed like the board · about 25 min</div>
                </div>
                <Icon name="chevron-right" size={18} />
              </div>
            </Link>
          )}
          <section className="stack-2">
            <h2 className="title-2" style={{ fontSize: 19 }}>Chapter resources</h2>
            <div className="tag-row">
              <Link href="/coming-soon?what=Formula%20sheets" className="as-chip as-chip--button">Formula sheet <span className="muted" style={{ fontWeight: 500 }}>offline</span></Link>
              <Link href="/coming-soon?what=Flashcard%20review" className="as-chip as-chip--button">Flashcards <span className="muted" style={{ fontWeight: 500 }}>{sum.list.reduce((s, x) => s + x.topic.flashcards.length, 0)}</span></Link>
              <Link href="/coming-soon?what=Simulations" className="as-chip as-chip--button">Simulations <span className="muted" style={{ fontWeight: 500 }}>{sum.list.filter((x) => x.topic.simulation).length}</span></Link>
              <Link href="/coming-soon?what=Past%20questions" className="as-chip as-chip--button">Past questions <span className="muted" style={{ fontWeight: 500 }}>[n]</span></Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
