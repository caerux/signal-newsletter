"use client";

import * as React from "react";

export type AppView = "feed" | "saved" | "drafts" | "trending";

type ViewContextValue = {
  view: AppView;
  setView: (v: AppView) => void;
};

const ViewContext = React.createContext<ViewContextValue | null>(null);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = React.useState<AppView>("feed");
  const value = React.useMemo(() => ({ view, setView }), [view]);
  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}

export function useView(): ViewContextValue {
  const ctx = React.useContext(ViewContext);
  if (!ctx) throw new Error("useView must be used within a ViewProvider");
  return ctx;
}

export const VIEW_LABELS: Record<AppView, string> = {
  feed: "Feed",
  saved: "Saved",
  drafts: "Drafts",
  trending: "Trending",
};
