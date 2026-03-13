import type { ReactNode } from "react";
import Link from "next/link";

interface LinkCardProps {
  href: string;
  title: string;
  description?: string;
}

export function LinkCard({
  href,
  title,
  description,
}: LinkCardProps): ReactNode {
  return (
    <Link
      href={href}
      className="group my-3 flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--line-strong)]"
    >
      <div>
        <span className="font-semibold text-[var(--ink)] group-hover:text-[var(--accent)]">
          {title}
        </span>
        {description && (
          <p className="mt-1 text-sm text-[var(--ink-soft)]">{description}</p>
        )}
      </div>

      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-[var(--ink-soft)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </Link>
  );
}
