"use client";

import { Children, useState, type ReactNode } from "react";

/* ---------- OsTabs ---------- */

interface OsTabsProps {
  items: string;
  children: ReactNode;
}

export function OsTabs({ items, children }: OsTabsProps): ReactNode {
  const labels = items.split(",").map((s) => s.trim());
  const [active, setActive] = useState(0);
  const panels = Children.toArray(children);

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              i === active
                ? "bg-[var(--accent)] text-white"
                : "border border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div>{panels[active]}</div>
    </div>
  );
}

/* ---------- FeatureIcon ---------- */

interface FeatureIconProps {
  children: ReactNode;
}

export function FeatureIcon({ children }: FeatureIconProps): ReactNode {
  return (
    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
      {children}
    </div>
  );
}
