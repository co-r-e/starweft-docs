import type { ReactNode, HTMLAttributes } from "react";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

function Heading({
  as: Tag,
  children,
  id,
  className,
  ...rest
}: HeadingProps & { as: "h2" | "h3" | "h4" }): ReactNode {
  return (
    <Tag id={id} className={`group scroll-mt-16 ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}

export function H2(props: HeadingProps): ReactNode {
  return (
    <Heading
      as="h2"
      {...props}
      className={`mt-12 mb-4 text-2xl font-bold text-[var(--ink)] ${props.className ?? ""}`}
    />
  );
}

export function H3(props: HeadingProps): ReactNode {
  return (
    <Heading
      as="h3"
      {...props}
      className={`mt-8 mb-3 text-xl font-semibold text-[var(--ink)] ${props.className ?? ""}`}
    />
  );
}

export function H4(props: HeadingProps): ReactNode {
  return (
    <Heading
      as="h4"
      {...props}
      className={`mt-6 mb-2 text-lg font-semibold text-[var(--ink)] ${props.className ?? ""}`}
    />
  );
}
