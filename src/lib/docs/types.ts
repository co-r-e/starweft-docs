/** Frontmatter parsed from each MDX file. */
export interface DocFrontmatter {
  title: string;
  description: string;
  icon?: string;
  badge?: string;
  /** Whether to show table of contents. Defaults to true. */
  toc?: boolean;
  /** Whether this page is a draft (excluded from production build). */
  draft?: boolean;
}

/** A heading extracted from MDX content for the table of contents. */
export interface TocEntry {
  id: string;
  text: string;
  depth: 2 | 3;
}

/** Metadata for a single documentation page. */
export interface DocPage {
  slug: string[];
  frontmatter: DocFrontmatter;
  filePath: string;
}

/** Configuration for a directory section in the sidebar. */
export interface SectionMeta {
  title: string;
  icon?: string;
  pages: string[];
}

/** A node in the sidebar navigation tree. */
export interface SidebarNode {
  title: string;
  href?: string;
  icon?: string;
  badge?: string;
  children?: SidebarNode[];
}

/** Data for prev/next navigation links. */
export interface PageLink {
  title: string;
  href: string;
}

/** Breadcrumb segment. */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Entry in the search index. */
export interface SearchEntry {
  title: string;
  description: string;
  href: string;
  section: string;
  content: string;
}
