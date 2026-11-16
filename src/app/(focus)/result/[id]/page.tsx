import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ResultView } from "@/components/student/ResultView";
import { chapters, topics } from "@/lib/data/content";

export function generateStaticParams() {
  return topics.map((t) => ({ id: t.id }));
}

export const metadata: Metadata = { title: "Quiz result" };

export default async function ResultPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ first?: string; demo?: string }> }) {
  const { id } = await params;
  const { first, demo } = await searchParams;
  const topic = topics.find((t) => t.id === id);
  if (!topic) notFound();
  const chapter = chapters.find((c) => c.id === topic.chapterId)!;
  const siblings = topics.filter((t) => t.chapterId === chapter.id);
  const nextTopic = siblings.find((t) => t.order === topic.order + 1) ?? null;
  return (
    <ResultView
      topicId={topic.id}
      topicTitle={topic.title}
      chapterHref={`/learn/${chapter.subjectId}/${chapter.id}`}
      next={nextTopic ? { title: nextTopic.title, minutes: nextTopic.minutes, href: `/topic/${nextTopic.id}?step=watch` } : null}
      first={first === "1"}
      demo={demo === "1"}
    />
  );
}
