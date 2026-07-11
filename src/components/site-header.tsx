import Link from "next/link";

export function SiteHeader({ bare = false }: { bare?: boolean }) {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--ink)]">
            Tact
          </span>
          <span className="hidden text-xs text-[var(--mute)] sm:inline">
            post without the hard sell
          </span>
        </Link>
        {!bare && (
          <nav className="flex items-center gap-5 text-sm">
            <Link
              href="/#how"
              className="text-[var(--mute)] transition hover:text-[var(--ink)]"
            >
              How it works
            </Link>
            <Link
              href="/app"
              className="rounded-full bg-[var(--ink)] px-4 py-1.5 text-[var(--paper)] transition hover:bg-[var(--ink-soft)]"
            >
              Open desk
            </Link>
          </nav>
        )}
        {bare && (
          <Link
            href="/"
            className="text-sm text-[var(--mute)] transition hover:text-[var(--ink)]"
          >
            ← Product
          </Link>
        )}
      </div>
    </header>
  );
}
