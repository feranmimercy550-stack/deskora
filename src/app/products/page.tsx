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
  { icon: Quote, label: "Quotes", href: "/quotes" },
  { icon: Receipt, label: "Expenses", href: "/expenses" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: Package, label: "Products & Services", href: "/products", active: true },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Bot, label: "AI Assistant", href: "/ai-assistant" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", description: "", price: "", type: "service" });

  useEffect(() => {
    const fetchProducts = async () => {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("products").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.price) { setError("Name and price are required"); return; }
    setSaving(true);
    setError("");
    try {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) throw new Error("Not logged in");
      const { data, error: dbError } = await supabase.from("products").insert({
        user_id: user.id, name: form.name, description: form.description || null,
        price: parseFloat(form.price), type: form.type,
      } as any).select().single();
      if (dbError) throw dbError;
      if (data) setProducts(prev => [data as any, ...prev]);
      setForm({ name: "", description: "", price: "", type: "service" });
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally { setSaving(false); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
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
            <h1 className="text-xl font-bold text-foreground">Products & Services</h1>
            <p className="text-muted-foreground text-sm">Manage what you sell or offer.</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 w-80">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input placeholder="Search products..." value={search}
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
                <Package className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">No products yet</p>
                <p className="text-muted-foreground text-sm mt-1">Add the services or products you offer</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Name", "Type", "Price", "Description"].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{p.name}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                          p.type === "product" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                        }`}>{p.type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">₦{p.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{p.description || "—"}</td>
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
              <h2 className="text-lg font-bold text-foreground">Add Product / Service</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-accent rounded transition">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            {error && <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Web Design, Logo Design..."
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                  <option value="service">Service</option>
                  <option value="product">Product</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Price (₦) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="50000"
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description..." rows={3}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-border text-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}