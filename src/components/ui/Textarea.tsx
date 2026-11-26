import clsx from "clsx";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, name, error, hint, className, ...props }: TextareaProps) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;

  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-body">
        {label}
      </label>

      <textarea
        {...props}
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={clsx(
          "w-full resize-y rounded-control border-2 bg-field px-4 py-3 text-base text-body outline-none placeholder:text-subtle focus:bg-white",
          error ? "border-danger" : "border-transparent focus:border-ink",
          className
        )}
      />

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