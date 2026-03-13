import type { Root, Heading, PhrasingContent } from "mdast";
import type { Plugin } from "unified";
import type { TocEntry } from "./types";

/** Extract plain text from a heading node, stripping MDX/JSX. */
function nodeToPlainText(node: PhrasingContent): string {
  if ("value" in node && typeof node.value === "string") {
    return node.value;
  }
  if ("children" in node && Array.isArray(node.children)) {
    return (node.children as PhrasingContent[]).map(nodeToPlainText).join("");
  }
  return "";
}

function headingToPlainText(heading: Heading): string {
  return heading.children.map(nodeToPlainText).join("");
}

/** Generate a slug from heading text (matches rehype-slug output). */
function textToSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Custom remark plugin that extracts h2 and h3 headings from the MDAST
 * and attaches them to vfile.data.toc as TocEntry[].
 */
export const remarkExtractToc: Plugin<[], Root> = function () {
  return (tree, vfile) => {
    const toc: TocEntry[] = [];

    for (const node of tree.children) {
      if (node.type !== "heading") continue;
      const depth = node.depth;
      if (depth !== 2 && depth !== 3) continue;

      const text = headingToPlainText(node);
      if (!text) continue;

      toc.push({
        id: textToSlug(text),
        text,
        depth: depth as 2 | 3,
      });
    }

    vfile.data.toc = toc;
  };
};
