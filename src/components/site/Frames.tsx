import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import clsx from "clsx";
import Image from "next/image";
import type { ReactNode } from "react";

interface ShotProps {
  file: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  fallback?: ReactNode;
}

// If the screenshot exists in public/screens it is shown. Until then a placeholder stands in.
function Shot({ file, alt, sizes, priority, fallback }: ShotProps) {
  const exists = existsSync(path.join(process.cwd(), "public", "screens", file));

  if (exists) {
    return (
      <Image
        src={`/screens/${file}`}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-top"
      />
    );
  }

  return (
    <div role="img" aria-label={alt} className="absolute inset-0">
      {fallback ?? (
        <div className="flex h-full flex-col items-center justify-center gap-2 bg-champagne p-6 text-center">
          <p className="text-sm font-semibold text-ink">Screenshot goes here</p>
          <p className="text-xs text-muted">public/screens/{file}</p>
        </div>
      )}
    </div>
  );
}

interface FrameProps {
  file: string;
  alt: string;
  priority?: boolean;
  fallback?: ReactNode;
  className?: string;
}

export function PhoneFrame({ file, alt, priority, fallback, className }: FrameProps) {
  return (
    <div
      className={clsx(
        "relative w-65 shrink-0 rounded-[2.5rem] border-10 border-ink-deep bg-ink-deep ring-1 ring-champagne/20",
        className
      )}
    >
      <span
        className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink-deep"
        aria-hidden
      />
      <div className="relative aspect-9/19.5 overflow-hidden rounded-[1.9rem] bg-paper">
        <Shot file={file} alt={alt} priority={priority} sizes="240px" fallback={fallback} />
      </div>
    </div>
  );
}

export function BrowserFrame({ file, alt, priority, fallback, className }: FrameProps) {
  return (
    <div className={clsx("overflow-hidden rounded-panel border border-line bg-white", className)}>
      <div className="flex items-center gap-1.5 border-b border-line bg-paper px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-champagne-deep" aria-hidden />
        <span className="size-2.5 rounded-full bg-champagne-deep" aria-hidden />
        <span className="size-2.5 rounded-full bg-champagne-deep" aria-hidden />
        <span className="ml-3 text-xs text-subtle">ServeNest Admin</span>
      </div>

      <div className="relative aspect-16/10 bg-field">
        <Shot
          file={file}
          alt={alt}
          priority={priority}
          sizes="(min-width: 1024px) 540px, 100vw"
          fallback={fallback}
        />
      </div>
    </div>
  );
}