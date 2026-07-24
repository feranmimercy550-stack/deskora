"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Users, FileText, Receipt,
  CreditCard, Package, Calendar, BarChart3, Bot,
  Settings, Plus, Quote, X, Search
} from "lucide-react";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: Quote, label: "Quotes", href: "/quotes", active: true },
  { icon: Receipt, label: "Expenses", href: "/expenses" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: Package, label: "Products & Services", href: "/products" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Bot, label: "AI Assistant", href: "/ai-assistant" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

type QuoteItem = {
  id: string;
  customer_id: string;
  customer_name: string;
  amount: number;
  status: string;
  description: string;
  valid_until: string;
  created_at: string;
};

type Customer = {
  id: string;
  full_name: string;
  business_name: string;
};

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-600",
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customer_id: "",
    amount: "",
    description: "",
    valid_until: "",
    status: "pending",
  });

  useEffect(() => {
    const fetchData = async () => {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) { setLoading(false); return; }

      const [quotesRes, customersRes] = await Promise.all([
        supabase.from("quotes").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("customers").select("id, full_name, business_name").eq("user_id", user.id),
      ]);

      if (customersRes.data) setCustomers(customersRes.data);

      if (quotesRes.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped = quotesRes.data.map((q: any) => {
          const customer = customersRes.data?.find((c: Customer) => c.id === q.customer_id);
          return { ...q, customer_name: customer?.full_name || "Unknown" };
        });
        setQuotes(mapped);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!form.amount || !form.valid_until) {
      setError("Amount and valid until date are required");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) throw new Error("Not logged in");

      const { data, error: dbError } = await supabase
        .from("quotes")
        .insert({
          user_id: user.id,
          customer_id: form.customer_id || null,
          amount: parseFloat(form.amount),
          description: form.description || null,
          valid_until: form.valid_until,
          status: form.status,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      if (data) {
        const customer = customers.find(c => c.id === form.customer_id);
        setQuotes(prev => [{ ...data, customer_name: customer?.full_name || "Unknown" }, ...prev]);
      }

      setForm({ customer_id: "", amount: "", description: "", valid_until: "", status: "pending" });
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save quote");
    } finally {
      setSaving(false);
    }
  };

  const filtered = quotes.filter(q =>
    q.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    q.description?.toLowerCase().includes(search.toLowerCase())
  );

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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                link.active ? "bg-primary text-white" : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}>
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
        <div className="flex items-center justify-between px-8 py-4 border-b border-border bg-card">
          <div>
            <h1 className="text-xl font-bold text-foreground">Quotes</h1>
            <p className="text-muted-foreground text-sm">Create and manage your quotations.</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
            <Plus className="w-4 h-4" /> Create Quote
          </button>
        </div>

        <div className="px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Quotes", value: quotes.length, color: "text-foreground" },
              { label: "Pending", value: quotes.filter(q => q.status === "pending").length, color: "text-yellow-600" },
              { label: "Accepted", value: quotes.filter(q => q.status === "accepted").length, color: "text-green-600" },
              { label: "Rejected", value: quotes.filter(q => q.status === "rejected").length, color: "text-red-600" },
            ].map(stat => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 w-80">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input placeholder="Search quotes..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground text-foreground" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Quote className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">No quotes yet</p>
                <p className="text-muted-foreground text-sm mt-1">Click "Create Quote" to get started</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Quote ID", "Customer", "Amount", "Status", "Valid Until"].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(q => (
                    <tr key={q.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                      <td className="px-6 py-4 text-sm text-primary font-medium">QT-{q.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{q.customer_name}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">₦{q.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusStyles[q.status] || "bg-gray-100 text-gray-600"}`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{q.valid_until}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Create Quote</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-accent rounded transition">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            {error && <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Customer</label>
                <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                  <option value="">Select a customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name}{c.business_name ? ` — ${c.business_name}` : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Amount (₦) *</label>
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="50000"
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What does this quote cover?" rows={3}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Valid Until *</label>
                <input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-border text-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
                {saving ? "Saving..." : "Save Quote"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}