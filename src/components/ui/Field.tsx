import clsx from "clsx";
import type { InputHTMLAttributes, ReactNode } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  // Something inside the right edge of the input, for example a show password button
  trailing?: ReactNode;
}

export function Field({ label, name, error, hint, trailing, className, ...props }: FieldProps) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;

  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-body">
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          id={name}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={clsx(
            "h-12 w-full rounded-control border-2 bg-field px-4 text-base text-body outline-none placeholder:text-subtle focus:bg-white",
            error ? "border-danger" : "border-transparent focus:border-ink",
            trailing && "pr-12",
            className
          )}
        />
        {trailing ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">{trailing}</div>
        ) : null}
      </div>

      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}