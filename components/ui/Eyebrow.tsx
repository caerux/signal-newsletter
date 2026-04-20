import * as React from "react";
import { cn } from "@/lib/cn";

type EyebrowProps = React.HTMLAttributes<HTMLSpanElement>;

export function Eyebrow({ className, ...props }: EyebrowProps) {
  return <span className={cn("label-eyebrow", className)} {...props} />;
}
