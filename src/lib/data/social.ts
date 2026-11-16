/* SAMPLE leaderboard, week and badge data (from the Me screen design). Ranks are by study effort (XP), not marks.
   First name and initial only; "YOU" marks the student's own row. */
export type Scope = "class" | "school" | "state";
export type Period = "week" | "improved" | "all";
type Board = { head: string; sub: string; rows: [string, string, string][] };
const Y = "YOU";

export const leaderboards: Record<Scope, Record<Period, Board>> = {
  class: {
    week: { head: "#4 of 38", sub: "Class 10 B · 70 XP to pass Banri L.", rows: [["1", "Kyrshan L.", "1,020"], ["2", "Daniel M.", "940"], ["3", "Banri L.", "860"], ["4", Y, "790"], ["5", "Mebanshai S.", "760"]] },
    improved: { head: "#2 of 38", sub: "Class 10 B · XP gained on last week", rows: [["1", "Rimika K.", "+240"], ["2", Y, "+180"], ["3", "Mebanshai S.", "+150"], ["4", "Daniel M.", "+90"], ["5", "Kyrshan L.", "+60"]] },
    all: { head: "#3 of 38", sub: "Class 10 B · since June", rows: [["1", "Daniel M.", "6,480"], ["2", "Kyrshan L.", "6,120"], ["3", Y, "5,910"], ["4", "Banri L.", "5,400"], ["5", "Rimika K.", "4,980"]] },
  },
  school: {
    week: { head: "#9 of 162", sub: "Your school · top 6%", rows: [["7", "Pynshai R.", "845"], ["8", "Ibanylla W.", "812"], ["9", Y, "790"], ["10", "Wanbha N.", "775"], ["11", "Kitbor S.", "760"]] },
    improved: { head: "#6 of 162", sub: "Your school · XP gained on last week", rows: [["4", "Wanbha N.", "+210"], ["5", "Rimika K.", "+190"], ["6", Y, "+180"], ["7", "Kitbor S.", "+170"], ["8", "Ibanylla W.", "+160"]] },
    all: { head: "#5 of 162", sub: "Your school · since June", rows: [["3", "Kyrshan L.", "6,120"], ["4", "Aibansan T.", "6,040"], ["5", Y, "5,910"], ["6", "Banri L.", "5,400"], ["7", "Rimika K.", "4,980"]] },
  },
  state: {
    week: { head: "Top 18%", sub: "All Meghalaya · students near you", rows: [["1,202", "Riwan S. · East Khasi Hills", "792"], ["1,203", "Sengchi M. · West Garo Hills", "791"], ["1,204", Y, "790"], ["1,205", "Tengsil A. · Ri-Bhoi", "788"], ["1,206", "Iarap D. · West Jaintia Hills", "785"]] },
    improved: { head: "Top 9%", sub: "All Meghalaya · XP gained on last week", rows: [["640", "Sengchi M. · West Garo Hills", "+182"], ["641", "Pynsuk N. · East Khasi Hills", "+181"], ["642", Y, "+180"], ["643", "Tengsil A. · Ri-Bhoi", "+180"], ["644", "Iarap D. · West Jaintia Hills", "+179"]] },
    all: { head: "Top 22%", sub: "All Meghalaya · since June", rows: [["2,308", "Banshan K. · Ri-Bhoi", "5,920"], ["2,309", "Pynsuk N. · East Khasi Hills", "5,915"], ["2,310", Y, "5,910"], ["2,311", "Chimchi S. · South Garo Hills", "5,905"], ["2,312", "Dapbiang L. · Eastern West Khasi Hills", "5,900"]] },
  },
};

export const week = [
  { label: "Thu", value: 35 },
  { label: "Fri", value: 50 },
  { label: "Sat", value: 70 },
  { label: "Sun", value: 20 },
  { label: "Mon", value: 45 },
  { label: "Tue", value: 40 },
  { label: "Wed", value: 6 },
];

export const badges = [
  { name: "Circuit starter", how: "First Electricity topic mastered", got: true },
  { name: "Light master", how: "Mastered the Light chapter", got: true },
  { name: "Perfect 10", how: "Scored 10/10 on a quiz", got: true },
  { name: "Week warrior", how: "7-day streak", got: true },
  { name: "Card shark", how: "Reviewed 200 flashcards", got: false },
  { name: "Month strong", how: "30-day streak", got: false },
];
