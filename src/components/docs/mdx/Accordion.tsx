import type { ReactNode } from "react";

interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function Accordion({
  title,
  defaultOpen = false,
  children,
}: AccordionProps): ReactNode {
  return (
    <details
      className="group my-2 border-b border-[var(--line)]"
      open={defaultOpen || undefined}
    >
      <summary className="flex cursor-pointer select-none items-center justify-between py-3 text-[var(--ink)] hover:text-[var(--accent)]">
        <span className="font-medium">{title}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 transition-transform duration-200 group-open:rotate-180"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>
      <div className="pb-4 text-sm leading-relaxed text-[var(--ink-soft)]">
        {children}
      </div>
    </details>
  );
}
