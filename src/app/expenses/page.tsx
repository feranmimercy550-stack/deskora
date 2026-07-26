"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AppLayout from "@/components/AppLayout";
import { Plus, X, Search, Receipt } from "lucide-react";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
};

const categories = ["Rent", "Utilities", "Software", "Marketing", "Office Supplies", "Transport", "Food", "Other"];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", amount: "", category: "Other", date: "", notes: "" });

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    const authResponse = await supabase.auth.getUser();
    const user = authResponse.data.user;
    if (!user) { setLoading(false); return; }
    const { data } = await supabase.from("expenses").select("*").eq("user_id", user.id).order("date", { ascending: false });
    if (data) setExpenses(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.amount || !form.date) { setError("Title, amount and date are required"); return; }
    setSaving(true);
    setError("");
    try {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) throw new Error("Not logged in");
      const { data, error: dbError } = await supabase.from("expenses").insert({
        user_id: user.id, title: form.title,
        amount: parseFloat(form.amount), category: form.category,
        date: form.date, notes: form.notes || null,
      } as any).select().single();
      if (dbError) throw dbError;
      if (data) setExpenses(prev => [data as any, ...prev]);
      setForm({ title: "", amount: "", category: "Other", date: "", notes: "" });
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save expense");
    } finally { setSaving(false); }
  };

  const filtered = expenses.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonth = expenses
    .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <AppLayout
      title="Expenses"
      subtitle="Track and manage your business expenses."
      action={
        <button onClick={() => setShowModal(true)}
          className="bg-primary text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Add Expense</span>
        </button>
      }
    >
      <div className="px-4 md:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-muted-foreground text-sm">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600 mt-1">₦{total.toLocaleString()}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-muted-foreground text-sm">Total Records</p>
            <p className="text-2xl font-bold text-foreground mt-1">{expenses.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 col-span-2 md:col-span-1">
            <p className="text-muted-foreground text-sm">This Month</p>
            <p className="text-2xl font-bold text-primary mt-1">₦{thisMonth.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 w-full md:w-80 mb-6">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input placeholder="Search expenses..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground text-foreground" />
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Receipt className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">No expenses yet</p>
              <p className="text-muted-foreground text-sm mt-1">Click "Add Expense" to start tracking</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Title", "Category", "Amount", "Date"].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 md:px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => (
                    <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                      <td className="px-4 md:px-6 py-4 text-sm font-medium text-foreground">{e.title}</td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{e.category}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm font-medium text-red-600">₦{e.amount.toLocaleString()}</td>
                      <td className="px-4 md:px-6 py-4 text-sm text-muted-foreground">{e.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Add Expense</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-accent rounded transition">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            {error && <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Office rent, Internet bill..."
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Amount (₦) *</label>
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="15000"
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Date *</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional notes..." rows={2}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-border text-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
                {saving ? "Saving..." : "Save Expense"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}