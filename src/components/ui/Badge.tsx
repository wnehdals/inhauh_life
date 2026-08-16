import type { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "danger" | "neutral";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success-bg text-success-text",
  warning: "bg-warning-bg text-warning-text",
  danger: "bg-danger-bg text-danger-text",
  neutral: "bg-surface text-secondary",
};

export function Badge({
  variant = "neutral",
  children,
}: {
  variant?: BadgeVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex h-8 items-center justify-center rounded-full px-3 text-caption font-semibold ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
