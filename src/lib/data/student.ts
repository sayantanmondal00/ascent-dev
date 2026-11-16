import type { ChapterProgress, Level, Student, StepId, StepState, TopicProgress } from "@/lib/types";
import { STEP_ORDER } from "@/lib/types";
import { chapters, topics } from "./content";

/* SAMPLE LEARNER: Iba, Class 10 B, about 60–70% through, 12-day streak, Level 7, goal 60 XP (40 min) set by her parent. */
export const student: Student = {
  id: "stu-iba",
  firstName: "Iba",
  lastInitial: "K",
  classLevel: 10,
  section: "B",
  school: "[School name]",
  town: "Shillong",
  streakDays: 12,
  bestStreak: 21,
  level: 7,
  xpTotal: 1240,
  xpToNext: 260,
  dailyGoalXp: 60,
  dailyGoalMinutes: 40,
  xpToday: 30,
  reminderTime: "7:00 pm",
};

export const parent = { firstName: "Daphi", relation: "Mother", linkedSince: "2 October" };

/* Chapter levels and notes as shown on the Learn screen. */
const CHAPTER_STATE: Record<string, Omit<ChapterProgress, "chapterId">> = {
  "mat-real-numbers": { level: "mastered", pct: 100 },
  "mat-polynomials": { level: "mastered", pct: 100 },
  "mat-linear-equations": { level: "practised", pct: 100, note: "test ready" },
  "mat-quadratic": { level: "learning", pct: 60, note: "Weak spot: discriminant" },
  "mat-ap": { level: "mastered", pct: 100 },
  "mat-triangles": { level: "practised", pct: 100, note: "test ready" },
  "mat-coordinate": { level: "mastered", pct: 100 },
  "mat-trig-intro": { level: "mastered", pct: 100, refreshDue: true },
  "mat-trig-apps": { level: "practised", pct: 80, note: "Heights and distances in progress" },
  "phy-light": { level: "mastered", pct: 100, note: "mastered 3 weeks ago", refreshDue: true },
  "phy-human-eye": { level: "practised", pct: 100, note: "chapter test ready" },
  "phy-electricity": { level: "learning", pct: 56, note: "about 2 hrs left" },
  "che-reactions": { level: "mastered", pct: 100 },
  "che-acids": { level: "mastered", pct: 100 },
  "che-metals": { level: "learning", pct: 75, note: "reactivity series next" },
};

export function chapterProgress(chapterId: string): ChapterProgress {
  return { chapterId, ...(CHAPTER_STATE[chapterId] ?? { level: "none", pct: 0 }) };
}

/* Current chapter per subject ("Continue here"). */
export const CURRENT_CHAPTER: Record<string, { chapterId: string; title: string; why: string }> = {
  maths: { chapterId: "mat-trig-apps", title: "Some Applications of Trigonometry", why: "one topic left. After that, Circles: geometry and mensuration carry 29 marks." },
  physics: { chapterId: "phy-electricity", title: "Finish Electricity", why: "you are halfway through it and the Ohm’s law test is ready." },
  chemistry: { chapterId: "che-metals", title: "Finish Metals and Non-metals", why: "one topic is left before the chapter test opens." },
};

export const SUBJECT_STATS: Record<string, { pct: number; xp: number; cards: string; tests: string; next: string; revised: string; revisedPct: number }> = {
  maths: { pct: 66, xp: 520, cards: "112 cards · 12 due today", tests: "3 ready · Pair of Linear Equations, Triangles, A.P.", next: "Up next: Circles", revised: "6 of 14 chapters revised · Circles still to learn", revisedPct: 43 },
  physics: { pct: 64, xp: 410, cards: "64 cards · 9 due today", tests: "1 ready · The Human Eye", next: "Up next: finish Electricity", revised: "2 of 4 chapters revised", revisedPct: 50 },
  chemistry: { pct: 60, xp: 310, cards: "58 cards · 6 due today", tests: "Next one opens after Metals", next: "Up next: finish Metals and Non-metals", revised: "2 of 4 chapters revised", revisedPct: 50 },
};

const allDone = (): Record<StepId, StepState> => ({ watch: "done", read: "done", simulate: "done", recall: "done", test: "done" });
const fresh = (): Record<StepId, StepState> => ({ watch: "next", read: "locked", simulate: "locked", recall: "locked", test: "locked" });

/* Topic-level state for Electricity matches the Chapter screen; other chapters are derived from the chapter level. */
const TOPIC_STATE: Record<string, TopicProgress> = {
  "phy-electricity--electric-current-and-circuits": { topicId: "", steps: allDone(), level: "mastered", bestScore: 10 },
  "phy-electricity--potential-difference": { topicId: "", steps: allDone(), level: "mastered", bestScore: 9 },
  "phy-electricity--ohms-law-and-resistance": { topicId: "", steps: { watch: "done", read: "done", simulate: "done", recall: "done", test: "next" }, level: "learning" },
};

export function topicProgress(topicId: string): TopicProgress {
  const explicit = TOPIC_STATE[topicId];
  if (explicit) return { ...explicit, topicId };
  const t = topics.find((x) => x.id === topicId);
  const ch = t ? chapterProgress(t.chapterId) : undefined;
  if (!t || !ch || ch.level === "none") return { topicId, steps: fresh(), level: "none" };
  const siblings = topics.filter((x) => x.chapterId === t.chapterId);
  const doneCount = Math.round((ch.pct / 100) * siblings.length);
  if (t.order <= doneCount) {
    const level: Level = ch.level === "learning" ? "practised" : ch.level;
    return { topicId, steps: allDone(), level, bestScore: level === "mastered" ? 9 : 7 };
  }
  return { topicId, steps: fresh(), level: "none" };
}

export function stepStates(topicId: string) {
  const p = topicProgress(topicId);
  return STEP_ORDER.map((s) => ({ id: s, state: p.steps[s] }));
}

export function chapterTopicSummary(chapterId: string) {
  const list = topics.filter((t) => t.chapterId === chapterId).map((t) => ({ topic: t, progress: topicProgress(t.id) }));
  const mastered = list.filter((x) => x.progress.level === "mastered").length;
  const quizzesDone = list.filter((x) => x.progress.steps.test === "done").length;
  return { list, mastered, quizzesDone, total: list.length };
}

export function chaptersFor(subjectId: string) {
  return chapters.filter((c) => c.subjectId === subjectId).sort((a, b) => a.order - b.order);
}
