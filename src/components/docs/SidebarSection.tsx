"use client";

import type { ReactNode } from "react";
import { useState, useRef, useEffect, useCallback } from "react";

interface Props {
  title: string;
  icon?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  hasActiveChild: boolean;
}

export function SidebarSection({
  title,
  children,
  defaultOpen = false,
  hasActiveChild,
}: Props): ReactNode {
  const [open, setOpen] = useState(defaultOpen || hasActiveChild);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>(
    defaultOpen || hasActiveChild ? "none" : "0px"
  );

  const updateHeight = useCallback(() => {
    if (!contentRef.current) return;
    if (open) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
      const timeout = setTimeout(() => setMaxHeight("none"), 200);
      return () => clearTimeout(timeout);
    } else {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
      requestAnimationFrame(() => {
        setMaxHeight("0px");
      });
    }
  }, [open]);

  useEffect(() => {
    updateHeight();
  }, [updateHeight]);

  useEffect(() => {
    if (hasActiveChild && !open) {
      requestAnimationFrame(() => setOpen(true));
    }
  }, [hasActiveChild]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] transition hover:text-[var(--ink)]"
        aria-expanded={open}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        >
          <path
            d="M4.5 2.5L8 6L4.5 9.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {title}
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-[max-height] duration-200 ease-in-out"
        style={{ maxHeight }}
      >
        <div className="ml-1 border-l border-[var(--line)] pl-2">
          {children}
        </div>
      </div>
    </div>
  );
}
