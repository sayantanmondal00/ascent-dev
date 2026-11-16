import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TopicPlayer } from "@/components/student/TopicPlayer";
import { chapters, subjects, topics } from "@/lib/data/content";
import { topicProgress } from "@/lib/data/student";
import { STEP_ORDER, type StepId } from "@/lib/types";

export function generateStaticParams() {
  return topics.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: topics.find((t) => t.id === id)?.title ?? "Topic" };
}

export default async function TopicPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ step?: string; demo?: string; first?: string }> }) {
  const { id } = await params;
  const { step, demo, first } = await searchParams;
  const flow = demo === "1" ? "demo" : first === "1" ? "first" : undefined;
  const topic = topics.find((t) => t.id === id);
  if (!topic) notFound();
  const chapter = chapters.find((c) => c.id === topic.chapterId)!;
  const subject = subjects.find((s) => s.id === chapter.subjectId)!;
  const total = topics.filter((t) => t.chapterId === chapter.id).length;
  const progress = flow ? { steps: { watch: "next", read: "locked", simulate: "locked", recall: "locked", test: "locked" } as const } : topicProgress(topic.id);
  const start = (STEP_ORDER.find((s) => s === step) ?? STEP_ORDER.find((s) => progress.steps[s] === "next") ?? "test") as StepId;
  return (
    <TopicPlayer
      key={topic.id + start + (flow ?? "")}
      topic={topic}
      context={`${subject.short} · ${chapter.title} · topic ${topic.order} of ${total}`}
      backHref={flow === "demo" ? "/" : flow === "first" ? "/today?mode=day1" : `/learn/${subject.id}/${chapter.id}`}
      flow={flow}
      initialStates={progress.steps}
      startStep={start}
    />
  );
}
