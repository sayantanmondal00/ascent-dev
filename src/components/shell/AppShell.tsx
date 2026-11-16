"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/primitives";
import { Toggle } from "@/components/ui/forms";
import { student } from "@/lib/data/student";

type NavItem = { href: string; label: string; icon: IconName; match: (p: string) => boolean };

const STUDENT_NAV: NavItem[] = [
  { href: "/today", label: "Today", icon: "home", match: (p) => p.startsWith("/today") },
  { href: "/learn/physics", label: "Learn", icon: "book", match: (p) => p.startsWith("/learn") },
  { href: "/me", label: "Me", icon: "user", match: (p) => p.startsWith("/me") },
];

const PARENT_NAV: NavItem[] = [
  { href: "/parent/home", label: "This week", icon: "home", match: (p) => p === "/parent/home" },
  { href: "/parent/progress", label: "Progress", icon: "chart", match: (p) => p.startsWith("/parent/progress") },
  { href: "/parent/plan", label: "Plan", icon: "calendar", match: (p) => p.startsWith("/parent/plan") },
  { href: "/parent/settings", label: "Settings", icon: "settings", match: (p) => p.startsWith("/parent/settings") },
];

/* Phone: bottom tab bar. 768–1099: icon rail. 1100+: sidebar with streak, XP and the data-saver switch. */
export function AppShell({ children, area = "student", showStats = true }: { children: ReactNode; area?: "student" | "parent"; showStats?: boolean }) {
  const path = usePathname() ?? "";
  const nav = area === "parent" ? PARENT_NAV : STUDENT_NAV;
  const [saver, setSaver] = useState(true);
  return (
    <div className="app">
      <div className="shell">
        <nav className="side" aria-label="Main">
          <Link href={area === "parent" ? "/parent/home" : "/today"} className="side-brand" aria-label="Ascent home">
            <Logo size={40} />
          </Link>
          {area === "parent" && <div className="desk-only label muted" style={{ margin: "-4px 10px 14px" }}>Parent area</div>}
          {nav.map((it) => (
            <Link key={it.href} href={it.href} className="side-link" aria-current={it.match(path) ? "page" : undefined}>
              <Icon name={it.icon} size={24} />
              {it.label}
            </Link>
          ))}
          <div className="side-foot">
            {area === "student" && showStats && (
              <div className="panel panel-gold" style={{ gap: 4, padding: "12px 14px", borderRadius: 14 }}>
                <span className="strong">{student.streakDays}-day streak</span>
                <span className="small muted">
                  Level {student.level} · {student.xpTotal.toLocaleString("en-IN")} XP
                </span>
              </div>
            )}
            {area === "student" ? (
              <Toggle checked={saver} onChange={setSaver} label="Data saver" description={saver ? "Videos play at 240p" : "Videos play at 360p"} />
            ) : (
              <>
                <div className="row" style={{ gap: 10, padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 14 }}>
                  <span className="avatar" style={{ width: 36, height: 36, background: "var(--sunken)", color: "var(--ink)" }} aria-hidden>{student.firstName[0]}</span>
                  <div className="grow">
                    <div className="strong" style={{ fontSize: 14 }}>{student.firstName}</div>
                    <div className="label muted" style={{ fontWeight: 400 }}>Class {student.classLevel} {student.section} · St Mary&apos;s</div>
                  </div>
                </div>
                <Link href="/parent" className="as-btn as-btn--secondary" style={{ borderColor: "var(--line)" }}>
                  <Icon name="swap" size={18} />
                  Switch to {student.firstName}
                </Link>
              </>
            )}
          </div>
        </nav>
        <div className="main">
          {children}
          <nav className="tabbar" aria-label="Main">
            {nav.map((it) => (
              <Link key={it.href} href={it.href} className="tab" aria-current={it.match(path) ? "page" : undefined}>
                <Icon name={it.icon} size={24} />
                {it.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

/* Header row for student app pages: wordmark (phone), search, streak and XP chips, avatar. */
export function StudentHeader({ showStats = true }: { showStats?: boolean }) {
  return (
    <header className="row" style={{ gap: 8 }}>
      <span className="phone-only" style={{ marginRight: "auto" }}>
        <Logo size={30} />
      </span>
      <label className="tab-up search" style={{ marginRight: "auto" }}>
        <Icon name="search" size={20} />
        <span className="sr">Search</span>
        <input type="search" placeholder="Search topics, formulas, questions" />
      </label>
      <Link href="/coming-soon?what=Search" className="icon-btn phone-only" aria-label="Search">
        <Icon name="search" size={20} />
      </Link>
      {showStats && (
        <>
          <span className="stat-chip gold below-desk" aria-label={`${student.streakDays} day streak`}>
            <Icon name="flame" size={16} />
            {student.streakDays}
          </span>
          <span className="stat-chip pine below-desk hide-xs" aria-label={`${student.xpTotal} XP`}>
            <Icon name="bolt" size={16} />
            {student.xpTotal.toLocaleString("en-IN")}
          </span>
        </>
      )}
      <Link href="/me" className="avatar" aria-label="Me: your progress and settings">
        {student.firstName[0]}
      </Link>
    </header>
  );
}
