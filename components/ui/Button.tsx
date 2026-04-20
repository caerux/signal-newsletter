import * as React from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "default" | "primary" | "accent" | "ghost";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  default: "",
  primary: "btn-primary",
  accent: "btn-accent",
  ghost: "btn-ghost",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = "default", className, type, ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn("btn", VARIANT_CLASS[variant], className)}
        {...props}
      />
    );
  }
);
