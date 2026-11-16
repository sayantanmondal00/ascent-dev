import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { Badge, LEVEL_LABEL, ProgressBar } from "@/components/ui/primitives";
import { subjects } from "@/lib/data/content";
import { CURRENT_CHAPTER, SUBJECT_STATS, chapterProgress, chapterTopicSummary, chaptersFor } from "@/lib/data/student";
import type { SubjectId } from "@/lib/types";

export function generateStaticParams() {
  return subjects.map((s) => ({ subject: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const { subject } = await params;
  return { title: `Learn ${subjects.find((s) => s.id === subject)?.short ?? ""}` };
}

export default async function LearnPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: sid } = await params;
  const subject = subjects.find((s) => s.id === sid);
  if (!subject) notFound();
  const id = subject.id as SubjectId;
  const list = chaptersFor(id);
  const stats = SUBJECT_STATS[id];
  const cur = CURRENT_CHAPTER[id];
  const curChapter = list.find((c) => c.id === cur.chapterId)!;
  const counts = { mastered: 0, practised: 0, learning: 0, none: 0 };
  list.forEach((c) => counts[chapterProgress(c.id).level]++);
  const n = list.length;
  const pct = (k: number) => `${(k / n) * 100}%`;

  return (
    <main className="page">
      <div className="stack">
        <header className="stack-3" style={{ gap: 14 }}>
          <div>
            <p className="small muted p0">Class 10 · MBOSE</p>
            <h1 className="title-1">Learn</h1>
          </div>
          <nav className="subject-tabs" aria-label="Choose a subject">
            {subjects.map((s) => (
              <Link key={s.id} href={`/learn/${s.id}`} className="subject-tab" aria-current={s.id === id ? "page" : undefined}>
                <span className={`subject-dot ${s.id}`} />
                {s.short}
              </Link>
            ))}
          </nav>
        </header>

        <section className={`subject-hero ${id}`} aria-label={`${subject.short} progress`}>
          <div className="between" style={{ alignItems: "flex-end" }}>
            <div>
              <div className="strong soft" style={{ fontSize: 14 }}>{subject.short}</div>
              <div className="display">{stats.pct}%</div>
              <div className="soft" style={{ fontSize: 14 }}>complete · {n} chapters</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="strong tnum" style={{ fontSize: 18 }}>{stats.xp} XP</div>
              <div className="small soft">earned here</div>
            </div>
          </div>
          <div className="hbar" role="img" aria-label={`${counts.mastered} mastered, ${counts.practised} practised, ${counts.learning} learning, ${counts.none} not started`}>
            <span style={{ width: pct(counts.mastered) }} />
            <span style={{ width: pct(counts.practised) }} />
            <span style={{ width: pct(counts.learning) }} />
          </div>
          <div className="row-wrap">
            {counts.mastered > 0 && <span className="hpill">{counts.mastered} mastered</span>}
            {counts.practised > 0 && <span className="hpill">{counts.practised} practised</span>}
            {counts.learning > 0 && <span className="hpill">{counts.learning} learning</span>}
            {counts.none > 0 && <span className="hpill">{counts.none} not started</span>}
          </div>
          <p className="small soft p0">{subject.marksNote}</p>
        </section>

        <section className="stack-3" style={{ gap: 10 }}>
          <div className="between" style={{ flexWrap: "wrap" }}>
            <h2 className="title-2" style={{ fontSize: 19 }}>Chapters</h2>
            <span className="small muted">MBOSE syllabus order · every chapter is open</span>
          </div>
          <Link href={`/learn/${id}/${cur.chapterId}`} className="continue-here">
            <div className="row">
              <span className="continue-num">{curChapter.bookNumber}</span>
              <div className="grow">
                <div className="label" style={{ color: "var(--pine-ink)" }}>Continue here</div>
                <div className="title-3" style={{ fontSize: 17 }}>{cur.title}</div>
              </div>
              <Icon name="chevron-right" size={20} />
            </div>
            <p className="p0" style={{ fontSize: 14, color: "var(--pine-ink)" }}>
              <strong>Why:</strong> {cur.why}
            </p>
          </Link>
          <div className="g2">
            {list.map((c) => {
              const p = chapterProgress(c.id);
              const sum = chapterTopicSummary(c.id);
              const hrs = Math.max(1, Math.round(((sum.total * 40) / 60) * 2) / 2);
              const meta =
                p.level === "none"
                  ? `${sum.total} ${sum.total === 1 ? "topic" : "topics"} · about ${hrs} ${hrs === 1 ? "hr" : "hrs"}`
                  : p.note && /^(Weak|Heights)/.test(p.note)
                    ? p.note
                    : `${sum.quizzesDone} of ${sum.total} topics${p.note ? " · " + p.note : ""}`;
              return (
                <Link key={c.id} href={`/learn/${id}/${c.id}`} className={`as-card as-chapter${c.id === cur.chapterId ? " is-current" : ""}`}>
                  <div className="as-chapter-top">
                    <span className="as-chapter-num">{c.bookNumber}</span>
                    <div className="as-chapter-text">
                      <div className="as-chapter-title" style={{ fontSize: 15, lineHeight: "20px" }}>{c.title}</div>
                      <div className="as-chapter-meta">{meta}</div>
                    </div>
                    <span className="as-chapter-badges">
                      <Badge tone={p.level}>{LEVEL_LABEL[p.level]}</Badge>
                      {p.refreshDue && <Badge tone="xp" icon="clock">Refresh due</Badge>}
                    </span>
                  </div>
                  <ProgressBar value={p.pct} tone={p.level === "none" ? "none" : p.level} label={`${c.title} progress`} />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="stack-3" style={{ gap: 10 }}>
          <div>
            <h2 className="title-2" style={{ fontSize: 19 }}>Practise {subject.short}</h2>
            <p className="small muted p0" style={{ marginTop: 2 }}>Flashcards and weak spots also come to you in Today.</p>
          </div>
          <div className="g4">
            <Link href="/coming-soon?what=Chapter%20tests" className="kit"><Icon name="check" size={22} /><span className="title-3" style={{ fontSize: 15 }}>Chapter tests</span><span className="small muted">{stats.tests}</span></Link>
            <Link href="/coming-soon?what=Past%20papers" className="kit"><Icon name="clock" size={22} /><span className="title-3" style={{ fontSize: 15 }}>Past papers</span><span className="small muted">MBOSE [years] · timed like the board</span></Link>
            <Link href="/coming-soon?what=Flashcard%20review" className="kit"><Icon name="cards" size={22} /><span className="title-3" style={{ fontSize: 15 }}>Flashcards</span><span className="small muted">{stats.cards}</span></Link>
            <Link href="/coming-soon?what=Formula%20sheets" className="kit"><Icon name="notes" size={22} /><span className="title-3" style={{ fontSize: 15 }}>Formula sheets</span><span className="small muted">One per chapter · offline</span></Link>
          </div>
        </section>
      </div>
    </main>
  );
}
