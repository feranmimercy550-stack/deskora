"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Users, FileText, Receipt,
  CreditCard, Package, Calendar, BarChart3, Bot,
  Settings, Search, Plus, Quote
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

const invoices = [
  { id: "INV-2024-001", customer: "John Doe", amount: "₦50,000", status: "Paid", date: "May 12, 2024", due: "May 19, 2024" },
  { id: "INV-2024-002", customer: "Jane Smith", amount: "₦35,000", status: "Pending", date: "May 11, 2024", due: "May 18, 2024" },
  { id: "INV-2024-003", customer: "BlueStar Ltd", amount: "₦70,000", status: "Overdue", date: "May 10, 2024", due: "May 17, 2024" },
  { id: "INV-2024-004", customer: "David Johnson", amount: "₦25,000", status: "Draft", date: "May 9, 2024", due: "May 16, 2024" },
  { id: "INV-2024-005", customer: "Sarah Williams", amount: "₦40,000", status: "Paid", date: "May 8, 2024", due: "May 15, 2024" },
  { id: "INV-2024-006", customer: "Michael Brown", amount: "₦60,000", status: "Paid", date: "May 7, 2024", due: "May 14, 2024" },
];

const statusStyles: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Overdue: "bg-red-100 text-red-700",
  Draft: "bg-gray-100 text-gray-600",
};

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.customer.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || inv.status === filter;
    return matchesSearch && matchesFilter;
  });

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
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                link.active
                  ? "bg-primary text-white"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 px-2 pt-4 border-t border-sidebar-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
            MA
          </div>
          <div>
            <p className="text-sidebar-foreground text-sm font-medium">Mercy Akinwale</p>
            <p className="text-sidebar-foreground/60 text-xs">Mercy Digital</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-border bg-card">
          <div>
            <h1 className="text-xl font-bold text-foreground">Invoices</h1>
            <p className="text-muted-foreground text-sm">Create, manage and track your invoices.</p>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>

        <div className="px-8 py-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Invoices", value: "6", color: "text-foreground" },
              { label: "Paid", value: "3", color: "text-green-600" },
              { label: "Pending", value: "1", color: "text-yellow-600" },
              { label: "Overdue", value: "1", color: "text-red-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 w-80">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground text-foreground"
              />
            </div>
            <div className="flex gap-2">
              {["All", "Paid", "Pending", "Overdue", "Draft"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    filter === f
                      ? "bg-primary text-white"
                      : "bg-card border border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Invoice</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Customer</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Amount</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition cursor-pointer">
                    <td className="px-6 py-4 text-sm text-primary font-medium">{inv.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{inv.customer}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{inv.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{inv.date}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{inv.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Showing {filtered.length} of {invoices.length} invoices
          </p>
        </div>
      </main>
    </div>
  );
}