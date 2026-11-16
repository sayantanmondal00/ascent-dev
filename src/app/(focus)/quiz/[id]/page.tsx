import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { QuizRunner } from "@/components/student/QuizRunner";
import { EmptyState } from "@/components/ui/primitives";
import { topics } from "@/lib/data/content";

export function generateStaticParams() {
  return topics.map((t) => ({ id: t.id }));
}

export const metadata: Metadata = { title: "Topic test" };

export default async function QuizPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ first?: string; demo?: string }> }) {
  const { id } = await params;
  const { first, demo } = await searchParams;
  const topic = topics.find((t) => t.id === id);
  if (!topic) notFound();
  if (!topic.quiz.length)
    return (
      <div className="app">
        <main className="page narrow" style={{ paddingTop: 48 }}>
          <EmptyState title="Questions are being written" body={`The test for ${topic.title} isn't ready yet.`} action={<Link href={`/topic/${topic.id}`} className="as-btn as-btn--primary">Back to the topic</Link>} />
        </main>
      </div>
    );
  return <QuizRunner topic={topic} backHref={`/topic/${topic.id}?step=test${demo === "1" ? "&demo=1" : first === "1" ? "&first=1" : ""}`} flow={demo === "1" ? "demo" : first === "1" ? "first" : undefined} />;
}
