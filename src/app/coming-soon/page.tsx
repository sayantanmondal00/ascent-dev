import Link from "next/link";
import type { Metadata } from "next";
import { EmptyState, Logo } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Coming soon" };

/* Placeholder for screens that are planned but not designed yet (chapter tests, past papers, flashcard review,
   formula sheets, search, student settings, doubts). */
export default async function ComingSoon({ searchParams }: { searchParams: Promise<{ what?: string }> }) {
  const { what } = await searchParams;
  const name = what?.slice(0, 60) || "This part of Ascent";
  return (
    <div className="app">
      <main className="page narrow" style={{ paddingTop: 32 }}>
        <div className="stack">
          <Link href="/today" aria-label="Ascent home" style={{ alignSelf: "flex-start" }}>
            <Logo size={32} />
          </Link>
          <EmptyState
            title={`${name} is coming soon`}
            body="We're still building this part. Everything you study now is saved and will show up here when it opens."
            action={
              <Link href="/today" className="as-btn as-btn--primary">
                Back to Today
              </Link>
            }
          />
        </div>
      </main>
    </div>
  );
}
