import * as React from "react";
import { cn } from "@/lib/cn";
import { SIGNAL_LABEL, type Signal } from "@/lib/tokens";

type StickerProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  kind: Signal;
  /** Override the default emoji+label. */
  children?: React.ReactNode;
};

export function Sticker({ kind, className, children, ...props }: StickerProps) {
  return (
    <span className={cn("sticker", `sticker-${kind}`, className)} {...props}>
      {children ?? SIGNAL_LABEL[kind]}
    </span>
  );
}
