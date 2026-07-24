"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Users, FileText, Receipt,
  CreditCard, Package, Calendar, BarChart3, Bot,
  Settings, Quote, Search, X
} from "lucide-react";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: Quote, label: "Quotes", href: "/quotes" },
  { icon: Receipt, label: "Expenses", href: "/expenses" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: Package, label: "Products & Services", href: "/products" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Bot, label: "AI Assistant", href: "/ai-assistant" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

type SearchResult = {
  type: "customer" | "invoice" | "expense" | "quote";
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    const authResponse = await supabase.auth.getUser();
    const user = authResponse.data.user;
    if (!user) { setLoading(false); return; }

    const [customersRes, invoicesRes, expensesRes, quotesRes] = await Promise.all([
      supabase.from("customers").select("*").eq("user_id", user.id).ilike("full_name", `%${query}%`),
      supabase.from("invoices").select("*").eq("user_id", user.id),
      supabase.from("expenses").select("*").eq("user_id", user.id).ilike("title", `%${query}%`),
      supabase.from("quotes").select("*").eq("user_id", user.id),
    ]);

    const allResults: SearchResult[] = [];

    if (customersRes.data) {
      customersRes.data.forEach((c: any) => {
        allResults.push({
          type: "customer", id: c.id,
          title: c.full_name,
          subtitle: c.email || c.phone || "Customer",
          href: "/customers",
        });
      });
    }

    if (invoicesRes.data) {
      invoicesRes.data
        .filter((i: any) => i.description?.toLowerCase().includes(query.toLowerCase()) ||
          `INV-${i.id.slice(0, 8)}`.toLowerCase().includes(query.toLowerCase()))
        .forEach((i: any) => {
          allResults.push({
            type: "invoice", id: i.id,
            title: `INV-${i.id.slice(0, 8).toUpperCase()}`,
            subtitle: `₦${i.amount.toLocaleString()} — ${i.status}`,
            href: "/invoices",
          });
        });
    }

    if (expensesRes.data) {
      expensesRes.data.forEach((e: any) => {
        allResults.push({
          type: "expense", id: e.id,
          title: e.title,
          subtitle: `₦${e.amount.toLocaleString()} — ${e.category}`,
          href: "/expenses",
        });
      });
    }

    if (quotesRes.data) {
      quotesRes.data
        .filter((q: any) => q.description?.toLowerCase().includes(query.toLowerCase()))
        .forEach((q: any) => {
          allResults.push({
            type: "quote", id: q.id,
            title: `QT-${q.id.slice(0, 8).toUpperCase()}`,
            subtitle: `₦${q.amount.toLocaleString()} — ${q.status}`,
            href: "/quotes",
          });
        });
    }

    setResults(allResults);
    setLoading(false);
  };

  const typeColors: Record<string, string> = {
    customer: "bg-blue-100 text-blue-700",
    invoice: "bg-green-100 text-green-700",
    expense: "bg-red-100 text-red-700",
    quote: "bg-yellow-100 text-yellow-700",
  };

  const typeIcons: Record<string, string> = {
    customer: "👥", invoice: "📄", expense: "💸", quote: "📋",
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-64 bg-sidebar flex flex-col py-6 px-4 shrink-0">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-sidebar-foreground font-bold text-lg">RISELY</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent">
              <link.icon className="w-4 h-4 shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 px-2 pt-4 border-t border-sidebar-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">R</div>
          <div>
            <p className="text-sidebar-foreground text-sm font-medium">Risely User</p>
            <p className="text-sidebar-foreground/60 text-xs">My Business</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-4 border-b border-border bg-card">
          <h1 className="text-xl font-bold text-foreground">Search</h1>
          <p className="text-muted-foreground text-sm">Search across customers, invoices, expenses and quotes.</p>
        </div>

        <div className="px-8 py-6 max-w-3xl">
          <div className="flex gap-3 mb-6">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-3 flex-1">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search customers, invoices, expenses..."
                className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
              {query && (
                <button onClick={() => { setQuery(""); setResults([]); setSearched(false); }}>
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            <button onClick={handleSearch} disabled={loading}
              className="bg-primary text-white px-5 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : searched && results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">No results found for "{query}"</p>
              <p className="text-muted-foreground text-sm mt-1">Try a different search term</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
              {results.map((result) => (
                <Link key={result.id} href={result.href}
                  className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition">
                  <div className="text-2xl">{typeIcons[result.type]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{result.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{result.subtitle}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${typeColors[result.type]}`}>
                    {result.type}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">Start searching</p>
              <p className="text-muted-foreground text-sm mt-1">Type something and press Enter or click Search</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}