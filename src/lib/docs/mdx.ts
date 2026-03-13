import type { ReactNode } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { Options as PrettyCodeOptions } from "rehype-pretty-code";
import { remarkExtractToc } from "./toc";
import { frontmatterSchema } from "./schemas";
import { getMdxComponents } from "@/components/docs/mdx";
import type { DocFrontmatter, TocEntry } from "./types";

export interface CompileResult {
  content: ReactNode;
  frontmatter: DocFrontmatter;
  toc: TocEntry[];
}

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "one-dark-pro",
  keepBackground: true,
  defaultLang: "plaintext",
};

export async function compileMdx(source: string): Promise<CompileResult> {
  let extractedToc: TocEntry[] = [];

  const { content, frontmatter } = await compileMDX<DocFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          [
            remarkExtractToc,
            // The plugin writes toc to vfile.data; we capture it via a wrapper.
          ],
          () => (_tree, vfile) => {
            extractedToc = (vfile.data.toc as TocEntry[]) ?? [];
          },
        ],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["heading-anchor"],
                ariaHidden: false,
              },
            },
          ],
          [rehypePrettyCode, prettyCodeOptions],
        ],
      },
    },
    components: getMdxComponents(),
  });

  let validated: DocFrontmatter;
  try {
    validated = frontmatterSchema.parse(frontmatter);
  } catch (err) {
    throw new Error(
      `Invalid frontmatter: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  return {
    content,
    frontmatter: validated,
    toc: extractedToc,
  };
}
