import type { MDXComponents } from "mdx/types";
import { H2, H3, H4 } from "./Heading";
import { CodeBlock } from "./CodeBlock";
import { Image } from "./Image";
import { Table } from "./Table";
import { Callout } from "./Callout";
import { Steps } from "./Steps";
import { Tabs } from "./Tabs";
import { Terminal } from "./Terminal";
import { LinkCard } from "./LinkCard";
import { Accordion } from "./Accordion";
import { ApiTable } from "./ApiTable";
import { Badge } from "./Badge";
import { FileTree } from "./FileTree";

/**
 * Returns the full set of custom MDX component overrides for the docs site.
 * Passed to `compileMDX` in the content layer.
 */
export function getMdxComponents(): MDXComponents {
  return {
    // Standard HTML overrides
    h2: H2,
    h3: H3,
    h4: H4,
    pre: CodeBlock,
    img: Image as MDXComponents["img"],
    table: Table,

    // Custom components available in MDX files
    Image,
    Callout,
    Steps,
    Tabs,
    Terminal,
    LinkCard,
    Accordion,
    ApiTable,
    Badge,
    FileTree,
  };
}
