import { z } from "zod";

/** Zod schema for MDX frontmatter validation. */
export const frontmatterSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  icon: z.string().optional(),
  badge: z.string().optional(),
  toc: z.boolean().optional().default(true),
  draft: z.boolean().optional().default(false),
});

/** Zod schema for meta.json files. */
export const sectionMetaSchema = z.object({
  title: z.string().min(1),
  icon: z.string().optional(),
  pages: z.array(z.string().min(1)),
});
