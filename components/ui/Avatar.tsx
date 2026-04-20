import * as React from "react";
import { cn } from "@/lib/cn";
import { FILL_VAR, type Fill } from "@/lib/tokens";

type AvatarProps = {
  initial: string;
  size?: number;
  fill?: Fill;
  className?: string;
  title?: string;
};

export function Avatar({
  initial,
  size = 40,
  fill = "lavender",
  className,
  title,
}: AvatarProps) {
  const letter = initial.trim().charAt(0).toUpperCase() || "\u00B7";
  return (
    <div
      className={cn("grid place-items-center font-bold select-none", className)}
      title={title}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: FILL_VAR[fill],
        border: "var(--bw-3) solid var(--ink)",
        boxShadow: "var(--sh-sm)",
        fontSize: Math.round(size * 0.38),
      }}
    >
      {letter}
    </div>
  );
}
