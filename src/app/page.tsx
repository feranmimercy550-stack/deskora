import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-primary mb-4">Deskora</h1>
        <p className="text-xl text-muted-foreground mb-8">Your AI Business Assistant</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-secondary text-secondary-foreground border border-border px-8 py-3 rounded-lg font-semibold hover:bg-accent transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
