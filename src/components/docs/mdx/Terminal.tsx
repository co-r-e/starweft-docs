import type { ReactNode } from "react";

interface TerminalProps {
  title?: string;
  children: ReactNode;
}

export function Terminal({
  title = "Terminal",
  children,
}: TerminalProps): ReactNode {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-[var(--code-line)]">
      {/* Title bar with traffic lights */}
      <div className="flex items-center gap-2 border-b border-[var(--code-line)] bg-[var(--code-bg)] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs font-medium text-[var(--code-ink-soft)]">
          {title}
        </span>
      </div>

      {/* Terminal body */}
      <div className="bg-[var(--code-bg-deep)] p-4 font-mono text-sm leading-relaxed text-[var(--code-ink-soft)]">
        {children}
      </div>
    </div>
  );
}
