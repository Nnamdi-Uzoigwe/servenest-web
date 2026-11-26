import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "champagne" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={clsx(
        "inline-flex h-12 items-center justify-center gap-2 rounded-control px-6 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-ink text-champagne hover:bg-ink-deep",
        variant === "champagne" && "bg-champagne text-ink hover:bg-champagne-deep",
        variant === "ghost" && "text-ink hover:bg-champagne",
        className
      )}
    />
  );
}