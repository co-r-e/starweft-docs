"use client";

import type { ReactNode } from "react";
import { DocsHeader } from "./DocsHeader";
import { useSearch } from "./SearchProvider";

export function DocsHeaderWrapper(): ReactNode {
  const { open } = useSearch();
  return <DocsHeader onSearchOpen={open} />;
}
