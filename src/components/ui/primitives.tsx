import Link from "next/link";
import type { ReactNode, MouseEventHandler } from "react";
import { Icon, type IconName } from "./Icon";
import type { Level, SubjectId } from "@/lib/types";

export function cx(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

/* ---------- Logo: "the Climb" — three steps to a gold summit ---------- */
const STEPS_D = "M13 47H23V37H33V27H43V17";
export function Mark({ tone = "color", size = 40 }: { tone?: "color" | "reversed" | "mono"; size?: number }) {
  const tile = tone === "color";
  return (
    <svg className="as-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden focusable="false">
      {tile && <rect className="as-mk-tile" width={64} height={64} rx={16} />}
      <path className={tone === "mono" ? "as-mk-ink" : "as-mk-white"} d={STEPS_D} fill="none" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <circle className={tone === "mono" ? "as-mk-ink-fill" : "as-mk-gold"} cx={50} cy={13} r={5} />
    </svg>
  );
}

export function Logo({ variant = "lockup", tone = "color", size = 40, className }: { variant?: "lockup" | "mark"; tone?: "color" | "reversed" | "mono"; size?: number; className?: string }) {
  return (
    <span className={cx("as-logo", `as-logo--${tone}`, className)} role="img" aria-label="Ascent">
      <Mark tone={tone} size={size} />
      {variant === "lockup" && (
        <span className="as-logo-word" style={{ fontSize: Math.round(size * 0.72) }} aria-hidden>
          ascent
        </span>
      )}
    </span>
  );
}

/* ---------- Button ---------- */
type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "reward";
  size?: "md" | "lg";
  block?: boolean;
  icon?: IconName;
  iconAfter?: IconName;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};
export function Button({ variant = "primary", size = "md", block, icon, iconAfter, href, onClick, disabled, type = "button", className, children, ...rest }: ButtonProps) {
  const cls = cx("as-btn", `as-btn--${variant}`, `as-btn--${size}`, block && "as-btn--block", className);
  const kids = (
    <>
      {icon && <Icon name={icon} size={20} />}
      <span>{children}</span>
      {iconAfter && <Icon name={iconAfter} size={20} />}
    </>
  );
  if (href && !disabled)
    return (
      <Link className={cls} href={href} aria-label={rest["aria-label"]}>
        {kids}
      </Link>
    );
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} aria-label={rest["aria-label"]}>
      {kids}
    </button>
  );
}

/* ---------- LevelGlyph: 3 bars filled to the level; gold dot when Mastered ---------- */
const LEVEL_COUNT: Record<Level, number> = { none: 0, learning: 1, practised: 2, mastered: 3 };
export function LevelGlyph({ level = "none", size = 16 }: { level?: Level; size?: number }) {
  const n = LEVEL_COUNT[level] ?? 0;
  const bars: [number, number, number][] = [[1, 11, 4], [6, 7, 8], [11, 4, 11]];
  return (
    <svg className={cx("as-glyph", `as-glyph--${level}`)} width={size} height={size} viewBox="0 0 16 16" aria-hidden focusable="false">
      {bars.map((b, i) => (
        <rect key={i} className={i < n ? "as-glyph-on" : "as-glyph-off"} x={b[0] + 0.5} y={b[1] + 0.5} width={3} height={b[2] - 0.5} rx={1} />
      ))}
      {level === "mastered" && <circle className="as-glyph-dot" cx={14} cy={1.9} r={1.7} />}
    </svg>
  );
}

/* ---------- Badge ---------- */
export type BadgeTone = Level | "xp" | "streak" | "danger" | "neutral" | SubjectId;
const BADGE_ICON: Partial<Record<BadgeTone, IconName>> = { xp: "bolt", streak: "flame" };
const MASTERY = new Set(["none", "learning", "practised", "mastered"]);
export function Badge({ tone = "neutral", icon, children, className }: { tone?: BadgeTone; icon?: IconName; children: ReactNode; className?: string }) {
  const ic = icon ?? BADGE_ICON[tone];
  const glyph = MASTERY.has(tone) && !icon ? <LevelGlyph level={tone as Level} size={14} /> : null;
  return (
    <span className={cx("as-badge", `as-badge--${tone}`, className)}>
      {glyph || (ic ? <Icon name={ic} size={14} /> : null)}
      {children}
    </span>
  );
}

export const LEVEL_LABEL: Record<Level, string> = { none: "Not started", learning: "Learning", practised: "Practised", mastered: "Mastered" };
export function LevelBadge({ level }: { level: Level }) {
  return <Badge tone={level}>{LEVEL_LABEL[level]}</Badge>;
}

/* ---------- Chip ---------- */
export function Chip({ icon, children, onClick, pressed, href, className, gold }: { icon?: IconName; children: ReactNode; onClick?: () => void; pressed?: boolean; href?: string; className?: string; gold?: boolean }) {
  const kids = (
    <>
      {icon && <Icon name={icon} size={16} />}
      <span>{children}</span>
    </>
  );
  if (href)
    return (
      <Link href={href} className={cx("as-chip", "as-chip--button", className)}>
        {kids}
      </Link>
    );
  if (!onClick && pressed === undefined) return <span className={cx("as-chip", gold && "as-chip--gold", className)}>{kids}</span>;
  return (
    <button type="button" className={cx("as-chip", "as-chip--button", pressed && "is-pressed", className)} aria-pressed={pressed ? "true" : "false"} onClick={onClick}>
      {kids}
    </button>
  );
}

/* ---------- ProgressBar ---------- */
export function ProgressBar({ value = 0, max = 100, tone = "pine", label = "Progress", className }: { value?: number; max?: number; tone?: "pine" | Level | "gold" | "hero"; label?: string; className?: string }) {
  const v = Math.max(0, Math.min(max, value));
  const pct = Math.round((v / max) * 100);
  return (
    <div className={cx("as-bar", `as-bar--${tone}`, className)} role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={v} aria-label={label}>
      <div className="as-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ---------- MasteryBar ---------- */
const LEVELS: [keyof MasteryCounts, string][] = [["mastered", "Mastered"], ["practised", "Practised"], ["learning", "Learning"], ["notStarted", "Not started"]];
export type MasteryCounts = { mastered?: number; practised?: number; learning?: number; notStarted?: number };
export function MasteryBar({ showLegend, label, ...counts }: MasteryCounts & { showLegend?: boolean; label?: string }) {
  const total = LEVELS.reduce((s, l) => s + (counts[l[0]] ?? 0), 0);
  const text = LEVELS.map((l) => `${counts[l[0]] ?? 0} ${l[1].toLowerCase()}`).join(", ");
  return (
    <div className="as-mbar-wrap">
      <div className="as-mbar" role="img" aria-label={(label ? label + ": " : "") + text}>
        {total > 0 &&
          LEVELS.map((l) => {
            const n = counts[l[0]] ?? 0;
            return n ? <div key={l[0]} className={`as-mbar-seg as-mbar-seg--${l[0]}`} style={{ flexGrow: n }} /> : null;
          })}
      </div>
      {showLegend && (
        <div className="as-mbar-legend" aria-hidden>
          {LEVELS.map((l) => (
            <span key={l[0]}>
              <span className={`as-swatch as-swatch--${l[0]}`} />
              {(counts[l[0]] ?? 0) + " " + l[1].toLowerCase()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- XPRing: daily goal ---------- */
export function XPRing({ value = 0, goal = 60, size = 64 }: { value?: number; goal?: number; size?: number }) {
  const v = Math.max(0, Math.min(goal, value));
  const r = 28;
  const c = 2 * Math.PI * r;
  return (
    <div className="as-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 68 68" role="img" aria-label={`${value} of ${goal} XP today`}>
        <circle className="as-ring-track" cx={34} cy={34} r={r} fill="none" strokeWidth={8} />
        <circle className="as-ring-fill" cx={34} cy={34} r={r} fill="none" strokeWidth={8} strokeLinecap="round" strokeDasharray={`${((c * v) / goal).toFixed(1)} ${c.toFixed(1)}`} transform="rotate(-90 34 34)" />
      </svg>
      <span className="as-ring-value" aria-hidden>
        {value}
      </span>
    </div>
  );
}

/* ---------- SubjectMark ---------- */
const SUBJECT: Record<SubjectId, [string, string]> = { maths: ["M", "Maths"], physics: ["P", "Physics"], chemistry: ["C", "Chemistry"] };
export function SubjectMark({ subject, size = 40, solid }: { subject: SubjectId; size?: number; solid?: boolean }) {
  const s = SUBJECT[subject];
  return (
    <span className={cx("as-subject", `as-subject--${subject}`, solid && "as-subject--solid")} style={{ width: size, height: size, fontSize: Math.round(size * 0.45) }} role="img" aria-label={s[1]}>
      {s[0]}
    </span>
  );
}

/* ---------- StatTile ---------- */
export function StatTile({ value, label, sub, trend, tone }: { value: ReactNode; label: string; sub?: string; trend?: "up"; tone?: "gold" }) {
  return (
    <div className={cx("as-stat", tone === "gold" && "as-stat--gold")}>
      <span className="as-stat-value">{value}</span>
      <span className="as-stat-label">{label}</span>
      {sub && <span className={cx("as-stat-sub", trend === "up" && "is-up")}>{sub}</span>}
    </div>
  );
}

/* ---------- LeaderboardRow ---------- */
export function LeaderboardRow({ rank, name, xp, detail, isYou }: { rank: number | string; name: string; xp: number | string; detail?: string; isYou?: boolean }) {
  return (
    <div className={cx("as-lrow", isYou && "is-you")}>
      <span className="as-lrow-rank">#{rank}</span>
      <span className="as-lrow-name">
        <span>{isYou ? "You" : name}</span>
        {detail && <span className="as-lrow-detail">{detail}</span>}
      </span>
      <span className="as-lrow-xp">{xp} XP</span>
    </div>
  );
}

/* ---------- WeeklyChart: every bar carries its value; dashed goal line ---------- */
export function WeeklyChart({ title, data, goal, highlight, unit = "min", note }: { title?: string; data: { label: string; value: number }[]; goal?: number; highlight?: number; unit?: string; note?: string }) {
  const max = Math.max(...data.map((d) => d.value), goal ?? 0, 1);
  const W = 320, H = 150, top = 22, bottom = 22, gap = 10;
  const bw = (W - gap * (data.length - 1)) / Math.max(1, data.length);
  const y = (v: number) => top + (H - top - bottom) * (1 - v / max);
  const summary = (title ? title + ". " : "") + data.map((d) => `${d.label} ${d.value} ${unit}`).join(", ");
  return (
    <figure className="as-chart">
      {title && <figcaption className="as-chart-title">{title}</figcaption>}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={summary} preserveAspectRatio="xMidYMid meet">
        <line className="as-chart-base" x1={0} x2={W} y1={H - bottom} y2={H - bottom} />
        {goal ? <line className="as-chart-goal" x1={0} x2={W} y1={y(goal)} y2={y(goal)} /> : null}
        {data.map((d, i) => {
          const x = i * (bw + gap);
          const yy = y(d.value);
          return (
            <g key={i}>
              <rect className={cx("as-chart-bar", i === highlight && "is-hi")} x={x} y={yy} width={bw} height={Math.max(2, H - bottom - yy)} rx={4} />
              <text className="as-chart-val" x={x + bw / 2} y={yy - 6} textAnchor="middle">
                {d.value}
              </text>
              <text className="as-chart-lbl" x={x + bw / 2} y={H - 6} textAnchor="middle">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      {(note || goal) && <p className="as-chart-note">{note ?? `Dashed line: daily goal of ${goal} ${unit}`}</p>}
    </figure>
  );
}

/* ---------- EmptyState / Skeleton / OfflineBanner ---------- */
export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="as-empty">
      <svg width={72} height={56} viewBox="0 0 72 56" aria-hidden>
        <path className="as-empty-steps" d="M6 50H22V38H38V26H54V14" fill="none" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <circle className="as-empty-dot" cx={62} cy={8} r={5} />
      </svg>
      <h3 className="as-empty-title">{title}</h3>
      {body && <p className="as-empty-body">{body}</p>}
      {action}
    </div>
  );
}

export function Skeleton({ variant = "line", width, height }: { variant?: "line" | "block" | "card"; width?: string; height?: string }) {
  if (variant === "card")
    return (
      <div className="as-skel-card" aria-hidden>
        <div className="as-skel" style={{ width: "40%", height: 14 }} />
        <div className="as-skel" style={{ width: "85%", height: 20 }} />
        <div className="as-skel" style={{ width: "100%", height: 8 }} />
      </div>
    );
  return <div className="as-skel" aria-hidden style={{ width: width ?? "100%", height: height ?? (variant === "block" ? 120 : 14) }} />;
}

export function OfflineBanner({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="as-offline" role="status">
      <Icon name="wifi-off" size={20} />
      <span className="as-offline-msg">{message ?? "You're offline. Saved notes and flashcards still work."}</span>
      {onRetry && (
        <button type="button" className="as-offline-retry" onClick={onRetry}>
          <Icon name="refresh" size={16} />
          Retry
        </button>
      )}
    </div>
  );
}
