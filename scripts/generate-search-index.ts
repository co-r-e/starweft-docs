import path from "node:path";
import { writeSearchIndex } from "../src/lib/docs/search-index";

const outPath = path.join(process.cwd(), "public", "docs", "search-index.json");

writeSearchIndex(outPath)
  .then(() => {
    console.log(`Search index written to ${outPath}`);
  })
  .catch((err) => {
    console.error("Failed to generate search index:", err);
    process.exit(1);
  });
