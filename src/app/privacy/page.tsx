import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Privacy notice" };

/* PLACEHOLDER privacy notice. The final text needs a lawyer before launch (DPDP Act 2023, Section 9). */
export default function Privacy() {
  return (
    <div className="app">
      <main className="page narrow" style={{ paddingTop: 32 }}>
        <article className="stack-3" style={{ gap: 16, maxWidth: "68ch" }}>
          <Link href="/" aria-label="Ascent home"><Logo size={32} /></Link>
          <p className="pill gold p0" style={{ alignSelf: "flex-start" }}>Draft · final text to be checked by a lawyer</p>
          <h1 className="title-1">Privacy notice</h1>
          <p className="body-lg p0">Ascent is for students under 18, so India&apos;s Digital Personal Data Protection Act needs a parent or guardian to agree before Ascent keeps a student&apos;s data.</p>
          <h2 className="title-2">What Ascent keeps</h2>
          <ul className="body-lg" style={{ margin: 0 }}>
            <li>The student&apos;s first name, class and school</li>
            <li>Study time, quiz scores and flashcard progress</li>
            <li>Doubts the student asks, so they can be answered</li>
            <li>The parent&apos;s phone number and the date consent was given</li>
          </ul>
          <h2 className="title-2">What Ascent never does</h2>
          <ul className="body-lg" style={{ margin: 0 }}>
            <li>Show ads, or sell or share the student&apos;s data</li>
            <li>Track the student outside Ascent</li>
            <li>Let strangers message the student</li>
          </ul>
          <h2 className="title-2">What parents can do, any time</h2>
          <ul className="body-lg" style={{ margin: 0 }}>
            <li>See progress and scores (never individual answers or doubts)</li>
            <li>Download or delete the student&apos;s data</li>
            <li>Withdraw consent</li>
          </ul>
        </article>
      </main>
    </div>
  );
}
