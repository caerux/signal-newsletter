"use client";

import { useEffect, useRef } from "react";
import { useBookmarks } from "./bookmark-context";

export function KeyboardShortcuts({
  onToggleSidebar,
  onToggleInsight,
}: {
  onToggleSidebar: () => void;
  onToggleInsight: () => void;
}) {
  const { toggle } = useBookmarks();
  const focusedIndexRef = useRef(-1);

  useEffect(() => {
    function getCards(): HTMLElement[] {
      return Array.from(document.querySelectorAll("[data-article-card]"));
    }

    function setFocus(index: number) {
      const cards = getCards();
      if (!cards.length) return;
      const clamped = Math.max(0, Math.min(index, cards.length - 1));
      focusedIndexRef.current = clamped;

      // Visual ring
      cards.forEach((el, i) => {
        if (i === clamped) {
          el.setAttribute("data-focused", "true");
          el.scrollIntoView({ block: "nearest", behavior: "smooth" });
        } else {
          el.removeAttribute("data-focused");
        }
      });
    }

    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (target?.isContentEditable) return;

      switch (e.key) {
        case "[":
          e.preventDefault();
          onToggleSidebar();
          break;
        case "]":
          e.preventDefault();
          onToggleInsight();
          break;
        case "j":
        case "J":
          e.preventDefault();
          setFocus(focusedIndexRef.current + 1);
          break;
        case "k":
        case "K":
          e.preventDefault();
          setFocus(focusedIndexRef.current - 1);
          break;
        case "s":
        case "S": {
          e.preventDefault();
          const cards = getCards();
          const focused = cards[focusedIndexRef.current];
          const articleId = focused?.getAttribute("data-article-card");
          if (articleId) toggle(articleId);
          break;
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, onToggleSidebar, onToggleInsight]);

  return null;
}
