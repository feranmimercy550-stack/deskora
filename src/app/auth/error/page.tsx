import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
      <p className="max-w-md text-muted-foreground">
        We couldn&apos;t verify your link. It may have expired. Please try signing in again.
      </p>
      <Link
        href="/login"
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        Back to login
      </Link>
    </main>
  )
}
