import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  getPageBySlug,
  getPageSource,
  getAllSlugs,
  getPrevNextPages,
  getBreadcrumbs,
  getFirstPageSlug,
} from "@/lib/docs/content";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { compileMdx } from "@/lib/docs/mdx";
import { Breadcrumb } from "@/components/docs/Breadcrumb";
import { PrevNextLinks } from "@/components/docs/PrevNextLinks";
import { TableOfContents } from "@/components/docs/TableOfContents";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

/** Generate static paths for all documentation pages. */
export async function generateStaticParams(): Promise<{ slug?: string[] }[]> {
  const slugs = await getAllSlugs();
  return [{ slug: [] }, ...slugs.map((slug) => ({ slug }))];
}

/** Generate metadata for each documentation page. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return {
      title: "Documentation | Starweft",
      description: "Starweft documentation and guides.",
      alternates: { canonical: `${SITE_URL}/docs` },
    };
  }

  const page = await getPageBySlug(slug);
  if (!page) {
    return { title: "Not Found | Starweft Docs" };
  }

  const { title, description } = page.frontmatter;
  const url = `${SITE_URL}/docs/${slug.join("/")}`;

  return {
    title: `${title} | Starweft Docs`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Starweft Docs`,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
    },
  };
}

export default async function DocsPage({ params }: Props): Promise<ReactNode> {
  const { slug } = await params;

  // No slug -> redirect to the first page in the docs tree
  if (!slug || slug.length === 0) {
    const firstSlug = await getFirstPageSlug();
    redirect(firstSlug ? `/docs/${firstSlug.join("/")}` : "/");
  }

  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const source = await getPageSource(page);
  const { content, frontmatter, toc } = await compileMdx(source);
  const [breadcrumbs, { prev, next }] = await Promise.all([
    getBreadcrumbs(slug),
    getPrevNextPages(slug),
  ]);

  const showToc = frontmatter.toc !== false && toc.length > 0;

  // JSON-LD structured data for SEO
  const pageUrl = `${SITE_URL}/docs/${slug.join("/")}`;
  const jsonLd = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: frontmatter.title,
      description: frontmatter.description,
      url: pageUrl,
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.label,
        ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
      })),
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <div className="flex">
        {/* Content column */}
        <article className="min-w-0 flex-1 px-6 pt-6 pb-16 lg:px-10">
          <Breadcrumb items={breadcrumbs} />

          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]">
              {frontmatter.title}
            </h1>
            {frontmatter.description && (
              <p className="mt-2 text-lg text-[var(--ink-soft)]">
                {frontmatter.description}
              </p>
            )}
          </header>

          {/* MDX content */}
          <div className="prose-docs max-w-3xl">{content}</div>

          <PrevNextLinks prev={prev} next={next} />
        </article>

        {/* Table of Contents */}
        {showToc && <TableOfContents entries={toc} />}
      </div>
    </>
  );
}
