import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-foreground mb-2">Authentication Error</h1>
        <p className="text-muted-foreground mb-6">Something went wrong with your authentication. Please try again.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition">
            Back to Login
          </Link>
          <Link href="/register" className="px-6 py-2 border border-border rounded-lg font-semibold text-foreground hover:bg-card transition">
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
