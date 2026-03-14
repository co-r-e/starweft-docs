import type { ReactNode } from "react";
import Link from "next/link";
import { OsTabs } from "@/components/lp";

/* ---------- shared style constants ---------- */

const TERMINAL_BLOCK = "overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 font-mono text-xs leading-6 text-white sm:text-sm";
const SECTION_LABEL = "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)]";
const BTN_PRIMARY = "inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90";
const BTN_OUTLINE = "inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[rgba(255,255,255,0.06)]";

/* ---------- helper components ---------- */

type ShellLineProps = { prompt?: string; children: ReactNode };

function ShellLine({ prompt = "$", children }: ShellLineProps): ReactNode {
  return (
    <div className="whitespace-nowrap">
      <span className="mr-2 text-white/50">{prompt}</span>
      {children}
    </div>
  );
}

type ShellCommentProps = { first?: boolean; children: ReactNode };

function ShellComment({ first = false, children }: ShellCommentProps): ReactNode {
  return (
    <div className={`whitespace-nowrap${first ? "" : " mt-3"}`}>
      <span className="mr-2 text-white/50">#</span>
      <span className="text-white/40">{children}</span>
    </div>
  );
}

/* ---------- features ---------- */

const features = [
  {
    title: "Peer-to-Peer Architecture",
    description: "No central server. All nodes communicate directly via libp2p or local mailbox transport.",
  },
  {
    title: "Ed25519 Signing",
    description: "Every message is cryptographically signed with Ed25519. Canonical JSON ensures deterministic verification.",
  },
  {
    title: "Multi-Agent Task Coordination",
    description: "Principal, Owner, Worker, and Relay roles collaborate to decompose visions into executable tasks.",
  },
  {
    title: "OpenClaw Integration",
    description: "Workers execute tasks via OpenClaw bridge, enabling autonomous AI agent execution with progress reporting.",
  },
  {
    title: "SQLite Event Sourcing",
    description: "All events are persisted to a local SQLite database with WAL mode for reliable, append-only storage.",
  },
  {
    title: "Cross-Platform",
    description: "Runs on Linux, macOS, and Windows with platform-aware defaults for transport and data directories.",
  },
  {
    title: "Task Lifecycle Management",
    description: "Full lifecycle from vision submission through planning, assignment, execution, evaluation, and completion.",
  },
  {
    title: "Zero Infrastructure Cost",
    description: "Everything runs on your local machine. No cloud services, no databases to manage, no monthly bills.",
  },
];

/* ---------- FAQ ---------- */

const faqItems = [
  {
    q: "What is Starweft?",
    a: "Starweft is a distributed multi-agent task coordination CLI built in Rust. It enables multiple AI agents to collaborate on complex tasks using a P2P architecture.",
  },
  {
    q: "Do I need a server?",
    a: "No. Starweft is fully peer-to-peer. Nodes communicate via local Unix sockets or libp2p TCP. There is no central server.",
  },
  {
    q: "What is OpenClaw?",
    a: "OpenClaw is an autonomous AI agent execution framework. Starweft workers use OpenClaw to execute tasks by spawning it as a subprocess.",
  },
  {
    q: "What platforms are supported?",
    a: "Linux (x86_64), macOS (x86_64, aarch64), and Windows (x86_64). The Rust toolchain handles cross-compilation.",
  },
  {
    q: "Is Starweft free?",
    a: "Yes. Starweft is open source under the MIT license. The only cost is the LLM API usage from OpenClaw, which is not a Starweft expense.",
  },
  {
    q: "How do nodes discover each other?",
    a: "Nodes are manually registered as peers using the `starweft peer add` command with their multiaddr, actor ID, node ID, and public key.",
  },
];

/* ---------- page ---------- */

export default function LandingPage(): ReactNode {
  return (
    <div className="min-h-screen bg-[var(--background)] font-[family-name:var(--font-figtree)] text-[var(--ink)]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--line)] bg-[var(--background)]/80 px-4 backdrop-blur-lg lg:px-8">
        <span className="text-lg font-bold tracking-tight">Starweft</span>
        <nav className="flex items-center gap-6">
          <Link href="/docs" className="text-sm text-[var(--ink-soft)] transition hover:text-[var(--ink)]">Docs</Link>
          <a href="https://github.com/starweft/starweft" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--ink-soft)] transition hover:text-[var(--ink)]">GitHub</a>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-center sm:pt-32 sm:pb-28">
        <p className={`${SECTION_LABEL} mb-4`}>Distributed Multi-Agent Coordination</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Orchestrate AI Agents{" "}
          <span className="bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
            Across Machines
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--ink-soft)]">
          Starweft is a P2P CLI that coordinates principal, owner, worker, and relay nodes to decompose visions into tasks and execute them with OpenClaw-powered AI agents.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/docs/getting-started/introduction" className={BTN_PRIMARY}>
            Get Started
          </Link>
          <a href="https://github.com/starweft/starweft" target="_blank" rel="noopener noreferrer" className={BTN_OUTLINE}>
            View on GitHub
          </a>
        </div>
      </section>

      {/* ── Architecture ── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className={`${SECTION_LABEL} mb-3 text-center`}>Architecture</p>
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Four Roles, Zero Servers
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { role: "Principal", desc: "Submits visions (goals) and issues stop commands to the network." },
            { role: "Owner", desc: "Decomposes visions into tasks and distributes them to available workers." },
            { role: "Worker", desc: "Executes tasks via the OpenClaw bridge and reports progress and results." },
            { role: "Relay", desc: "Forwards messages between nodes that cannot communicate directly." },
          ].map(({ role, desc }) => (
            <div key={role} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
                <span className="text-sm font-bold text-[var(--accent)]">{role[0]}</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{role}</h3>
              <p className="text-sm text-[var(--ink-soft)]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className={`${SECTION_LABEL} mb-3 text-center`}>Features</p>
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Built for Distributed Agent Coordination
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
              <h3 className="mb-2 text-base font-semibold">{f.title}</h3>
              <p className="text-sm text-[var(--ink-soft)]">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Installation ── */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className={`${SECTION_LABEL} mb-3 text-center`}>Installation</p>
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          One Command to Install
        </h2>
        <OsTabs items="macOS / Linux,Windows,From Source">
          <div className={TERMINAL_BLOCK}>
            <ShellLine>cargo install starweft</ShellLine>
          </div>
          <div className={TERMINAL_BLOCK}>
            <ShellLine prompt=">">cargo install starweft</ShellLine>
          </div>
          <div className={TERMINAL_BLOCK}>
            <ShellLine>git clone https://github.com/starweft/starweft.git</ShellLine>
            <ShellLine>cd starweft</ShellLine>
            <ShellLine>cargo build --release</ShellLine>
          </div>
        </OsTabs>
      </section>

      {/* ── Quick Start ── */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className={`${SECTION_LABEL} mb-3 text-center`}>Quick Start</p>
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Up and Running in Minutes
        </h2>
        <div className={TERMINAL_BLOCK}>
          <ShellComment first>Initialize nodes</ShellComment>
          <ShellLine>starweft init --role principal --data-dir ./demo/principal</ShellLine>
          <ShellLine>starweft init --role owner --data-dir ./demo/owner</ShellLine>
          <ShellLine>starweft init --role worker --data-dir ./demo/worker</ShellLine>

          <ShellComment>Create identities</ShellComment>
          <ShellLine>starweft identity create --data-dir ./demo/principal</ShellLine>
          <ShellLine>starweft identity create --data-dir ./demo/owner</ShellLine>
          <ShellLine>starweft identity create --data-dir ./demo/worker</ShellLine>

          <ShellComment>Register peers and start nodes</ShellComment>
          <ShellLine>starweft peer add /unix/./demo/owner/mailbox.sock --data-dir ./demo/principal \</ShellLine>
          <div className="whitespace-nowrap pl-6">--actor-id &lt;OWNER_ID&gt; --node-id &lt;NODE_ID&gt; --public-key &lt;PUB_KEY&gt;</div>

          <ShellComment>Run nodes in separate terminals</ShellComment>
          <ShellLine>starweft run --data-dir ./demo/principal</ShellLine>
          <ShellLine>starweft run --data-dir ./demo/owner</ShellLine>
          <ShellLine>starweft run --data-dir ./demo/worker</ShellLine>

          <ShellComment>Submit a vision</ShellComment>
          <ShellLine>starweft vision submit &quot;Build a REST API with Rust&quot; --data-dir ./demo/principal</ShellLine>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className={`${SECTION_LABEL} mb-3 text-center`}>FAQ</p>
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="space-y-1">
          {faqItems.map((item) => (
            <details
              key={item.q}
              className="group border-b border-[var(--line)]"
            >
              <summary className="flex cursor-pointer select-none items-center justify-between py-4 text-[var(--ink)] hover:text-[var(--accent)]">
                <span className="font-medium">{item.q}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 transition-transform duration-200 group-open:rotate-180"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-[var(--ink-soft)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--line)] px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-sm text-[var(--ink-soft)] sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Starweft Contributors. MIT License.</p>
          <div className="flex gap-6">
            <Link href="/docs" className="transition hover:text-[var(--ink)]">Documentation</Link>
            <a href="https://github.com/starweft/starweft" target="_blank" rel="noopener noreferrer" className="transition hover:text-[var(--ink)]">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
