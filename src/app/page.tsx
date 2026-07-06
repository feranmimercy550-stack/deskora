import Link from "next/link";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="m7 14 3-3 3 3 4-5" />
        </svg>
      </div>
      <span className="text-xl font-bold tracking-tight text-sidebar-foreground">DESKORA</span>
    </div>
  );
}

const features = ["All-in-one Platform", "AI Assistant", "Secure & Reliable"];

export default function Home() {
  return (
    <main className="min-h-screen bg-sidebar text-sidebar-foreground">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
        {/* Top logo */}
        <Logo />

        {/* Hero */}
        <div className="flex flex-1 flex-col justify-center py-16">
          <span className="mb-6 inline-flex w-fit items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
            AI-Powered Business OS
          </span>

          <h1 className="text-5xl font-bold leading-tight tracking-tight text-balance md:text-6xl">
            Run Your Business.{" "}
            <span className="text-primary">Smarter. Faster. Easier.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-sidebar-foreground/60 text-pretty">
            Deskora helps freelancers and small businesses manage customers,
            invoices, payments, and growth  all in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-sidebar-border px-6 py-3 font-semibold text-sidebar-foreground transition hover:bg-sidebar-accent"
            >
              Watch Demo
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {features.map((f) => (
              <span
                key={f}
                className="rounded-full border border-sidebar-border px-4 py-1.5 text-sm text-sidebar-foreground/70"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-sidebar-border pt-6">
          <Logo />
          <p className="mt-2 text-sm text-sidebar-foreground/50">
            AI-Powered Business Operating System for Freelancers and Small Businesses.
          </p>
        </footer>
      </div>
    </main>
  );
}
