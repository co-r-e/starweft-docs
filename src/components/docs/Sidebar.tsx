import type { ReactNode } from "react";
import Link from "next/link";
import type { SidebarNode } from "@/lib/docs/types";
import { SidebarSection } from "./SidebarSection";

interface Props {
  tree: SidebarNode[];
  currentPath: string;
}

function hasActive(node: SidebarNode, currentPath: string): boolean {
  if (node.href === currentPath) return true;
  return node.children?.some((child) => hasActive(child, currentPath)) ?? false;
}

function SidebarLink({
  node,
  currentPath,
}: {
  node: SidebarNode;
  currentPath: string;
}): ReactNode {
  const isActive = node.href === currentPath;

  return (
    <Link
      href={node.href!}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition ${
        isActive
          ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
          : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
      }`}
    >
      {node.title}
      {node.badge && (
        <span className="rounded bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--accent)]">
          {node.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar({ tree, currentPath }: Props): ReactNode {
  return (
    <nav
      aria-label="Documentation sidebar"
      className="sticky top-14 hidden w-60 shrink-0 overflow-y-auto border-r border-[var(--line)] pt-6 pb-8 pl-4 pr-3 lg:block"
      style={{ maxHeight: "calc(100vh - 3.5rem)" }}
    >
      <div className="flex flex-col gap-1">
        {tree.map((node) => {
          if (!node.children || node.children.length === 0) {
            return (
              <SidebarLink
                key={node.href ?? node.title}
                node={node}
                currentPath={currentPath}
              />
            );
          }

          return (
            <SidebarSection
              key={node.title}
              title={node.title}
              icon={node.icon}
              hasActiveChild={hasActive(node, currentPath)}
            >
              {node.children.map((child) => (
                <SidebarLink
                  key={child.href ?? child.title}
                  node={child}
                  currentPath={currentPath}
                />
              ))}
            </SidebarSection>
          );
        })}
      </div>
    </nav>
  );
}
