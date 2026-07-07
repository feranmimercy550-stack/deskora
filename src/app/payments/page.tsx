"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Users, FileText, Receipt,
  CreditCard, Package, Calendar, BarChart3, Bot,
  Settings, Plus, Quote, X
} from "lucide-react";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: Quote, label: "Quotes", href: "/quotes" },
  { icon: Receipt, label: "Expenses", href: "/expenses" },
  { icon: CreditCard, label: "Payments", href: "/payments", active: true },
  { icon: Package, label: "Products & Services", href: "/products" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Bot, label: "AI Assistant", href: "/ai-assistant" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

type Payment = {
  id: string;
  invoice_id: string;
  amount: number;
  paid_at: string;
  customer_name: string;
};

type Invoice = {
  id: string;
  customer_name: string;
  amount: number;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    invoice_id: "",
    amount: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) { setLoading(false); return; }

      const [paymentsRes, invoicesRes] = await Promise.all([
        supabase.from("payments").select("*").eq("user_id", user.id).order("paid_at", { ascending: false }),
        supabase.from("invoices").select("id, amount, customer_id").eq("user_id", user.id),
      ]);

      if (invoicesRes.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedInvoices = await Promise.all(invoicesRes.data.map(async (inv: any) => {
          let customer_name = "Unknown";
          if (inv.customer_id) {
            const { data: cust } = await supabase.from("customers").select("full_name").eq("id", inv.customer_id).single();
            if (cust) customer_name = cust.full_name;
          }
          return { id: inv.id, amount: inv.amount, customer_name };
        }));
        setInvoices(mappedInvoices);

        if (paymentsRes.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedPayments = paymentsRes.data.map((p: any) => {
            const invoice = mappedInvoices.find(i => i.id === p.invoice_id);
            return {
              ...p,
              customer_name: invoice?.customer_name || "Unknown",
            };
          });
          setPayments(mappedPayments);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!form.invoice_id || !form.amount) {
      setError("Please select an invoice and enter an amount");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) throw new Error("Not logged in");

      const { data, error: dbError } = await supabase
        .from("payments")
        .insert({
          user_id: user.id,
          invoice_id: form.invoice_id,
          amount: parseFloat(form.amount),
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Mark invoice as paid
      await supabase.from("invoices").update({ status: "paid" }).eq("id", form.invoice_id);

      if (data) {
        const invoice = invoices.find(i => i.id === form.invoice_id);
        const newPayment: Payment = {
          ...data,
          customer_name: invoice?.customer_name || "Unknown",
        };
        setPayments((prev) => [newPayment, ...prev]);
      }

      setForm({ invoice_id: "", amount: "" });
      setShowModal(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save payment";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar flex flex-col py-6 px-4 shrink-0">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-sidebar-foreground font-bold text-lg">DESKORA</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                link.active ? "bg-primary text-white" : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 px-2 pt-4 border-t border-sidebar-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">MA</div>
          <div>
            <p className="text-sidebar-foreground text-sm font-medium">Mercy Akinwale</p>
            <p className="text-sidebar-foreground/60 text-xs">Mercy Digital</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-4 border-b border-border bg-card">
          <div>
            <h1 className="text-xl font-bold text-foreground">Payments</h1>
            <p className="text-muted-foreground text-sm">Track and manage your payments.</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
            <Plus className="w-4 h-4" /> Record Payment
          </button>
        </div>

        <div className="px-8 py-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-muted-foreground text-sm">Total Received</p>
              <p className="text-2xl font-bold text-green-600 mt-1">₦{totalPayments.toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-muted-foreground text-sm">Total Payments</p>
              <p className="text-2xl font-bold text-foreground mt-1">{payments.length}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-muted-foreground text-sm">This Month</p>
              <p className="text-2xl font-bold text-primary mt-1">
                ₦{payments
                  .filter(p => new Date(p.paid_at).getMonth() === new Date().getMonth())
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : payments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <CreditCard className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">No payments yet</p>
                <p className="text-muted-foreground text-sm mt-1">Record a payment when a client pays you</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Payment ID", "Customer", "Amount", "Invoice", "Date"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                      <td className="px-6 py-4 text-sm text-primary font-medium">
                        PAY-{payment.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{payment.customer_name}</td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">
                        ₦{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        INV-{payment.invoice_id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(payment.paid_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Record Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Record Payment</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-accent rounded transition">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Select Invoice</label>
                <select value={form.invoice_id} onChange={(e) => {
                  const inv = invoices.find(i => i.id === e.target.value);
                  setForm({ ...form, invoice_id: e.target.value, amount: inv ? String(inv.amount) : "" });
                }}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                  <option value="">Select an invoice</option>
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.customer_name} — ₦{inv.amount.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Amount Received (₦)</label>
                <input type="number" value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="50000"
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-border text-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
                {saving ? "Saving..." : "Record Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}