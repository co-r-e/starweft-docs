"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { DocsLogo } from "./DocsLogo";

interface Props {
  onSearchOpen: () => void;
}

const backChevron = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 12L2 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function DocsHeader({ onSearchOpen }: Props): ReactNode {
  const [shortcutKey, setShortcutKey] = useState("\u2318K");
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
      if (!/Mac|iPhone|iPad/.test(navigator.userAgent)) {
        setShortcutKey("Ctrl+K");
      }
    });
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  function toggleTheme(): void {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--line)] bg-[var(--background)]/80 px-4 backdrop-blur-lg lg:px-6">
      {/* Left: Logo */}
      <Link href="/docs" className="flex items-center" aria-label="Starweft Docs home">
        <DocsLogo className="h-7 w-auto" style={{ color: "var(--docs-logo-color)" }} />
      </Link>

      {/* Right: Search, Theme toggle, GitHub, Back to site */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSearchOpen}
          className="flex items-center gap-2 rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--ink-soft)] transition hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden rounded border border-[var(--line)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--ink-soft)] sm:inline">
            {shortcutKey}
          </kbd>
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg p-2 text-[var(--ink-soft)] transition hover:text-[var(--ink)]"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Desktop: text back link */}
        <Link
          href="/"
          className="hidden items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-[var(--ink-soft)] transition hover:text-[var(--ink)] sm:flex"
        >
          {backChevron}
          Back to site
        </Link>

        {/* Mobile: icon-only back link */}
        <Link
          href="/"
          className="rounded-lg p-2 text-[var(--ink-soft)] transition hover:text-[var(--ink)] sm:hidden"
          aria-label="Back to site"
        >
          {backChevron}
        </Link>
      </div>
    </header>
  );
}
