"use client";

import * as React from "react";
import { Command } from "cmdk";
import {
  Search,
  Newspaper,
  Bookmark,
  Pencil,
  Flame,
  Sparkles,
  Globe,
  Cpu,
  Database,
  Palette,
  TrendingUp,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";
import { useView, VIEW_LABELS, type AppView } from "./view-context";
import { Kbd } from "@/components/ui";

type Props = {
  onToggleSidebar: () => void;
  onToggleInsight: () => void;
};

export function CommandPalette({ onToggleSidebar, onToggleInsight }: Props) {
  const [open, setOpen] = React.useState(false);
  const { setView } = useView();

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function run(fn: () => void) {
    return () => {
      fn();
      setOpen(false);
    };
  }

  function goView(v: AppView) {
    return run(() => setView(v));
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-start justify-center pt-[12vh]"
      onClick={() => setOpen(false)}
      style={{ background: "rgba(14, 14, 14, 0.35)" }}
    >
      <div
        className="brick w-[min(620px,94vw)] overflow-hidden p-0"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg)",
          animation: "popUp var(--d-reveal) var(--ease-spring) both",
        }}
      >
        <Command label="Signal command menu">
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{
              borderBottom: "var(--bw-2) solid var(--ink)",
              background: "var(--lemon)",
            }}
          >
            <Search size={16} strokeWidth={2.5} />
            <Command.Input
              autoFocus
              placeholder="Search or run a command…"
              className="flex-1 bg-transparent text-[14px] font-semibold outline-none placeholder:text-ink-2/60"
            />
            <Kbd>esc</Kbd>
          </div>

          <Command.List className="max-h-[54vh] overflow-y-auto pane-scroll p-2">
            <Command.Empty className="px-4 py-6 text-center text-[13px] font-medium text-muted">
              Nothing matches. Try another word.
            </Command.Empty>

            <Group heading="Navigate">
              <Item
                icon={<Newspaper size={14} strokeWidth={2.5} />}
                label={VIEW_LABELS.feed}
                shortcut="G F"
                onSelect={goView("feed")}
              />
              <Item
                icon={<Bookmark size={14} strokeWidth={2.5} />}
                label={VIEW_LABELS.saved}
                shortcut="G S"
                onSelect={goView("saved")}
              />
              <Item
                icon={<Pencil size={14} strokeWidth={2.5} />}
                label={VIEW_LABELS.drafts}
                shortcut="G D"
                onSelect={goView("drafts")}
              />
              <Item
                icon={<Flame size={14} strokeWidth={2.5} />}
                label={VIEW_LABELS.trending}
                shortcut="G T"
                onSelect={goView("trending")}
              />
            </Group>

            <Group heading="Actions">
              <Item
                icon={<Sparkles size={14} strokeWidth={2.5} />}
                label="Generate a new idea"
                shortcut="I"
                onSelect={run(() => console.info("[signal] new idea"))}
              />
              <Item
                icon={<PanelLeftClose size={14} strokeWidth={2.5} />}
                label="Toggle sidebar"
                shortcut="["
                onSelect={run(onToggleSidebar)}
              />
              <Item
                icon={<PanelRightClose size={14} strokeWidth={2.5} />}
                label="Toggle insight panel"
                shortcut="]"
                onSelect={run(onToggleInsight)}
              />
            </Group>

            <Group heading="Categories">
              <Item icon={<Flame size={14} strokeWidth={2.5} />} label="Trending" onSelect={goView("trending")} />
              <Item icon={<Globe size={14} strokeWidth={2.5} />} label="World" onSelect={goView("feed")} />
              <Item icon={<Cpu size={14} strokeWidth={2.5} />} label="AI" onSelect={goView("feed")} />
              <Item icon={<Database size={14} strokeWidth={2.5} />} label="Data" onSelect={goView("feed")} />
              <Item icon={<Palette size={14} strokeWidth={2.5} />} label="Design" onSelect={goView("feed")} />
              <Item icon={<TrendingUp size={14} strokeWidth={2.5} />} label="Markets" onSelect={goView("feed")} />
            </Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

function Group({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <Command.Group
      heading={heading}
      className="px-2 pb-2 pt-3 [&_[cmdk-group-heading]]:label-eyebrow [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:px-2"
    >
      {children}
    </Command.Group>
  );
}

function Item({
  icon,
  label,
  shortcut,
  onSelect,
}: {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      value={label}
      onSelect={onSelect}
      className="flex cursor-pointer select-none items-center gap-3 rounded-md px-2 py-2 text-[13px] font-medium aria-selected:bg-lemon data-[selected=true]:bg-lemon"
    >
      <span
        className="grid place-items-center"
        style={{
          width: 26,
          height: 26,
          borderRadius: "var(--r-sm)",
          background: "#ffffff",
          border: "var(--bw-2) solid var(--ink)",
        }}
      >
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {shortcut ? (
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.1em",
            fontWeight: 700,
            color: "var(--muted)",
          }}
        >
          {shortcut}
        </span>
      ) : null}
    </Command.Item>
  );
}
