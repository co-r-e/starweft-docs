import type { ReactNode } from "react";
import Link from "next/link";

export default function NotFound(): ReactNode {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] text-[var(--ink)]">
      <p className="text-6xl font-bold">404</p>
      <p className="mt-4 text-[var(--ink-soft)]">Page Not Found</p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-[var(--line-strong)] px-5 py-2 text-sm font-semibold transition-colors hover:bg-[rgba(255,255,255,0.06)]"
      >
        Go Home
      </Link>
    </div>
  );
}
