import type { ReactNode } from "react";
import { getPageTree } from "@/lib/docs/content";
import { SkipToContent } from "@/components/docs/SkipToContent";
import { SearchProvider } from "@/components/docs/SearchProvider";
import { DocsHeaderWrapper } from "@/components/docs/DocsHeaderWrapper";
import { DocsLayoutShell } from "@/components/docs/DocsLayoutShell";
import { DocsThemeProvider } from "@/components/docs/DocsThemeProvider";

interface Props {
  children: ReactNode;
}

export default async function DocsLayout({ children }: Props): Promise<ReactNode> {
  const tree = await getPageTree();

  return (
    <DocsThemeProvider>
      <SearchProvider>
        <div className="docs-root min-h-screen bg-[var(--background)] font-[family-name:var(--font-figtree)] text-[var(--ink)]">
          <SkipToContent />
          <DocsHeaderWrapper />

          <DocsLayoutShell tree={tree}>
            {children}
          </DocsLayoutShell>
        </div>
      </SearchProvider>
    </DocsThemeProvider>
  );
}
