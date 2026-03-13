"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type { SearchEntry } from "@/lib/docs/types";

const TRANSITION_MS = 200;

interface Props {
  open: boolean;
  onClose: () => void;
}

interface GroupedResults {
  section: string;
  entries: SearchEntry[];
}

type OramaModule = typeof import("@orama/orama");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OramaDb = any;

/** Group search entries by their section field. */
function groupBySection(entries: SearchEntry[]): GroupedResults[] {
  const map = new Map<string, SearchEntry[]>();
  for (const entry of entries) {
    const section = entry.section || "Docs";
    const group = map.get(section);
    if (group) {
      group.push(entry);
    } else {
      map.set(section, [entry]);
    }
  }
  return Array.from(map.entries()).map(([section, items]) => ({
    section,
    entries: items,
  }));
}

/** Truncate a string to a maximum character length at a word boundary. */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const truncated = text.slice(0, max);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

export function SearchModal({ open, onClose }: Props): ReactNode {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const triggerRef = useRef<Element | null>(null);

  const dbRef = useRef<OramaDb | null>(null);
  const oramaRef = useRef<OramaModule | null>(null);
  const initPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      setQuery("");
      setResults([]);
      setSelectedIndex(0);

      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else if (mounted) {
      setVisible(false);
      closeTimerRef.current = setTimeout(() => {
        setMounted(false);
        if (triggerRef.current instanceof HTMLElement) {
          triggerRef.current.focus();
        }
      }, TRANSITION_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const initSearch = useCallback(() => {
    if (initPromiseRef.current) return initPromiseRef.current;

    const promise = (async () => {
      setStatus("loading");

      try {
        const [orama, indexResponse] = await Promise.all([
          import("@orama/orama"),
          fetch("/docs/search-index.json"),
        ]);

        if (!indexResponse.ok) {
          throw new Error(
            `Failed to fetch search index: ${indexResponse.status}`
          );
        }

        const entries: SearchEntry[] = await indexResponse.json();

        const schema = {
          id: "string" as const,
          title: "string" as const,
          description: "string" as const,
          content: "string" as const,
          href: "string" as const,
          section: "string" as const,
        };

        const db = orama.create({ schema });

        for (const entry of entries) {
          orama.insert(db, {
            id: entry.href,
            title: entry.title,
            description: entry.description,
            content: entry.content,
            href: entry.href,
            section: entry.section,
          });
        }

        oramaRef.current = orama;
        dbRef.current = db;
        setStatus("ready");
      } catch (err) {
        console.error("Search index init failed:", err);
        setStatus("error");
        initPromiseRef.current = null;
      }
    })();

    initPromiseRef.current = promise;
    return promise;
  }, []);

  useEffect(() => {
    if (open && !dbRef.current) {
      void initSearch();
    }
  }, [open, initSearch]);

  useEffect(() => {
    if (!open || status !== "ready" || !dbRef.current || !oramaRef.current)
      return;

    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const timer = setTimeout(() => {
      const orama = oramaRef.current;
      const db = dbRef.current;
      if (!orama || !db) return;

      try {
        const maybeResult = orama.search(db, {
          term: query,
          limit: 20,
        });

        const extractHits = (result: {
          hits: { document: Record<string, unknown> }[];
        }): SearchEntry[] =>
          result.hits.map((hit) => ({
            title: hit.document.title as string,
            description: hit.document.description as string,
            href: hit.document.href as string,
            section: hit.document.section as string,
            content: hit.document.content as string,
          }));

        if (maybeResult instanceof Promise) {
          void maybeResult.then((r) => {
            setResults(extractHits(r));
            setSelectedIndex(0);
          });
        } else {
          setResults(extractHits(maybeResult));
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query, open, status]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  useEffect(() => {
    if (!visible || !modalRef.current) return;

    const modal = modalRef.current;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'a[href], button, input, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleTab(e: KeyboardEvent): void {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    modal.addEventListener("keydown", handleTab);
    modal.querySelector<HTMLElement>("input")?.focus();

    return () => modal.removeEventListener("keydown", handleTab);
  }, [visible]);

  useEffect(() => {
    if (!mounted) return;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mounted, onClose]);

  const flatResults = results;

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < flatResults.length - 1 ? prev + 1 : 0
          );
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : flatResults.length - 1
          );
          break;
        }
        case "Enter": {
          e.preventDefault();
          const selected = flatResults[selectedIndex];
          if (selected) {
            navigate(selected.href);
          }
          break;
        }
      }
    },
    [flatResults, selectedIndex, navigate]
  );

  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    if (selected) {
      selected.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!mounted) return null;

  const grouped = groupBySection(flatResults);

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search documentation">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: `${TRANSITION_MS}ms` }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex items-start justify-center pt-[15vh] px-4">
        <div
          ref={modalRef}
          className={`relative w-full max-w-lg rounded-xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl transition-all ease-out ${
            visible
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0"
          }`}
          style={{ transitionDuration: `${TRANSITION_MS}ms` }}
          onKeyDown={handleKeyDown}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
              className="shrink-0 text-[var(--ink-soft)]"
              aria-hidden="true"
            >
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documentation..."
              className="min-w-0 flex-1 bg-transparent text-lg text-[var(--ink)] placeholder:text-[var(--ink-soft)] outline-none"
              aria-label="Search documentation"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {/* Results area */}
          <div ref={listRef} className="max-h-80 overflow-y-auto">
            {status === "loading" && (
              <div className="px-4 py-8 text-center text-sm text-[var(--ink-soft)]">
                Loading search index...
              </div>
            )}

            {status === "error" && (
              <div className="px-4 py-8 text-center text-sm text-[var(--ink-soft)]">
                Failed to load search index. Please try again.
              </div>
            )}

            {status === "ready" && !query.trim() && (
              <div className="px-4 py-8 text-center text-sm text-[var(--ink-soft)]">
                Type to search documentation...
              </div>
            )}

            {status === "ready" &&
              query.trim() &&
              flatResults.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-[var(--ink-soft)]">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              )}

            {status === "ready" && grouped.length > 0 && (
              <div className="py-2">
                {grouped.map((group) => {
                  const groupStartIndex = flatResults.indexOf(group.entries[0]);

                  return (
                    <div key={group.section}>
                      <div className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">
                        {group.section}
                      </div>
                      {group.entries.map((entry, i) => {
                        const flatIdx = groupStartIndex + i;
                        const isSelected = flatIdx === selectedIndex;

                        return (
                          <button
                            key={entry.href}
                            type="button"
                            data-index={flatIdx}
                            onClick={() => navigate(entry.href)}
                            onMouseEnter={() => setSelectedIndex(flatIdx)}
                            className={`flex w-full flex-col gap-0.5 px-4 py-2.5 text-left transition-colors ${
                              isSelected
                                ? "bg-[var(--accent-soft)]"
                                : "hover:bg-[var(--accent-soft)]"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[var(--ink)]">
                                {entry.title}
                              </span>
                              <span className="rounded bg-[var(--line)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--ink-soft)]">
                                {entry.section}
                              </span>
                            </div>
                            {entry.description && (
                              <span className="text-sm text-[var(--ink-soft)]">
                                {truncate(entry.description, 120)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with keyboard hints */}
          <div className="flex items-center justify-between border-t border-[var(--line)] px-4 py-2 text-xs text-[var(--ink-soft)]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-[var(--line)] px-1 py-0.5 font-mono text-[10px]">
                  &uarr;
                </kbd>
                <kbd className="rounded border border-[var(--line)] px-1 py-0.5 font-mono text-[10px]">
                  &darr;
                </kbd>
                <span className="ml-0.5">navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-[var(--line)] px-1 py-0.5 font-mono text-[10px]">
                  &crarr;
                </kbd>
                <span className="ml-0.5">open</span>
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[var(--line)] px-1 py-0.5 font-mono text-[10px]">
                esc
              </kbd>
              <span className="ml-0.5">close</span>
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
