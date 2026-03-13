import type { ReactNode, TableHTMLAttributes } from "react";

export function Table({
  children,
  ...rest
}: TableHTMLAttributes<HTMLTableElement>): ReactNode {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-[var(--line)]">
      <table
        className="w-full border-collapse text-sm text-[var(--ink)] [&_th]:border-b [&_th]:border-[var(--line)] [&_th]:bg-[var(--surface)] [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_td]:px-4 [&_td]:py-3 [&_td]:text-[var(--ink-soft)] [&_tr:not(:last-child)_td]:border-b [&_tr:not(:last-child)_td]:border-[var(--line)]"
        {...rest}
      >
        {children}
      </table>
    </div>
  );
}
