/* SAMPLE parent-area data (from the P4–P8 designs). The readiness verdict is ASSUMED: "on track" means finishing
   every chapter two weeks before the first board paper. Its real calculation is still an open question. */
export const readiness = {
  verdict: "A little behind schedule",
  needMinutes: 50,
  averageMinutes: 38,
  syllabusPct: 63,
  paceDone: "2 Dec",
  target: "23 Nov",
};

export const weekMinutes = [
  { label: "Thu", value: 35 },
  { label: "Fri", value: 50 },
  { label: "Sat", value: 70 },
  { label: "Sun", value: 20 },
  { label: "Mon", value: 45 },
  { label: "Tue", value: 40 },
  { label: "Today", value: 6 },
];

export const parentStats = [
  { value: "4h 26m", label: "studied", sub: "Goal 4h 40m" },
  { value: "4 of 6", label: "days goal met", sub: "Today is still going" },
  { value: "3", label: "topics finished", sub: "1 more than last week", up: true },
  { value: "12 days", label: "study streak", sub: "Best: 21 days", gold: true },
];

export const subjectSummary = [
  { id: "maths" as const, name: "Mathematics", left: "5 chapters not started · about 8 hrs", pct: 66, counts: { mastered: 5, practised: 3, learning: 1, notStarted: 5 } },
  { id: "physics" as const, name: "Physics", left: "Electricity in progress · 1 chapter to start", pct: 64, counts: { mastered: 1, practised: 1, learning: 1, notStarted: 1 } },
  { id: "chemistry" as const, name: "Chemistry", left: "Metals in progress · 1 chapter to start", pct: 60, counts: { mastered: 2, practised: 0, learning: 1, notStarted: 1 } },
];

export const recentScores = [
  { name: "Ohm’s law", meta: "Physics · topic quiz · today", score: "8/10", note: "Practised", good: true },
  { name: "Acids, Bases and Salts", meta: "Chemistry · chapter test · Mon", score: "22/25", note: "Mastered", good: true },
  { name: "Quadratic equations", meta: "Maths · topic quiz · Sat", score: "5/10", note: "Needs practice", good: false },
  { name: "Triangles", meta: "Maths · chapter test · Fri", score: "19/25", note: "Practised", good: true },
];

export const request = {
  ago: "2 hours ago",
  ask: "Make Sunday a lighter day:",
  detail: "20 minutes",
  instead: "instead of 40.",
  reason: "I have choir practice every Sunday. I will do 10 extra minutes on Saturday.",
};

export const cheers = ["Great week!", "Proud of your 12-day streak", "Keep going, you are close"];

/* P5 · per-subject detail for the parent's progress view. */
export const subjectDetail = {
  maths: {
    paper: "Its own 80-mark paper", cov: 44, of: 80, trend: [52, 58, 55, 63, 61, 66], trendLine: "Up from 52% to 66% in six weeks",
    weak: [
      { name: "Quadratic equations: the discriminant", score: "4/10, 5/10", doing: "added 5 practice questions to this week’s tasks and a short video to rewatch." },
      { name: "Trigonometry: heights and distances", score: "5/10", doing: "Iba is still learning this topic. It will be retested on Friday." },
    ],
    rows: [["Mastered in July", "Test 24/25"], ["Mastered in July", "Test 23/25"], ["Last studied 2 weeks ago", "Test 20/25"], ["Last studied Saturday", "Quiz 5/10"], ["Mastered in August", "Test 23/25"], ["Last studied Friday", "Test 19/25"], ["Mastered in September", "Test 24/25"], ["Refresh due", "Test 22/25"], ["Studied today", "Quiz 7/10"], ["About 1.5 hrs of study", ""], ["About 1.5 hrs of study", ""], ["About 2 hrs of study", ""], ["About 2 hrs of study", ""], ["About 1 hr of study", ""]],
  },
  physics: {
    paper: "Part of the 80-mark Science paper", cov: 12, of: 26, trend: [60, 64, 62, 70, 72, 80], trendLine: "Up from 60% to 80% in six weeks",
    weak: [] as { name: string; score: string; doing: string }[],
    rows: [["Refresh due", "Test 23/25"], ["Chapter test ready", "Quiz 8/10"], ["Studied today", "Quiz 8/10"], ["About 3 hrs of study", ""]],
  },
  chemistry: {
    paper: "Part of the 80-mark Science paper", cov: 13, of: 26, trend: [66, 70, 64, 72, 78, 84], trendLine: "Up from 66% to 84% in six weeks",
    weak: [{ name: "Metals: the reactivity series", score: "5/10", doing: "Iba is halfway through the video. The topic quiz comes next." }],
    rows: [["Mastered in August", "Test 22/25"], ["Mastered on Monday", "Test 22/25"], ["Studied yesterday", "Quiz 5/10"], ["About 3 hrs of study", ""]],
  },
};

export const trendWeeks = ["22 Sep", "29 Sep", "6 Oct", "13 Oct", "20 Oct", "This wk"];
export const timeThisMonth = [
  { name: "Maths", label: "6h 10m", pct: 100 },
  { name: "Physics", label: "5h 40m", pct: 92 },
  { name: "Chemistry", label: "3h 20m", pct: 54 },
];
