import type { ReactNode, SVGProps } from "react";

/**
 * Inline SVG logo for the Starweft docs site.
 * Text-based "Starweft" with a network node icon.
 * Uses `currentColor` so the parent can control color via CSS.
 */
export function DocsLogo(props: SVGProps<SVGSVGElement>): ReactNode {
  return (
    <svg
      viewBox="0 0 160 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Network node icon */}
      <circle cx="14" cy="14" r="4" fill="currentColor" />
      <circle cx="4" cy="8" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="24" cy="8" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="4" cy="20" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="24" cy="20" r="2" fill="currentColor" opacity="0.5" />
      <line x1="14" y1="14" x2="4" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="14" y1="14" x2="24" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="14" y1="14" x2="4" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="14" y1="14" x2="24" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* "Starweft" text */}
      <text x="34" y="20" fill="currentColor" fontFamily="var(--font-figtree), system-ui, sans-serif" fontSize="18" fontWeight="700" letterSpacing="-0.02em">
        Starweft
      </text>
    </svg>
  );
}
