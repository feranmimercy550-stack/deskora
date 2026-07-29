"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message || "Login failed. Please check your credentials.");
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center py-10 px-4">
      <div className="bg-card p-8 rounded-2xl shadow-md w-full max-w-md border border-border">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo-dark.png" alt="Risely" className="h-16" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground mt-1 text-sm">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-input rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-foreground">Password</label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-input rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">Get started free</Link>
        </p>
      </div>
    </main>
  );
}
