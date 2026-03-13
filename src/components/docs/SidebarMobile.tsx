"use client";

import type { ReactNode } from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { SidebarNode } from "@/lib/docs/types";
import { SidebarSection } from "./SidebarSection";
import { DocsLogo } from "./DocsLogo";

const TRANSITION_MS = 250;

interface Props {
  tree: SidebarNode[];
  currentPath: string;
}

function hasActive(node: SidebarNode, currentPath: string): boolean {
  if (node.href === currentPath) return true;
  return node.children?.some((child) => hasActive(child, currentPath)) ?? false;
}

export function SidebarMobile({ tree, currentPath }: Props): ReactNode {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const open = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    closeTimerRef.current = setTimeout(() => {
      setMounted(false);
      buttonRef.current?.focus();
    }, TRANSITION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") close();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mounted, close]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  useEffect(() => {
    if (!visible || !drawerRef.current) return;

    const drawer = drawerRef.current;
    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
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

    drawer.addEventListener("keydown", handleTab);
    first?.focus();

    return () => drawer.removeEventListener("keydown", handleTab);
  }, [visible]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="shrink-0 p-2 text-[var(--ink-soft)] transition hover:text-[var(--ink)] lg:hidden"
        aria-label="Open navigation"
        aria-expanded={visible}
        onClick={open}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className={`absolute inset-0 bg-black/50 transition-opacity ease-out ${
                visible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDuration: `${TRANSITION_MS}ms` }}
              onClick={close}
              aria-hidden="true"
            />

            <div
              ref={drawerRef}
              role="dialog"
              aria-label="Navigation"
              aria-modal="true"
              className={`absolute inset-y-0 left-0 flex w-72 flex-col border-r border-[var(--line)] bg-[var(--background)] shadow-2xl transition-transform ease-out ${
                visible ? "translate-x-0" : "-translate-x-full"
              }`}
              style={{ transitionDuration: `${TRANSITION_MS}ms` }}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <DocsLogo className="h-5 w-auto" style={{ color: "var(--docs-logo-color)" }} />
                <button
                  type="button"
                  onClick={close}
                  className="rounded-md p-1.5 text-[var(--ink-soft)] transition hover:bg-[var(--line)] hover:text-[var(--ink)]"
                  aria-label="Close navigation"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 pb-8">
                <div className="flex flex-col gap-1">
                  {tree.map((node) => {
                    if (!node.children || node.children.length === 0) {
                      const isActive = node.href === currentPath;
                      return (
                        <Link
                          key={node.href ?? node.title}
                          href={node.href!}
                          onClick={close}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition ${
                            isActive
                              ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                              : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                          }`}
                        >
                          {node.title}
                        </Link>
                      );
                    }

                    return (
                      <SidebarSection
                        key={node.title}
                        title={node.title}
                        icon={node.icon}
                        hasActiveChild={hasActive(node, currentPath)}
                      >
                        {node.children.map((child) => {
                          const isActive = child.href === currentPath;
                          return (
                            <Link
                              key={child.href ?? child.title}
                              href={child.href!}
                              onClick={close}
                              aria-current={isActive ? "page" : undefined}
                              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition ${
                                isActive
                                  ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                                  : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                              }`}
                            >
                              {child.title}
                              {child.badge && (
                                <span className="rounded bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--accent)]">
                                  {child.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </SidebarSection>
                    );
                  })}
                </div>
              </nav>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
