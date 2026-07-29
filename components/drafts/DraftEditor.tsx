"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Copy,
  Download,
  Check,
  ArrowLeft,
  Save,
  Trash2,
} from "lucide-react";
import { Button, Chip, Eyebrow } from "@/components/ui";
import { relativeTime } from "@/lib/relativeTime";
import type { Fill } from "@/lib/tokens";

type Status = "draft" | "ready" | "published";

const STATUS_FILL: Record<Status, Fill> = {
  draft: "sky",
  ready: "mint",
  published: "lemon",
};

type Props = {
  id: string;
  initialTitle: string;
  initialBody: string;
  initialStatus: Status;
  updatedAt: string;
};

const AUTOSAVE_DELAY = 1200;

export function DraftEditor({ id, initialTitle, initialBody, initialStatus, updatedAt }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [status, setStatus] = useState<Status>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(updatedAt);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    async (overrides?: Partial<{ title: string; body_md: string; status: Status }>) => {
      setSaving(true);
      await fetch(`/api/drafts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body_md: body, status, ...overrides }),
      });
      setSavedAt(new Date().toISOString());
      setSaving(false);
    },
    [id, title, body, status]
  );

  // Debounced auto-save on every keystroke
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(), AUTOSAVE_DELAY);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [title, body, save]);

  function handleCopy() {
    const md = `# ${title}\n\n${body}`;
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleDelete() {
    if (!confirm("Delete this draft? This can't be undone.")) return;
    await fetch(`/api/drafts/${id}`, { method: "DELETE" });
    router.push("/");
  }

  function handleExport() {
    const md = `# ${title}\n\n${body}`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function cycleStatus() {
    const next: Status = status === "draft" ? "ready" : status === "ready" ? "published" : "draft";
    setStatus(next);
    await save({ status: next });
  }

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4 pb-12"
    >
      {/* Toolbar */}
      <div
        className="sticky top-0 z-10 flex items-center gap-2 py-3 -mx-2 px-2"
        style={{ background: "var(--bg)", borderBottom: "2px dashed rgba(14,14,14,0.12)" }}
      >
        <Button onClick={() => router.back()}>
          <ArrowLeft size={14} strokeWidth={2.5} />
          Back
        </Button>

        <button type="button" onClick={cycleStatus} title="Cycle status">
          <Chip fill={STATUS_FILL[status]} style={{ cursor: "pointer", textTransform: "uppercase", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" }}>
            {status}
          </Chip>
        </button>

        <div className="flex-1" />

        <span
          className="font-mono text-[10px] font-bold tracking-widest text-muted"
        >
          {saving ? "SAVING…" : `SAVED ${relativeTime(savedAt).toUpperCase()} AGO`}
          {" · "}
          {wordCount.toLocaleString()} WORDS
        </span>

        <Button onClick={() => save()}>
          <Save size={13} strokeWidth={2.5} />
          Save
        </Button>

        <Button onClick={handleCopy}>
          {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2.5} />}
          {copied ? "Copied!" : "Copy MD"}
        </Button>

        <Button onClick={handleExport}>
          <Download size={13} strokeWidth={2.5} />
          Export .md
        </Button>

        <Button onClick={handleDelete} style={{ color: "var(--hot)" }}>
          <Trash2 size={13} strokeWidth={2.5} />
          Delete
        </Button>
      </div>

      {/* Title */}
      <textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        rows={1}
        className="w-full resize-none bg-transparent font-display font-bold leading-[1.1] outline-none placeholder:text-ink/20"
        style={{ fontSize: 40, letterSpacing: "-0.025em", border: "none" }}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "auto";
          el.style.height = `${el.scrollHeight}px`;
        }}
      />

      {/* Eyebrow metadata */}
      <Eyebrow className="text-muted">
        Markdown draft · {wordCount} words
      </Eyebrow>

      <div style={{ borderTop: "2px dashed rgba(14,14,14,0.15)" }} />

      {/* Body */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={"Start writing…\n\nUse Markdown: **bold**, *italic*, ## headings, - lists, > blockquotes"}
        className="w-full min-h-[60vh] resize-none bg-transparent font-ui text-[15px] leading-[1.7] outline-none placeholder:text-ink/20"
        style={{ border: "none" }}
        spellCheck
      />
    </motion.div>
  );
}
