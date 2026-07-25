"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { generateInvoicePDF } from "@/lib/generateInvoicePDF";
import {
  LayoutDashboard, Users, FileText, Receipt,
  CreditCard, Package, Calendar, BarChart3, Bot,
  Settings, Search, Plus, Quote, X, Download, ExternalLink
} from "lucide-react";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: FileText, label: "Invoices", href: "/invoices", active: true },
  { icon: Quote, label: "Quotes", href: "/quotes" },
  { icon: Receipt, label: "Expenses", href: "/expenses" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: Package, label: "Products & Services", href: "/products" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Bot, label: "AI Assistant", href: "/ai-assistant" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const statusStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-yellow-100 text-yellow-700",
  overdue: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-600",
};

type Invoice = {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email?: string;
  amount: number;
  status: string;
  due_date: string;
  description: string;
  created_at: string;
};

type Customer = {
  id: string;
  full_name: string;
  business_name: string;
  email?: string;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [businessName, setBusinessName] = useState("My Business");
  const [businessEmail, setBusinessEmail] = useState("");
  const [form, setForm] = useState({
    customer_id: "",
    amount: "",
    description: "",
    due_date: "",
    status: "unpaid",
  });

  useEffect(() => {
    const fetchData = async () => {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) { setLoading(false); return; }

      const [invoicesRes, customersRes, profileRes] = await Promise.all([
        supabase.from("invoices").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("customers").select("id, full_name, business_name, email").eq("user_id", user.id),
        supabase.from("profiles").select("business_name, email").eq("id", user.id).single(),
      ]) as any[];

      const profileData = (profileRes as any)?.data;
      const customersData = (customersRes as any)?.data || [];
      const invoicesData = (invoicesRes as any)?.data || [];

      if (profileData) {
        setBusinessName(profileData.business_name || "My Business");
        setBusinessEmail(profileData.email || "");
      }

      if (customersData) setCustomers(customersData);

      if (invoicesData) {
        const mapped = await Promise.all(
          invoicesData.map(async (inv: any) => {
            let customer_name = "Unknown";
            let customer_email = "";
            if (inv.customer_id) {
              const cust = customersData?.find((c: any) => c.id === inv.customer_id);
              if (cust) {
                customer_name = (cust as any).full_name;
                customer_email = (cust as any).email || "";
              }
            }
            return { ...inv, customer_name, customer_email };
          })
        );
        setInvoices(mapped);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!form.amount || !form.due_date) {
      setError("Amount and due date are required");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) throw new Error("Not logged in");

      const { data, error: dbError } = await supabase
        .from("invoices")
        .insert({
          user_id: user.id,
          customer_id: form.customer_id || null,
          amount: parseFloat(form.amount),
          description: form.description || null,
          due_date: form.due_date,
          status: form.status,
        } as any)
        .select()
        .single();

      if (dbError) throw dbError;

      if (data) {
        const customer = customers.find(c => c.id === form.customer_id);
        const newInvoice: Invoice = {
          ...(data as any),
          customer_name: customer?.full_name || "Unknown",
          customer_email: customer?.email || "",
        };
        setInvoices(prev => [newInvoice, ...prev]);
      }

      setForm({ customer_id: "", amount: "", description: "", due_date: "", status: "unpaid" });
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save invoice");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = (inv: Invoice) => {
    generateInvoicePDF({
      id: inv.id,
      customer_name: inv.customer_name,
      customer_email: inv.customer_email,
      amount: inv.amount,
      description: inv.description,
      status: inv.status,
      due_date: inv.due_date,
      created_at: inv.created_at,
      business_name: businessName,
      business_email: businessEmail,
      currency: "NGN",
    });
  };

  const handlePaymentLink = (inv: Invoice) => {
    const amount = inv.amount;
    const description = inv.description || "Invoice Payment";
    const customerEmail = inv.customer_email || "";
    const invoiceRef = `INV-${inv.id.slice(0, 8).toUpperCase()}`;

    const paymentUrl = `https://checkout.flutterwave.com/v3/hosted/pay?amount=${amount}&currency=NGN&customer[email]=${customerEmail}&tx_ref=${invoiceRef}&redirect_url=${window.location.origin}/dashboard&meta[invoice_id]=${inv.id}&narration=${encodeURIComponent(description)}`;

    window.open(paymentUrl, "_blank");
  };

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.description?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || inv.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === "paid").length,
    unpaid: invoices.filter(i => i.status === "unpaid").length,
    overdue: invoices.filter(i => i.status === "overdue").length,
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${link.active ? "bg-primary text-white" : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}>
              <link.icon className="w-4 h-4 shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 px-2 pt-4 border-t border-sidebar-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">R</div>
          <div>
            <p className="text-sidebar-foreground text-sm font-medium">{businessName}</p>
            <p className="text-sidebar-foreground/60 text-xs">Risely Account</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-4 border-b border-border bg-card">
          <div>
            <h1 className="text-xl font-bold text-foreground">Invoices</h1>
            <p className="text-muted-foreground text-sm">Create, manage and track your invoices.</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
        </div>

        <div className="px-8 py-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Invoices", value: stats.total, color: "text-foreground" },
              { label: "Paid", value: stats.paid, color: "text-green-600" },
              { label: "Unpaid", value: stats.unpaid, color: "text-yellow-600" },
              { label: "Overdue", value: stats.overdue, color: "text-red-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 w-80">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input placeholder="Search invoices..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground text-foreground" />
            </div>
            <div className="flex gap-2">
              {["all", "paid", "unpaid", "overdue", "draft"].map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize ${filter === f ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:bg-accent"
                    }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">No invoices yet</p>
                <p className="text-muted-foreground text-sm mt-1">Click "Create Invoice" to get started</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Invoice", "Customer", "Amount", "Status", "Due Date", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv) => (
                    <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                      <td className="px-6 py-4 text-sm text-primary font-medium">
                        INV-{inv.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{inv.customer_name}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        ₦{inv.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusStyles[inv.status] || "bg-gray-100 text-gray-600"}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{inv.due_date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownloadPDF(inv)}
                            title="Download PDF"
                            className="flex items-center gap-1 text-xs bg-primary text-white px-2.5 py-1.5 rounded-lg hover:opacity-90 transition">
                            <Download className="w-3 h-3" /> PDF
                          </button>
                          {inv.status !== "paid" && (
                            <button
                              onClick={() => handlePaymentLink(inv)}
                              title="Send Payment Link"
                              className="flex items-center gap-1 text-xs bg-green-600 text-white px-2.5 py-1.5 rounded-lg hover:opacity-90 transition">
                              <ExternalLink className="w-3 h-3" /> Pay
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && (
            <p className="text-xs text-muted-foreground mt-4">
              Showing {filtered.length} of {invoices.length} invoices
            </p>
          )}
        </div>
      </main>

      {/* Create Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Create Invoice</h2>
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
                  {customers.map((c) => (
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
                  placeholder="What is this invoice for?"
                  rows={3}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Due Date *</label>
                <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-border text-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
                {saving ? "Saving..." : "Create Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}