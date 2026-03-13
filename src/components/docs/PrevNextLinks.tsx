import type { ReactNode } from "react";
import Link from "next/link";
import type { PageLink } from "@/lib/docs/types";

interface Props {
  prev: PageLink | null;
  next: PageLink | null;
}

const linkClass =
  "group flex items-center gap-1.5 text-sm text-[var(--ink-soft)] transition hover:text-[var(--accent)]";

function Chevron({ direction }: { direction: "left" | "right" }): ReactNode {
  const d = direction === "left" ? "M10 12L6 8L10 4" : "M6 4L10 8L6 12";
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PrevNextLinks({ prev, next }: Props): ReactNode {
  if (!prev && !next) return null;

  return (
    <nav aria-label="Page navigation" className="mt-16 flex items-center justify-between border-t border-[var(--line)] pt-6">
      {prev ? (
        <Link href={prev.href} className={linkClass}>
          <Chevron direction="left" />
          {prev.title}
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link href={next.href} className={linkClass}>
          {next.title}
          <Chevron direction="right" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
