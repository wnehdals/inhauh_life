import type { InputHTMLAttributes } from "react";

type InputVariant = "filled" | "outlined";

const variantClasses: Record<InputVariant, string> = {
  filled: "bg-surface",
  outlined: "bg-canvas border border-hairline",
};

export function Input({
  variant = "filled",
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { variant?: InputVariant }) {
  return (
    <input
      className={`h-12 w-full rounded-card px-4 text-body text-foreground placeholder:text-muted focus:outline-2 focus:outline-primary ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
