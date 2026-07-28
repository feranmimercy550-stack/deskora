"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AppLayout from "@/components/AppLayout";
import {
  Search, Plus, Mail, Phone, MoreHorizontal,
  X, Pencil, Trash2, Users
} from "lucide-react";

type Customer = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  business_name: string;
  notes: string;
  created_at: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", business: "", notes: "",
  });

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    const authResponse = await supabase.auth.getUser();
    const user = authResponse.data.user;
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from("customers").select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setCustomers(data);
    setLoading(false);
  };

  const filtered = customers.filter((c) =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.business_name?.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => setForm({ name: "", email: "", phone: "", business: "", notes: "" });

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Customer name is required"); return; }
    setSaving(true);
    setError("");
    try {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) throw new Error("Not logged in");
      const { data, error: dbError } = await supabase.from("customers").insert({
        user_id: user.id,
        full_name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        business_name: form.business || null,
        notes: form.notes || null,
      } as any).select().single();
      if (dbError) throw dbError;
      if (data) setCustomers(prev => [data as any, ...prev]);
      resetForm();
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save customer");
    } finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!selectedCustomer || !form.name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    setError("");
    try {
      const { error: dbError } = await supabase.from("customers").update({
        full_name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        business_name: form.business || null,
        notes: form.notes || null,
      } as any).eq("id", selectedCustomer.id);
      if (dbError) throw dbError;
      setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? {
        ...c, full_name: form.name, email: form.email,
        phone: form.phone, business_name: form.business, notes: form.notes,
      } : c));
      setShowEditModal(false);
      setSelectedCustomer(null);
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update customer");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (!error) setCustomers(prev => prev.filter(c => c.id !== id));
    setOpenMenuId(null);
  };

  const openEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setForm({
      name: customer.full_name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      business: customer.business_name || "",
      notes: customer.notes || "",
    });
    setError("");
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const FormFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="John Doe"
          className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Business Name</label>
        <input type="text" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })}
          placeholder="Business name"
          className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Email</label>
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="john@example.com"
          className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
        <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="08012345678"
          className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
        <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Any notes..." rows={3}
          className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none" />
      </div>
    </div>
  );

  const Modal = ({ title, onSave, onClose, saveLabel }: {
    title: string; onSave: () => void; onClose: () => void; saveLabel: string;
  }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded transition">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        {error && <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
        <FormFields />
        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 border border-border text-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition">
            Cancel
          </button>
          <button onClick={onSave} disabled={saving}
            className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
            {saving ? "Saving..." : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout
      title="Customers"
      subtitle="Manage all your customers in one place."
      action={
        <button onClick={() => { resetForm(); setError(""); setShowModal(true); }}
          className="bg-primary text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Add Customer</span>
        </button>
      }
    >
      <div className="px-4 md:px-8 py-6">
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 w-full md:w-80 mb-6">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input placeholder="Search customers..." value={search}
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
              <Users className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">No customers yet</p>
              <p className="text-muted-foreground text-sm mt-1">Click "Add Customer" to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 md:px-6 py-3">Customer</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 md:px-6 py-3 hidden md:table-cell">Email</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 md:px-6 py-3 hidden md:table-cell">Phone</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 md:px-6 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 md:px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((customer) => (
                    <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            {customer.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{customer.full_name}</p>
                            <p className="text-xs text-muted-foreground">{customer.business_name || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          {customer.email || "—"}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          {customer.phone || "—"}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="relative">
                          <button onClick={() => setOpenMenuId(openMenuId === customer.id ? null : customer.id)}
                            className="p-1 hover:bg-accent rounded transition">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                          {openMenuId === customer.id && (
                            <div className="absolute right-0 top-8 bg-card border border-border rounded-xl shadow-lg z-10 w-36 py-1">
                              <button onClick={() => openEdit(customer)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-accent transition">
                                <Pencil className="w-3.5 h-3.5" /> Edit
                              </button>
                              <button onClick={() => handleDelete(customer.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-accent transition">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {!loading && (
          <p className="text-xs text-muted-foreground mt-4">
            Showing {filtered.length} of {customers.length} customers
          </p>
        )}
      </div>

      {showModal && (
        <Modal title="Add Customer" onSave={handleSave} onClose={() => setShowModal(false)} saveLabel="Save Customer" />
      )}
      {showEditModal && (
        <Modal title="Edit Customer" onSave={handleEdit} onClose={() => setShowEditModal(false)} saveLabel="Update Customer" />
      )}
    </AppLayout>
  );
}