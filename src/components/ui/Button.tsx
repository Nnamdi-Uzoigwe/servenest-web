import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "champagne" | "ghost" | "outline" | "danger";
export type ButtonSize = "md" | "sm";

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function buttonClasses({ variant = "primary", size = "md", className }: ButtonStyleOptions = {}) {
  return clsx(
    "inline-flex items-center justify-center gap-2 rounded-control text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
    size === "md" ? "h-12 px-6" : "h-10 px-4",
    variant === "primary" && "bg-ink text-champagne hover:bg-ink-deep",
    variant === "champagne" && "bg-champagne text-ink hover:bg-champagne-deep",
    variant === "ghost" && "text-ink hover:bg-champagne",
    variant === "outline" && "border-2 border-line text-ink hover:bg-paper",
    variant === "danger" && "bg-danger text-white hover:opacity-90",
    className
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return <button type={type} {...props} className={buttonClasses({ variant, size, className })} />;
}