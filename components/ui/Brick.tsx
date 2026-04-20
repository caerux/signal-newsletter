import * as React from "react";
import { cn } from "@/lib/cn";
import { FILL_VAR, type Fill } from "@/lib/tokens";

type BrickVariant = "solid" | "flat" | "inverted";

type BrickProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: BrickVariant;
  fill?: Fill;
};

const VARIANT_CLASS: Record<BrickVariant, string> = {
  solid: "brick",
  flat: "brick-flat",
  inverted: "brick-inverted",
};

export function Brick({
  variant = "solid",
  fill,
  className,
  style,
  ...props
}: BrickProps) {
  const mergedStyle: React.CSSProperties | undefined =
    fill && variant !== "inverted"
      ? { background: FILL_VAR[fill], ...style }
      : style;

  return (
    <div
      className={cn(VARIANT_CLASS[variant], className)}
      style={mergedStyle}
      {...props}
    />
  );
}
