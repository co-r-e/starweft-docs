import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Starweft | Distributed Multi-Agent Task Coordination CLI",
  description:
    "Starweft is a P2P CLI tool for distributed multi-agent task coordination. Powered by Ed25519 signing, SQLite, and OpenClaw integration.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${figtree.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
