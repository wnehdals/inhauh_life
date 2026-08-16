import type { ButtonHTMLAttributes } from "react";

export function FloatingButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`fixed right-6 bottom-6 z-40 flex h-14 items-center gap-2 rounded-full bg-primary px-5 text-body font-semibold text-canvas shadow-floating transition-opacity hover:opacity-90 ${className}`}
      {...props}
    />
  );
}
