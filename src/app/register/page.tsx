"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { currencies } from "@/lib/currency";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [country, setCountry] = useState("Nigeria");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` }
    });

    if (error) { setError(error.message); setLoading(false); return; }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
        business_name: businessName,
        email,
        currency,
        country,
      } as any);
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center py-10 px-4">
      <div className="bg-card p-8 rounded-2xl shadow-md w-full max-w-md border border-border">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-xl text-foreground">RISELY</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="text-muted-foreground mt-1 text-sm">Start your 14-day free trial</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full border border-input rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Business Name</label>
            <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your business name"
              className="w-full border border-input rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-input rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-input rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Your Currency</label>
            <select value={currency} onChange={(e) => {
              const selected = currencies.find(c => c.code === e.target.value);
              setCurrency(e.target.value);
              if (selected) setCountry(selected.country);
            }}
              className="w-full border border-input rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
              {currencies.map(c => (
                <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.country})</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}