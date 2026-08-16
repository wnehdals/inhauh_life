import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-content-card border border-hairline bg-canvas ${className}`}
      {...props}
    />
  );
}
