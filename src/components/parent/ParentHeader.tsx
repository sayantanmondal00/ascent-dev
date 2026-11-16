import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/primitives";
import { student } from "@/lib/data/student";

/* Parent area header: wordmark + "Parent" tag on phones, child picker, inbox with the waiting-request count. */
export function ParentHeader({ requests = 1 }: { requests?: number }) {
  return (
    <header className="row" style={{ gap: 8 }}>
      <span className="phone-only"><Logo size={28} /></span>
      <span className="phone-only label" style={{ padding: "3px 8px", borderRadius: 999, background: "var(--sunken)", color: "var(--ink-muted)", marginRight: "auto" }}>Parent</span>
      <span className="tab-up pill" style={{ marginRight: "auto", height: 44, paddingLeft: 6, fontSize: 15 }} aria-label={`Showing ${student.firstName}, Class ${student.classLevel} ${student.section}`}>
        <span className="avatar" style={{ width: 32, height: 32, fontSize: 14, background: "var(--sunken)", color: "var(--ink)" }} aria-hidden>{student.firstName[0]}</span>
        {student.firstName} · Class {student.classLevel} {student.section}
        <Icon name="chevron-down" size={16} />
      </span>
      <span className="phone-only pill" style={{ height: 44, padding: "0 8px 0 4px" }} aria-label={`Showing ${student.firstName}`}>
        <span className="avatar" style={{ width: 34, height: 34, fontSize: 14, background: "var(--sunken)", color: "var(--ink)" }} aria-hidden>{student.firstName[0]}</span>
        <Icon name="chevron-down" size={16} />
      </span>
      <Link href="/parent/messages" className="icon-btn" style={{ position: "relative" }} aria-label={`Messages${requests ? `, ${requests} request from ${student.firstName}` : ""}`}>
        <Icon name="bell" size={20} />
        {requests > 0 && (
          <span style={{ position: "absolute", top: -4, right: -4, minWidth: 20, height: 20, padding: "0 5px", borderRadius: 10, background: "var(--danger)", color: "var(--on-danger)", fontSize: 12, fontWeight: 700, display: "grid", placeItems: "center" }}>{requests}</span>
        )}
      </Link>
    </header>
  );
}
