"use client";

import { useState, useEffect, useRef } from "react";
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
  const [menuDirection, setMenuDirection] = useState<"down" | "up">("down");
  const tableRef = useRef<HTMLDivElement>(null);

  // Form state at TOP LEVEL — this fixes cursor jumping
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase.from("customers").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setCustomers(data);
    setLoading(false);
  };

  const resetForm = () => { setName(""); setEmail(""); setPhone(""); setBusiness(""); setNotes(""); };

  const openAdd = () => { resetForm(); setError(""); setShowModal(true); };

  const openEdit = (c: Customer) => {
    setSelectedCustomer(c);
    setName(c.full_name || "");
    setEmail(c.email || "");
    setPhone(c.phone || "");
    setBusiness(c.business_name || "");
    setNotes(c.notes || "");
    setError("");
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleRowMenuClick = (id: string, rowIndex: number, totalRows: number) => {
    setMenuDirection(rowIndex >= totalRows - 2 ? "up" : "down");
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleSave = async () => {
    if (!name.trim()) { setError("Customer name is required"); return; }
    setSaving(true); setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");
      const { data, error: dbError } = await supabase.from("customers").insert({
        user_id: user.id, full_name: name,
        email: email || null, phone: phone || null,
        business_name: business || null, notes: notes || null,
      } as any).select().single();
      if (dbError) throw dbError;
      if (data) setCustomers(prev => [data as any, ...prev]);
      resetForm(); setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!selectedCustomer || !name.trim()) { setError("Name is required"); return; }
    setSaving(true); setError("");
    try {
      const { error: dbError } = await supabase.from("customers").update({
        full_name: name, email: email || null,
        phone: phone || null, business_name: business || null, notes: notes || null,
      } as any).eq("id", selectedCustomer.id);
      if (dbError) throw dbError;
      setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? {
        ...c, full_name: name, email, phone, business_name: business, notes,
      } : c));
      setShowEditModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this customer?")) return;
    await supabase.from("customers").delete().eq("id", id);
    setCustomers(prev => prev.filter(c => c.id !== id));
    setOpenMenuId(null);
  };

  const filtered = customers.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.business_name?.toLowerCase().includes(search.toLowerCase())
  );

  const inputClass = "w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground";
  const labelClass = "block text-sm font-medium text-foreground mb-1";

  return (
    <AppLayout
      title="Customers"
      subtitle="Manage all your customers in one place."
      action={
        <button onClick={openAdd}
          className="bg-primary text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Add Customer</span>
        </button>
      }
    >
      <div className="px-4 md:px-8 py-6">
        {/* Search */}
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2.5 w-full md:w-80 mb-6">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input placeholder="Search customers..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground text-foreground" />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden" ref={tableRef}>
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Customer", "Email", "Phone", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {c.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{c.full_name}</p>
                          <p className="text-xs text-muted-foreground">{c.business_name || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Mail className="w-3.5 h-3.5 shrink-0" />{c.email || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Phone className="w-3.5 h-3.5 shrink-0" />{c.phone || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">Active</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button onClick={() => handleRowMenuClick(c.id, i, filtered.length)}
                          className="p-1.5 hover:bg-accent rounded-lg transition">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                        {openMenuId === c.id && (
                          <div className={`absolute right-0 ${menuDirection === "up" ? "bottom-8" : "top-8"} bg-card border border-border rounded-xl shadow-xl z-50 w-40 py-1`}>
                            <button onClick={() => openEdit(c)}
                              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground hover:bg-accent transition">
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button onClick={() => handleDelete(c.id)}
                              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-destructive hover:bg-accent transition">
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
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Users className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">No customers yet</p>
              <button onClick={openAdd} className="text-primary text-sm mt-2 hover:underline">Add your first customer</button>
            </div>
          ) : filtered.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-bold shrink-0">
                    {c.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{c.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.business_name || "—"}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium shrink-0">Active</span>
              </div>
              {(c.email || c.phone) && (
                <div className="mt-3 space-y-1.5">
                  {c.email && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{c.email}</span>
                    </div>
                  )}
                  {c.phone && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 shrink-0" />{c.phone}
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <button onClick={() => openEdit(c)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-border text-foreground py-2 rounded-lg hover:bg-accent transition">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(c.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-destructive/30 text-destructive py-2 rounded-lg hover:bg-destructive/5 transition">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground mt-4">
            Showing {filtered.length} of {customers.length} customers
          </p>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
          <div className="bg-card border border-border rounded-t-2xl md:rounded-2xl p-6 w-full md:max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Add Customer</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-accent rounded transition">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            {error && <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
            <div className="space-y-4">
              <div><label className={labelClass}>Full Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className={inputClass} /></div>
              <div><label className={labelClass}>Business Name</label>
                <input value={business} onChange={e => setBusiness(e.target.value)} placeholder="Business name" className={inputClass} /></div>
              <div><label className={labelClass}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className={inputClass} /></div>
              <div><label className={labelClass}>Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="08012345678" className={inputClass} /></div>
              <div><label className={labelClass}>Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any notes..." rows={3}
                  className={inputClass + " resize-none"} /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-border text-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
                {saving ? "Saving..." : "Save Customer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
          <div className="bg-card border border-border rounded-t-2xl md:rounded-2xl p-6 w-full md:max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Edit Customer</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-accent rounded transition">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            {error && <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
            <div className="space-y-4">
              <div><label className={labelClass}>Full Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className={inputClass} /></div>
              <div><label className={labelClass}>Business Name</label>
                <input value={business} onChange={e => setBusiness(e.target.value)} placeholder="Business name" className={inputClass} /></div>
              <div><label className={labelClass}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className={inputClass} /></div>
              <div><label className={labelClass}>Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="08012345678" className={inputClass} /></div>
              <div><label className={labelClass}>Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any notes..." rows={3}
                  className={inputClass + " resize-none"} /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEditModal(false)}
                className="flex-1 border border-border text-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition">Cancel</button>
              <button onClick={handleEdit} disabled={saving}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
                {saving ? "Updating..." : "Update Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}