"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink, RotateCw, X } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { cloudinaryFit } from "@/lib/cloudinary";

export interface GalleryDocument {
  id: string;
  url: string;
  label: string;
  name: string;
  uploaded: string;
}

export function DocumentGallery({ documents }: { documents: GalleryDocument[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const open = index !== null;
  const current = index !== null ? documents[index] : null;

  const move = useCallback(
    (step: number) => {
      setIndex((i) => (i === null ? i : (i + step + documents.length) % documents.length));
      setRotation(0);
    },
    [documents.length]
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, move]);

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2">
        {documents.map((doc, i) => (
          <li key={doc.id}>
            <button
              type="button"
              onClick={() => {
                setRotation(0);
                setIndex(i);
              }}
              className="group block w-full text-left"
              aria-label={`View ${doc.label}`}
            >
              <span className="relative block aspect-4/3 overflow-hidden rounded-panel border border-line bg-field">
                <Image
                  src={cloudinaryFit(doc.url, 640)}
                  alt={doc.name}
                  fill
                  unoptimized
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform group-hover:scale-[1.02]"
                />
              </span>
              <span className="mt-2 block font-medium text-ink">{doc.label}</span>
              <span className="block text-sm text-muted">Uploaded {doc.uploaded}</span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={open} onClose={() => setIndex(null)} label="Document viewer" size="lg">
        {current ? (
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{current.label}</p>
                <p className="text-xs text-muted">
                  {(index ?? 0) + 1} of {documents.length}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  aria-label="Rotate image"
                  className="grid size-10 place-items-center rounded-control text-ink hover:bg-champagne"
                >
                  <RotateCw className="size-5" aria-hidden />
                </button>
                <a
                  href={current.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open the original in a new tab"
                  className="grid size-10 place-items-center rounded-control text-ink hover:bg-champagne"
                >
                  <ExternalLink className="size-5" aria-hidden />
                </a>
                <button
                  type="button"
                  onClick={() => setIndex(null)}
                  aria-label="Close"
                  className="grid size-10 place-items-center rounded-control text-ink hover:bg-champagne"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>
            </div>

            <div className="relative flex min-h-[60dvh] items-center justify-center overflow-auto bg-ink-deep p-4">
              {/* A plain img on purpose: the size is not known, and Cloudinary already resizes it */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cloudinaryFit(current.url, 1600)}
                alt={current.name}
                style={{ transform: `rotate(${rotation}deg)` }}
                className="max-h-[70dvh] max-w-full object-contain transition-transform duration-200"
              />

              {documents.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    aria-label="Previous document"
                    className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink hover:bg-white"
                  >
                    <ChevronLeft className="size-6" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    aria-label="Next document"
                    className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink hover:bg-white"
                  >
                    <ChevronRight className="size-6" aria-hidden />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </Dialog>
    </>
  );
}