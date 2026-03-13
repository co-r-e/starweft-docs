import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { getAllPages } from "./content";
import type { SearchEntry } from "./types";

/** Strip MDX syntax from raw source to produce plain text for indexing. */
function mdxToPlainText(source: string): string {
  // Remove frontmatter
  const { content } = matter(source);

  return (
    content
      // Remove JSX/MDX component tags
      .replace(/<[^>]+\/?>/g, "")
      // Remove code fences - handles nested backticks (3+ ticks)
      .replace(/`{3,}[\s\S]*?`{3,}/g, "")
      // Remove inline code backticks
      .replace(/`([^`]+)`/g, "$1")
      // Remove Markdown heading markers
      .replace(/^#{1,6}\s+/gm, "")
      // Remove bold/italic markers
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
      // Remove links, keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove images
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, "")
      // Decode HTML entities
      .replace(/&[a-z]+;/gi, " ")
      .replace(/&#\d+;/g, " ")
      // Collapse whitespace
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

/** Build the search index from all pages. */
export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const pages = await getAllPages();
  const entries: SearchEntry[] = [];

  for (const page of pages) {
    const raw = await fs.readFile(page.filePath, "utf-8");
    const plainText = mdxToPlainText(raw);
    // Limit content to ~500 words for index size
    const truncated = plainText.split(/\s+/).slice(0, 500).join(" ");

    const section = page.slug.length > 1 ? page.slug[0] : "";

    entries.push({
      title: page.frontmatter.title,
      description: page.frontmatter.description,
      href: `/docs/${page.slug.join("/")}`,
      section: formatSectionName(section),
      content: truncated,
    });
  }

  return entries;
}

function formatSectionName(slug: string): string {
  if (!slug) return "Docs";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Write the search index to a JSON file. */
export async function writeSearchIndex(outPath: string): Promise<void> {
  const entries = await buildSearchIndex();
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(entries), "utf-8");
}
