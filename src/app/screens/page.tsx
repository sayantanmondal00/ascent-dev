import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/ui/primitives";
import { DEMO_TOPIC_ID, FIRST_TOPIC_ID, OHM_TOPIC_ID } from "@/lib/data/content";

export const metadata: Metadata = { title: "All screens" };

/* Review index: every screen from the design canvas, by its board number. Sample data only. */
const GROUPS: { title: string; items: [string, string, string][] }[] = [
  {
    title: "Day one: from a shared link to the first win",
    items: [
      ["D1", "Welcome", "/"],
      ["Demo", "Demo topic (no sign-up)", `/topic/${DEMO_TOPIC_ID}?demo=1&step=watch`],
      ["D2", "Sign up · phone and code", "/signup?demo=7"],
      ["D3", "Ask a parent", "/signup/parent"],
      ["D4", "Parent agrees on this phone", "/signup/consent"],
      ["D5", "Waiting for a parent", "/signup/waiting"],
      ["D6", "About you", "/signup/about"],
      ["D7", "Today · day one", "/today?mode=day1"],
      ["D8", "Result · first win", `/result/${FIRST_TOPIC_ID}?first=1`],
    ],
  },
  {
    title: "Learning flow",
    items: [
      ["1", "Today · normal day", "/today"],
      ["2", "Learn · Physics", "/learn/physics"],
      ["3", "Chapter · Electricity", "/learn/physics/phy-electricity"],
      ["4", "Topic player · Ohm's law", `/topic/${OHM_TOPIC_ID}?step=test`],
      ["5", "Quiz · practice mode", `/quiz/${OHM_TOPIC_ID}`],
      ["6", "Quiz result", `/result/${OHM_TOPIC_ID}`],
    ],
  },
  {
    title: "Other student states",
    items: [
      ["7", "Today · welcome back", "/today?mode=back"],
      ["8", "Today · revision season", "/today?mode=revision"],
      ["9", "Me", "/me"],
      ["10", "Family and privacy", "/me/family"],
    ],
  },
  {
    title: "Parent area",
    items: [
      ["P1", "Who's using Ascent? (shared phone)", "/parent"],
      ["P2–P3", "Parent sign-up and consent", "/parent/setup"],
      ["P4", "This week", "/parent/home"],
      ["P5", "Iba's progress", "/parent/progress"],
      ["P6", "Plan", "/parent/plan"],
      ["P7", "Messages, requests and rewards", "/parent/messages"],
      ["P8", "Settings, privacy and consent", "/parent/settings"],
    ],
  },
];

export default function Screens() {
  return (
    <div className="app">
      <main className="page medium" style={{ paddingTop: 28 }}>
        <div className="stack">
          <Logo size={36} />
          <div>
            <h1 className="title-1">All screens</h1>
            <p className="muted p0">Every board from the design canvas, running on sample data. Resize the window to see phone, iPad and desktop layouts.</p>
          </div>
          {GROUPS.map((g) => (
            <section key={g.title} className="panel" style={{ borderRadius: 20, gap: 0 }}>
              <h2 className="title-2" style={{ fontSize: 19, marginBottom: 8 }}>{g.title}</h2>
              <div className="list">
                {g.items.map(([n, label, href]) => (
                  <Link key={href + n} href={href} className="list-row" style={{ minHeight: 52 }}>
                    <span className="topic-num" style={{ width: 48 }}>{n}</span>
                    <span className="title-3 grow" style={{ fontSize: 15 }}>{label}</span>
                    <span className="small muted">{href}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
