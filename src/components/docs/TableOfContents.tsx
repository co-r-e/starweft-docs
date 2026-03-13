"use client";

import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";
import type { TocEntry } from "@/lib/docs/types";

interface Props {
  entries: TocEntry[];
}

export function TableOfContents({ entries }: Props): ReactNode {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (entries.length === 0) return;

    const headingIds = entries.map((e) => e.id);
    const visibleSet = new Set<string>();

    observerRef.current = new IntersectionObserver(
      (intersections) => {
        for (const entry of intersections) {
          if (entry.isIntersecting) {
            visibleSet.add(entry.target.id);
          } else {
            visibleSet.delete(entry.target.id);
          }
        }

        const topmost = headingIds.find((id) => visibleSet.has(id));
        if (topmost) {
          setActiveId(topmost);
        }
      },
      {
        rootMargin: "0px 0px -75% 0px",
        threshold: 0,
      }
    );

    const elements = headingIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    for (const el of elements) {
      observerRef.current.observe(el);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [entries]);

  if (entries.length === 0) return null;

  function handleClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ): void {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
      window.history.replaceState(null, "", `#${id}`);
    }
  }

  return (
    <div className="hidden w-52 shrink-0 xl:block">
      <div
        className="sticky top-14 overflow-y-auto pt-6 pb-8 pl-4"
        style={{ maxHeight: "calc(100vh - 3.5rem)" }}
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
          On this page
        </p>
        <ul className="flex flex-col gap-1">
          {entries.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                onClick={(e) => handleClick(e, entry.id)}
                className={`block rounded-md py-1 text-sm leading-snug transition ${
                  entry.depth === 3 ? "ml-3" : ""
                } ${
                  activeId === entry.id
                    ? "font-medium text-[var(--accent)]"
                    : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                }`}
              >
                {entry.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
