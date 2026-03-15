import type { ReactNode } from "react";

interface ApiTableRow {
  flag: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

interface ApiTableProps {
  data: ApiTableRow[];
}

export function ApiTable({ data }: ApiTableProps): ReactNode {
  if (!data) return null;
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-[var(--line)]">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[var(--surface)]">
            <th className="border-b border-[var(--line)] px-4 py-3 text-left font-semibold text-[var(--ink)]">
              Flag
            </th>
            <th className="border-b border-[var(--line)] px-4 py-3 text-left font-semibold text-[var(--ink)]">
              Type
            </th>
            <th className="border-b border-[var(--line)] px-4 py-3 text-left font-semibold text-[var(--ink)]">
              Default
            </th>
            <th className="border-b border-[var(--line)] px-4 py-3 text-left font-semibold text-[var(--ink)]">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.flag}
              className="border-b border-[var(--line)] last:border-b-0"
            >
              <td className="px-4 py-3">
                <code className="font-mono text-[var(--accent)]">
                  {row.flag}
                </code>
                {row.required && (
                  <span className="ml-1 text-[var(--status-red)]" title="Required">
                    *
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-[var(--ink-soft)]">
                {row.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-[var(--ink-soft)]">
                {row.default ?? "\u2014"}
              </td>
              <td className="px-4 py-3 text-[var(--ink-soft)]">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
