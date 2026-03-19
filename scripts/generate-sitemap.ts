import path from "node:path";
import fs from "node:fs/promises";
import { getAllPages } from "../src/lib/docs/content";
import { SITE_URL } from "../src/lib/site";

async function generateSitemap(): Promise<void> {
  const pages = await getAllPages();
  const today = new Date().toISOString().split("T")[0];

  const urls = [
    `  <url>\n    <loc>${SITE_URL}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`,
    ...pages.map(
      (page) =>
        `  <url>\n    <loc>${SITE_URL}/docs/${page.slug.join("/")}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
    ),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  const outPath = path.join(process.cwd(), "public", "sitemap.xml");
  await fs.writeFile(outPath, sitemap, "utf-8");
  console.log(`Sitemap written to ${outPath} (${urls.length} URLs)`);
}

generateSitemap().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});
