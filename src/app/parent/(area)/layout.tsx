import { AppShell } from "@/components/shell/AppShell";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <AppShell area="parent">{children}</AppShell>;
}
