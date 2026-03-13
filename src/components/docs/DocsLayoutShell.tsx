"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { SidebarNode, BreadcrumbItem } from "@/lib/docs/types";
import { Sidebar } from "./Sidebar";
import { SidebarMobile } from "./SidebarMobile";

interface Props {
  tree: SidebarNode[];
  children: ReactNode;
}

/** Build breadcrumb trail from the sidebar tree and current path. */
function deriveBreadcrumbs(
  tree: SidebarNode[],
  pathname: string,
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: "Docs", href: "/docs" }];

  for (const section of tree) {
    if (section.href === pathname) {
      items.push({ label: section.title });
      return items;
    }

    if (section.children) {
      for (const child of section.children) {
        if (child.href === pathname) {
          items.push({ label: section.title });
          items.push({ label: child.title });
          return items;
        }
      }
    }
  }

  return items;
}

export function DocsLayoutShell({ tree, children }: Props): ReactNode {
  const pathname = usePathname();
  const breadcrumbs = deriveBreadcrumbs(tree, pathname);

  return (
    <>
      {/* Mobile: sticky sub-header with hamburger + breadcrumb */}
      <div className="sticky top-14 z-30 flex items-center border-b border-[var(--line)] bg-[var(--background)] pl-2 lg:hidden">
        <SidebarMobile tree={tree} currentPath={pathname} />
        <nav
          aria-label="Breadcrumb"
          className="scrollbar-none min-w-0 flex-1 overflow-x-auto"
        >
          <ol className="flex items-center gap-1.5 whitespace-nowrap py-2.5 pr-4 text-sm">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={index} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <span
                      className="select-none text-[var(--ink-soft)]"
                      aria-hidden="true"
                    >
                      /
                    </span>
                  )}
                  {isLast || !item.href ? (
                    <span
                      className={
                        isLast
                          ? "font-medium text-[var(--ink)]"
                          : "text-[var(--ink-soft)]"
                      }
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
      </div>

      {/* Main content area with sidebar */}
      <div className="flex">
        <Sidebar tree={tree} currentPath={pathname} />

        <main id="docs-content" className="min-w-0 flex-1">
          {children}

          {/* Footer */}
          <footer className="border-t border-[var(--line)] px-6 py-8 text-sm text-[var(--ink-soft)] lg:px-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p>&copy; {new Date().getFullYear()} Starweft Contributors. MIT License.</p>
              <div className="flex gap-6">
                <a href="https://github.com/starweft/starweft" className="transition hover:text-[var(--ink)]" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
