import * as React from "react";
import { cn } from "@/lib/cn";

type TabProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { active, className, type, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      data-active={active ? "true" : "false"}
      className={cn("tab", className)}
      {...props}
    />
  );
});
