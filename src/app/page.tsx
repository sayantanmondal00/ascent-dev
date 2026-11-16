import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { SubjectMark } from "@/components/ui/primitives";
import { OnboardHeader, OnboardPage } from "@/components/onboarding/parts";
import { DEMO_TOPIC_ID, chapters, subjects } from "@/lib/data/content";

/* D1 · Welcome: try a topic without signing up, or sign up. */
export default function Welcome() {
  return (
    <OnboardPage
      footer={
        <>
          <Link href={`/topic/${DEMO_TOPIC_ID}?demo=1&step=watch`} className="as-btn as-btn--primary as-btn--lg as-btn--block">
            Try a topic · no sign-up
          </Link>
          <Link href="/signup" className="as-btn as-btn--secondary as-btn--lg as-btn--block">
            Sign up
          </Link>
          <p className="p0 muted" style={{ textAlign: "center", fontSize: 14 }}>
            Already have an account? <Link href="/login" className="strong">Sign in</Link>
          </p>
        </>
      }
    >
      <OnboardHeader />
      <section className="stack-3" style={{ paddingTop: 8 }}>
        <span className="pill pine" style={{ alignSelf: "flex-start" }}>Made for MBOSE Class 9 and 10</span>
        <h1 className="title-1" style={{ fontSize: 36, lineHeight: "38px", letterSpacing: "-0.03em" }}>Know what to study next, and know when you&apos;ve got it.</h1>
        <p className="body-lg muted p0">Short videos, notes, simulations, flashcards and quizzes for every chapter of the MBOSE syllabus.</p>
      </section>
      <section className="panel" style={{ borderRadius: 20 }}>
        {subjects.map((s) => (
          <div key={s.id} className="row">
            <SubjectMark subject={s.id} size={40} />
            <div>
              <div className="title-3" style={{ fontSize: 15 }}>{s.name}</div>
              <div className="small muted">{chapters.filter((c) => c.subjectId === s.id).length} chapters · Class 10</div>
            </div>
          </div>
        ))}
      </section>
      <ul className="bullets" style={{ fontSize: 15 }}>
        <li><Icon name="download" size={20} style={{ color: "var(--pine)" }} />Light on data: videos at 240p, notes work offline</li>
        <li><Icon name="shield" size={20} style={{ color: "var(--pine)" }} />No ads. Your parent approves your account</li>
        <li><Icon name="star" size={20} style={{ color: "var(--pine)" }} />[Price] a year · your first topic is free</li>
      </ul>
    </OnboardPage>
  );
}
