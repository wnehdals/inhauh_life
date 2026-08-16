import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "text-link" | "danger";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-canvas rounded-action hover:opacity-90 disabled:bg-surface disabled:text-muted disabled:opacity-100",
  secondary:
    "bg-surface text-foreground rounded-card hover:opacity-80 disabled:text-muted disabled:opacity-100",
  "text-link": "text-foreground hover:text-primary",
  danger:
    "bg-danger-bg text-danger-text rounded-action hover:opacity-80 disabled:text-muted disabled:opacity-100",
};

const baseClasses =
  "inline-flex h-12 items-center justify-center px-6 text-body font-semibold transition-colors disabled:cursor-not-allowed";

type CommonProps = {
  variant?: ButtonVariant;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (props.href) {
    const { href, ...anchorProps } = props;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {props.children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {props.children}
    </button>
  );
}
