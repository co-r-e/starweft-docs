"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";

/**
 * Docs-scoped theme provider.
 *
 * next-themes writes `data-theme` to `<html>`, and our CSS variables
 * are keyed on `[data-theme="light"]`. On unmount (i.e. navigating away
 * from /docs via client-side routing), we remove the attribute so that
 * non-docs pages fall back to the :root dark defaults.
 */
export function DocsThemeProvider({ children }: { children: ReactNode }): ReactNode {
  useEffect(() => {
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, []);

  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      storageKey="docs-theme"
    >
      {children}
    </ThemeProvider>
  );
}
