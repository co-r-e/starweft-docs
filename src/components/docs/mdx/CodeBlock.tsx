"use client";

import type { ReactNode, HTMLAttributes } from "react";
import { useState, useCallback, useRef } from "react";

interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
  children?: ReactNode;
  "data-language"?: string;
}

const iconProps = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const checkIcon = (
  <svg {...iconProps}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const copyIcon = (
  <svg {...iconProps}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export function CodeBlock({
  children,
  "data-language": language,
  ...rest
}: CodeBlockProps): ReactNode {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = useCallback(() => {
    const text = preRef.current?.textContent ?? "";
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        // Clipboard API failed — silently ignore
      }
    );
  }, []);

  return (
    <div className="group relative my-4 rounded-lg border border-[var(--code-line)] bg-[var(--code-bg)]">
      {language && (
        <div className="flex items-center justify-between border-b border-[var(--code-line)] px-4 py-2">
          <span className="text-xs font-medium text-[var(--code-ink-soft)]">
            {language}
          </span>
        </div>
      )}

      <div className="relative">
        <pre
          ref={preRef}
          {...rest}
          className="overflow-x-auto p-4 text-sm leading-relaxed"
        >
          {children}
        </pre>

        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-2 top-2 rounded-md border border-[var(--code-line)] bg-[var(--code-bg)] px-2 py-1 text-xs text-[var(--code-ink-soft)] opacity-0 transition-opacity duration-150 hover:border-[var(--code-line-strong)] hover:text-white group-hover:opacity-100"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? checkIcon : copyIcon}
        </button>
      </div>
    </div>
  );
}
