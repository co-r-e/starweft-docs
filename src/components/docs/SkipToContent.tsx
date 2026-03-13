import type { ReactNode } from "react";

export function SkipToContent(): ReactNode {
  return (
    <a
      href="#docs-content"
      className="fixed left-4 top-4 z-50 -translate-y-20 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition focus:translate-y-0"
    >
      Skip to content
    </a>
  );
}
