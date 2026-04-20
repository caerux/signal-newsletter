import * as React from "react";
import { cn } from "@/lib/cn";

type KbdProps = React.HTMLAttributes<HTMLElement>;

export function Kbd({ className, ...props }: KbdProps) {
  return <kbd className={cn("kbd", className)} {...props} />;
}
