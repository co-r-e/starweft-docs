import path from "node:path";
import fs from "node:fs/promises";
import matter from "gray-matter";
import { getAllPages } from "../src/lib/docs/content";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "../src/lib/site";

/** Strip MDX syntax from raw source to produce plain text. */
function mdxToPlainText(source: string): string {
  const { content } = matter(source);

  return content
    .replace(/<[^>]+\/?>/g, "")
    .replace(/`{3,}[\s\S]*?`{3,}/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function generateLlmsTxt(): Promise<void> {
  const pages = await getAllPages();
  const outDir = path.join(process.cwd(), "public");

  // --- llms.txt ---
  const sections: Map<string, { title: string; slug: string[] }[]> = new Map();
  for (const page of pages) {
    const section = page.slug.length > 1 ? page.slug[0] : "_root";
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section)!.push({
      title: page.frontmatter.title,
      slug: page.slug,
    });
  }

  let llmsTxt = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} is a distributed multi-agent task coordination CLI built in Rust.
This documentation covers installation, architecture, guides, CLI reference, and security.

## Documentation

`;

  for (const [section, items] of sections) {
    if (section !== "_root") {
      const sectionTitle = section
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      llmsTxt += `### ${sectionTitle}\n\n`;
    }
    for (const item of items) {
      llmsTxt += `- [${item.title}](${SITE_URL}/docs/${item.slug.join("/")})\n`;
    }
    llmsTxt += "\n";
  }

  llmsTxt += `## Links

- [Full documentation text](${SITE_URL}/llms-full.txt)
- [GitHub](https://github.com/starweft/starweft)
`;

  await fs.writeFile(path.join(outDir, "llms.txt"), llmsTxt, "utf-8");
  console.log("llms.txt written");

  // --- llms-full.txt ---
  const fullParts: string[] = [
    `# ${SITE_NAME} — Full Documentation\n`,
    `> ${SITE_DESCRIPTION}\n`,
  ];

  for (const page of pages) {
    const raw = await fs.readFile(page.filePath, "utf-8");
    const plainText = mdxToPlainText(raw);
    fullParts.push(
      `\n---\n\n## ${page.frontmatter.title}\n\nURL: ${SITE_URL}/docs/${page.slug.join("/")}\n\n${plainText}\n`
    );
  }

  await fs.writeFile(
    path.join(outDir, "llms-full.txt"),
    fullParts.join("\n"),
    "utf-8"
  );
  console.log("llms-full.txt written");
}

generateLlmsTxt().catch((err) => {
  console.error("Failed to generate llms.txt:", err);
  process.exit(1);
});
