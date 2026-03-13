import { Children, type ReactNode } from "react";

interface StepsProps {
  children: ReactNode;
}

export function Steps({ children }: StepsProps): ReactNode {
  const steps = Children.toArray(children);

  return (
    <div className="my-6">
      {steps.map((child, i) => (
        <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
          {/* Vertical connecting line */}
          {i < steps.length - 1 && (
            <div className="absolute left-[15px] top-8 bottom-0 w-px bg-[var(--line)]" />
          )}

          {/* Step number circle */}
          <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
            {i + 1}
          </div>

          {/* Step content */}
          <div className="pt-0.5 text-[var(--ink)]">{child}</div>
        </div>
      ))}
    </div>
  );
}
