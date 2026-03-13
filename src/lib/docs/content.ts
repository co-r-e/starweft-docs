import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { frontmatterSchema, sectionMetaSchema } from "./schemas";
import type {
  DocPage,
  DocFrontmatter,
  SidebarNode,
  PageLink,
  BreadcrumbItem,
  SectionMeta,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "docs");
const BASE_URL = "/docs";

/** Only allow alphanumeric, hyphens, and underscores in slug segments. */
const SAFE_SLUG_RE = /^[a-z0-9][a-z0-9_-]*$/i;

function isValidSlugSegment(segment: string): boolean {
  return SAFE_SLUG_RE.test(segment) && !segment.includes("..");
}

/** Validate all slug segments and return a safe file path, or null. */
function resolveContentPath(slugSegments: string[]): string | null {
  if (slugSegments.length === 0) return null;
  for (const segment of slugSegments) {
    if (!isValidSlugSegment(segment)) return null;
  }
  const resolved = path.join(CONTENT_DIR, ...slugSegments);
  // Ensure resolved path is still within CONTENT_DIR
  if (!resolved.startsWith(CONTENT_DIR)) return null;
  return resolved;
}

function isDraft(fm: DocFrontmatter): boolean {
  return fm.draft === true && process.env.NODE_ENV === "production";
}

async function readMeta(dirPath: string): Promise<SectionMeta | null> {
  try {
    const raw = await fs.readFile(path.join(dirPath, "meta.json"), "utf-8");
    return sectionMetaSchema.parse(JSON.parse(raw));
  } catch (err) {
    if (
      err instanceof Error &&
      "code" in err &&
      (err as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return null;
    }
    console.warn(`[docs] Failed to read meta.json in ${dirPath}:`, err);
    return null;
  }
}

async function readFrontmatter(
  filePath: string
): Promise<DocFrontmatter | null> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const { data } = matter(raw);
    return frontmatterSchema.parse(data);
  } catch (err) {
    if (
      err instanceof Error &&
      "code" in err &&
      (err as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return null;
    }
    console.warn(`[docs] Failed to parse frontmatter in ${filePath}:`, err);
    return null;
  }
}

async function isDirectory(dirPath: string): Promise<boolean> {
  try {
    return (await fs.stat(dirPath)).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Recursively collect all pages in a directory, ordered by meta.json.
 * Shared between getAllPages and getPageTree for consistency.
 */
async function collectSection(
  dirPath: string,
  sectionSlug: string
): Promise<{ pages: DocPage[]; sidebarChildren: SidebarNode[] }> {
  const meta = await readMeta(dirPath);
  if (!meta) return { pages: [], sidebarChildren: [] };

  const pages: DocPage[] = [];
  const sidebarChildren: SidebarNode[] = [];

  for (const pageName of meta.pages) {
    if (!isValidSlugSegment(pageName)) {
      console.warn(
        `[docs] Invalid page name "${pageName}" in ${dirPath}/meta.json, skipping`
      );
      continue;
    }

    const mdxPath = path.join(dirPath, `${pageName}.mdx`);
    const fm = await readFrontmatter(mdxPath);
    if (!fm || isDraft(fm)) continue;

    const slug = [sectionSlug, pageName];
    const href = `${BASE_URL}/${slug.join("/")}`;

    pages.push({ slug, frontmatter: fm, filePath: mdxPath });
    sidebarChildren.push({
      title: fm.title,
      href,
      icon: fm.icon,
      badge: fm.badge,
    });
  }

  return { pages, sidebarChildren };
}

/** Returns all documentation pages, sorted by their meta.json ordering. */
export const getAllPages = cache(async (): Promise<DocPage[]> => {
  const rootMeta = await readMeta(CONTENT_DIR);
  if (!rootMeta) return [];

  const pages: DocPage[] = [];

  for (const sectionName of rootMeta.pages) {
    if (!isValidSlugSegment(sectionName)) continue;

    const sectionDir = path.join(CONTENT_DIR, sectionName);

    if (await isDirectory(sectionDir)) {
      const { pages: sectionPages } = await collectSection(
        sectionDir,
        sectionName
      );
      pages.push(...sectionPages);
      continue;
    }

    // Top-level MDX file
    const mdxPath = path.join(CONTENT_DIR, `${sectionName}.mdx`);
    const fm = await readFrontmatter(mdxPath);
    if (!fm || isDraft(fm)) continue;

    pages.push({
      slug: [sectionName],
      frontmatter: fm,
      filePath: mdxPath,
    });
  }

  return pages;
});

/** Returns a single page by its slug segments. */
export const getPageBySlug = cache(
  async (slug: string[]): Promise<DocPage | null> => {
    const basePath = resolveContentPath(slug);
    if (!basePath) return null;

    const filePath = basePath + ".mdx";
    const fm = await readFrontmatter(filePath);
    if (!fm || isDraft(fm)) return null;
    return { slug, frontmatter: fm, filePath };
  }
);

/** Reads the raw MDX source for a page. */
export async function getPageSource(page: DocPage): Promise<string> {
  return fs.readFile(page.filePath, "utf-8");
}

/** Builds the complete sidebar navigation tree from the file system. */
export const getPageTree = cache(async (): Promise<SidebarNode[]> => {
  const rootMeta = await readMeta(CONTENT_DIR);
  if (!rootMeta) return [];

  const tree: SidebarNode[] = [];

  for (const sectionName of rootMeta.pages) {
    if (!isValidSlugSegment(sectionName)) continue;

    const sectionDir = path.join(CONTENT_DIR, sectionName);

    if (await isDirectory(sectionDir)) {
      const sectionMeta = await readMeta(sectionDir);
      if (!sectionMeta) continue;

      const { sidebarChildren } = await collectSection(
        sectionDir,
        sectionName
      );

      // Skip sections with no visible pages
      if (sidebarChildren.length === 0) continue;

      tree.push({
        title: sectionMeta.title,
        icon: sectionMeta.icon,
        children: sidebarChildren,
      });
      continue;
    }

    // Top-level page
    const mdxPath = path.join(CONTENT_DIR, `${sectionName}.mdx`);
    const fm = await readFrontmatter(mdxPath);
    if (!fm || isDraft(fm)) continue;

    tree.push({
      title: fm.title,
      href: `${BASE_URL}/${sectionName}`,
      icon: fm.icon,
      badge: fm.badge,
    });
  }

  return tree;
});

/** Computes prev/next pages for navigation. */
export async function getPrevNextPages(
  slug: string[]
): Promise<{ prev: PageLink | null; next: PageLink | null }> {
  const pages = await getAllPages();
  const currentHref = `${BASE_URL}/${slug.join("/")}`;
  const idx = pages.findIndex(
    (p) => `${BASE_URL}/${p.slug.join("/")}` === currentHref
  );

  // Page not found in the ordered list -- return no links
  if (idx === -1) return { prev: null, next: null };

  return {
    prev:
      idx > 0
        ? {
            title: pages[idx - 1].frontmatter.title,
            href: `${BASE_URL}/${pages[idx - 1].slug.join("/")}`,
          }
        : null,
    next:
      idx < pages.length - 1
        ? {
            title: pages[idx + 1].frontmatter.title,
            href: `${BASE_URL}/${pages[idx + 1].slug.join("/")}`,
          }
        : null,
  };
}

/** Generates breadcrumb items for the given slug. */
export async function getBreadcrumbs(
  slug: string[]
): Promise<BreadcrumbItem[]> {
  const items: BreadcrumbItem[] = [{ label: "Docs", href: BASE_URL }];

  if (slug.length > 1) {
    const safePath = resolveContentPath([slug[0]]);
    if (safePath) {
      const sectionMeta = await readMeta(safePath);
      if (sectionMeta) {
        items.push({ label: sectionMeta.title });
      }
    }
  }

  const page = await getPageBySlug(slug);
  if (page) {
    items.push({ label: page.frontmatter.title });
  }

  return items;
}

/** Returns all valid slug combinations for generateStaticParams. */
export async function getAllSlugs(): Promise<string[][]> {
  const pages = await getAllPages();
  return pages.map((p) => p.slug);
}

/** Returns the first page's slug for default redirect. */
export async function getFirstPageSlug(): Promise<string[] | null> {
  const pages = await getAllPages();
  return pages.length > 0 ? pages[0].slug : null;
}
