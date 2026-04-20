import { AppShell } from "@/components/shell/AppShell";

export default function AppRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
