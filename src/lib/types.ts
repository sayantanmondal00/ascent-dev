/* Data types shaped like the planned Supabase tables (context doc §13.2), so the sample data can be swapped for
   real queries without touching the screens. */

export type SubjectId = "maths" | "physics" | "chemistry";
export type Level = "none" | "learning" | "practised" | "mastered";
export type StepId = "watch" | "read" | "simulate" | "recall" | "test";
export type StepState = "done" | "next" | "locked";

export const STEP_ORDER: StepId[] = ["watch", "read", "simulate", "recall", "test"];
export const STEP_LABEL: Record<StepId, string> = { watch: "Watch", read: "Read", simulate: "Simulate", recall: "Recall", test: "Test" };

/* ---------- Content ---------- */
export type Subject = {
  id: SubjectId;
  name: string; // "Mathematics"
  short: string; // "Maths"
  marksNote: string; // copy under the subject header
};

export type Chapter = {
  id: string; // "phy-electricity"
  subjectId: SubjectId;
  classLevel: 9 | 10;
  order: number; // number in MBOSE order within the subject
  bookNumber?: number; // chapter number in the textbook, e.g. Physics "Chapter 11"
  title: string;
  marksWeight?: number;
};

export type VideoMoment = { t: string; label: string };
export type Video = { id: string; title: string; duration: string; sizeMB240: number; url?: string; moments: VideoMoment[] };
export type NoteSection = { id: string; title: string; paragraphs: string[] };
export type Formula = { name: string; tex: string; fallback: string; legend: { symbol: string; meaning: string; unit?: string }[] };
export type Simulation = { phetId: string; title: string; sizeMB: number; url?: string; tasks: string[] };
export type Flashcard = { id: string; front: string; back: string; backNote?: string };

export type QuestionBase = { id: string; prompt: string; marks: number; hint?: string; reason: string; links: { label: string; href: string; icon?: "play" | "notes" }[] };
export type McqQuestion = QuestionBase & { type: "mcq"; options: string[]; answer: number };
export type NumericQuestion = QuestionBase & { type: "numeric"; answer: number; unit?: string; tolerance?: number };
export type ShortQuestion = QuestionBase & { type: "short"; model: string; points: string[] };
export type Question = McqQuestion | NumericQuestion | ShortQuestion;

export type Topic = {
  id: string; // "phy-ohms-law"
  chapterId: string;
  order: number;
  title: string;
  minutes: number;
  xp: number;
  videos: Video[];
  notes: { sections: NoteSection[]; pdfSizeMB: number; formula?: Formula };
  simulation?: Simulation;
  flashcards: Flashcard[];
  quiz: Question[];
};

/* ---------- Learner state ---------- */
export type TopicProgress = { topicId: string; steps: Record<StepId, StepState>; level: Level; bestScore?: number };
export type ChapterProgress = { chapterId: string; level: Level; pct: number; note?: string; refreshDue?: boolean };

export type Student = {
  id: string;
  firstName: string;
  lastInitial: string;
  classLevel: 9 | 10;
  section?: string;
  school: string;
  town: string;
  streakDays: number;
  bestStreak: number;
  level: number;
  xpTotal: number;
  xpToNext: number;
  dailyGoalXp: number;
  dailyGoalMinutes: number;
  xpToday: number;
  reminderTime: string;
};

export type Task = { id: string; label: string; sub: string; xp: number; href: string };

export type ParentRequest = { id: string; label: string; reason: string; sentAgo: string; status: "waiting" | "approved" | "offered" | "declined"; reply?: string };
