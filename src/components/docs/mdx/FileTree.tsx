import type { ReactNode } from "react";

interface FileTreeNode {
  name: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
  highlight?: boolean;
}

interface FileTreeProps {
  data: FileTreeNode[];
}

function FolderIcon(): ReactNode {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-[var(--ink-soft)]"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function FileIcon(): ReactNode {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-[var(--ink-soft)]"
    >
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  );
}

function TreeNode({
  node,
  depth,
}: {
  node: FileTreeNode;
  depth: number;
}): ReactNode {
  const paddingLeft = depth * 20;

  return (
    <>
      <div
        className="flex items-center gap-2 py-0.5"
        style={{ paddingLeft }}
      >
        {node.type === "directory" ? <FolderIcon /> : <FileIcon />}
        <span
          className={`text-sm ${
            node.highlight
              ? "font-medium text-[var(--accent)]"
              : "text-[var(--ink-soft)]"
          }`}
        >
          {node.name}
        </span>
      </div>
      {node.children?.map((child) => (
        <TreeNode key={child.name} node={child} depth={depth + 1} />
      ))}
    </>
  );
}

export function FileTree({ data }: FileTreeProps): ReactNode {
  return (
    <div className="my-6 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 font-mono">
      {data.map((node) => (
        <TreeNode key={node.name} node={node} depth={0} />
      ))}
    </div>
  );
}
