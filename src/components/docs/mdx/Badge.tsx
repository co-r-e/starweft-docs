import type { ReactNode } from "react";

type BadgeVariant = "default" | "emerald" | "green" | "yellow" | "red";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--line)] text-[var(--ink-soft)]",
  emerald:
    "bg-[var(--accent-soft)] text-[var(--accent)]",
  green:
    "bg-emerald-500/10 text-[var(--status-green)]",
  yellow:
    "bg-amber-500/10 text-[var(--status-yellow)]",
  red:
    "bg-red-500/10 text-[var(--status-red)]",
};

export function Badge({ variant = "default", children }: BadgeProps): ReactNode {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
