"use client";

import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { InsightPanel } from "./InsightPanel";
import { ViewProvider } from "./view-context";
import { CommandPalette } from "./CommandPalette";

type Collapse = { sb: boolean; ip: boolean };

const STORAGE_KEY = "signal:collapse";

function readInitial(): Collapse {
  if (typeof window === "undefined") return { sb: false, ip: false };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sb: false, ip: false };
    const parsed = JSON.parse(raw) as Partial<Collapse>;
    return { sb: !!parsed.sb, ip: !!parsed.ip };
  } catch {
    return { sb: false, ip: false };
  }
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Collapse>({ sb: false, ip: false });

  useEffect(() => {
    setState(readInitial());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (target?.isContentEditable) return;

      if (e.key === "[") {
        e.preventDefault();
        setState((s) => ({ ...s, sb: !s.sb }));
      } else if (e.key === "]") {
        e.preventDefault();
        setState((s) => ({ ...s, ip: !s.ip }));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleSidebar = () => setState((s) => ({ ...s, sb: !s.sb }));
  const toggleInsight = () => setState((s) => ({ ...s, ip: !s.ip }));

  const sidebarCol = state.sb ? "var(--sidebar-rail-w)" : "var(--sidebar-w)";
  const insightCol = state.ip ? "var(--insight-rail-w)" : "var(--insight-w)";

  return (
    <ViewProvider>
      <div className="h-screen flex flex-col bg-bg text-ink">
        <Navbar />
        <div
          className="grid flex-1 min-h-0 px-6 py-6"
          style={{
            gridTemplateColumns: `${sidebarCol} 1fr ${insightCol}`,
            gap: "var(--gap-lg)",
            transition:
              "grid-template-columns var(--d-slow) var(--ease-spring)",
          }}
        >
          <Sidebar collapsed={state.sb} onToggle={toggleSidebar} />
          <main className="pane-scroll min-w-0 min-h-0 overflow-y-auto overflow-x-hidden pr-2 pb-2">
            {children}
          </main>
          <InsightPanel collapsed={state.ip} onToggle={toggleInsight} />
        </div>
      </div>
      <CommandPalette
        onToggleSidebar={toggleSidebar}
        onToggleInsight={toggleInsight}
      />
    </ViewProvider>
  );
}
