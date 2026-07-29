"use client";

import * as React from "react";

type BookmarkContextValue = {
  saved: Set<string>;
  toggle: (articleId: string) => void;
  isLoading: boolean;
};

const BookmarkContext = React.createContext<BookmarkContextValue | null>(null);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((json) => {
        setSaved(new Set(json.bookmarks ?? []));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const toggle = React.useCallback((articleId: string) => {
    const isSaved = saved.has(articleId);
    // Optimistic update
    setSaved((prev) => {
      const next = new Set(prev);
      if (isSaved) next.delete(articleId);
      else next.add(articleId);
      return next;
    });
    // Sync with server
    if (isSaved) {
      fetch(`/api/bookmarks?article_id=${articleId}`, { method: "DELETE" }).catch(() => {
        // Revert on failure
        setSaved((prev) => { const next = new Set(prev); next.add(articleId); return next; });
      });
    } else {
      fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: articleId }),
      }).catch(() => {
        setSaved((prev) => { const next = new Set(prev); next.delete(articleId); return next; });
      });
    }
  }, [saved]);

  return (
    <BookmarkContext.Provider value={{ saved, toggle, isLoading }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks(): BookmarkContextValue {
  const ctx = React.useContext(BookmarkContext);
  if (!ctx) throw new Error("useBookmarks must be used within BookmarkProvider");
  return ctx;
}
