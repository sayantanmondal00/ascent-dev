import type { SVGProps } from "react";

function circ(x: number, y: number, r: number) {
  return `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
}

/* Tabler-style outline icons, 24px grid, 2px stroke. Fixed meanings (Brand System): flame = streak, bolt = XP,
   trophy = badges, play = video, notes = notes, flask = simulation, cards = flashcards, check-circle = test,
   lock = locked step, target = practice, chart = progress, book = subjects/learn. */
const PATHS = {
  home: ["M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"],
  book: ["M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z", "M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"],
  user: [circ(12, 8, 4), "M4 21a8 8 0 0 1 16 0"],
  users: [circ(9, 8, 3.5), "M2.5 20a6.5 6.5 0 0 1 13 0", "M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"],
  target: [circ(12, 12, 9), circ(12, 12, 5), circ(12, 12, 1)],
  chart: ["M4 20V10M10 20V4M16 20v-7M2 20h20"],
  flame: ["M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5.5.8 1.2 1.5 1.8 2.5 2C12 7 12 5 12 3z"],
  bolt: ["M13 2 4 14h7l-1 8 9-12h-7z"],
  trophy: ["M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6"],
  play: ["M7 4l13 8-13 8z"],
  notes: ["M14 3H6v18h12V7z", "M14 3v4h4M9 12h6M9 16h6"],
  flask: ["M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"],
  cards: ["M5 6h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z", "M7 3h12a2 2 0 0 1 2 2v12"],
  check: ["m5 12 5 5 9-10"],
  "check-circle": [circ(12, 12, 9), "m8 12 3 3 5-6"],
  cross: ["M6 6l12 12M18 6 6 18"],
  lock: ["M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z", "M8 11V7a4 4 0 0 1 8 0v4"],
  "chevron-right": ["m9 18 6-6-6-6"],
  "chevron-left": ["m15 18-6-6 6-6"],
  "chevron-down": ["m6 9 6 6 6-6"],
  swap: ["M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"],
  help: [circ(12, 12, 9), "M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"],
  info: [circ(12, 12, 9), "M12 11v6M12 7.5v.01"],
  search: [circ(11, 11, 7), "m20 20-3.5-3.5"],
  clock: [circ(12, 12, 9), "M12 7v5l3 2"],
  calendar: ["M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z", "M4 10h16M8 3v4M16 3v4"],
  download: ["M12 4v11M7 10l5 5 5-5M5 20h14"],
  "wifi-off": ["M3 3l18 18", "M8.5 16.4a5 5 0 0 1 7 0", "M5 12.9a10 10 0 0 1 5.2-2.7", "M14.3 10.3A10 10 0 0 1 19 12.9", "M2 9.3a15 15 0 0 1 4.3-2.8", "M10.5 5.6A15 15 0 0 1 22 9.3", "M12 20h.01"],
  refresh: ["M20 11a8 8 0 1 0-2.3 5.7", "M20 4v7h-7"],
  captions: ["M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z", "M10 10.5a2 2 0 1 0 0 3M16 10.5a2 2 0 1 0 0 3"],
  flag: ["M5 21V4M5 4h11l-2 4 2 4H5"],
  eye: ["M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z", circ(12, 12, 3)],
  "eye-off": ["M3 3l18 18", "M10.6 6.1A10 10 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-2.6 3.3M6.6 6.6C3.7 8.5 2 12 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6", "M9.9 9.9a3 3 0 0 0 4.2 4.2"],
  heart: ["M19.5 12.6 12 20l-7.5-7.4A5 5 0 1 1 12 6a5 5 0 1 1 7.5 6.6"],
  message: ["M4 5h16v11H9l-5 4z"],
  bell: ["M6 16V11a6 6 0 1 1 12 0v5l2 2H4z", "M10 20a2 2 0 0 0 4 0"],
  settings: [circ(12, 12, 3), "M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"],
  plus: ["M12 5v14M5 12h14"],
  minus: ["M5 12h14"],
  gift: ["M4 11h16v10H4z", "M3 7h18v4H3zM12 7v14", "M12 7H8.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h3.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"],
  shield: ["M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z", "m9 12 2 2 4-4"],
  phone: ["M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z", "M11 18h2"],
  link: ["M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1", "M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"],
  send: ["M21 3 10 14M21 3l-7 18-4-7-7-4z"],
  more: ["M5 12h.01M12 12h.01M19 12h.01"],
  "arrow-left": ["M19 12H5M11 6l-6 6 6 6"],
  "arrow-up": ["M12 19V5M6 11l6-6 6 6"],
  star: ["m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"],
  pause: ["M8 5v14M16 5v14"],
  logout: ["M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3", "M10 17l-5-5 5-5M5 12h11"],
  trash: ["M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"],
  globe: [circ(12, 12, 9), "M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"],
  school: ["M2 9l10-5 10 5-10 5z", "M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"],
  sparkle: ["M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"],
} as const;

export type IconName = keyof typeof PATHS;
export const iconNames = Object.keys(PATHS) as IconName[];

type Props = Omit<SVGProps<SVGSVGElement>, "name"> & { name: IconName; size?: number; title?: string; strokeWidth?: number };

export function Icon({ name, size = 24, title, className, strokeWidth = 2, ...rest }: Props) {
  const d = PATHS[name] ?? PATHS.help;
  const labelled = !!title;
  return (
    <svg
      className={["as-icon", className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      {...rest}
    >
      {d.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}
