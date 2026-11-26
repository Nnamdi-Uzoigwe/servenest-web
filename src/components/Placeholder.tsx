import type { ReactNode } from "react";

interface PlaceholderProps {
  title: string;
  note: string;
  children?: ReactNode;
}

// Stand-in for screens built in later steps
export function Placeholder({ title, note, children }: PlaceholderProps) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>
      <p className="mt-2 text-muted">{note}</p>
      {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
    </div>
  );
}