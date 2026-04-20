import * as React from "react";
import { cn } from "@/lib/cn";
import { FILL_VAR, type Fill } from "@/lib/tokens";

type ChipProps = React.HTMLAttributes<HTMLSpanElement> & {
  fill?: Fill;
};

export function Chip({ fill, className, style, ...props }: ChipProps) {
  const mergedStyle: React.CSSProperties | undefined = fill
    ? { background: FILL_VAR[fill], ...style }
    : style;

  return <span className={cn("chip", className)} style={mergedStyle} {...props} />;
}
