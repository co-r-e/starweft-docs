import type { ReactNode } from "react";
import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/docs/types";

interface Props {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: Props): ReactNode {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 hidden lg:block">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <span
                  className="text-[var(--ink-soft)] select-none"
                  aria-hidden="true"
                >
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className={
                    isLast
                      ? "text-[var(--ink)] font-medium"
                      : "text-[var(--ink-soft)]"
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[var(--ink-soft)] transition hover:text-[var(--ink)]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
