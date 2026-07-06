"use client";

import Link from "next/link";
import {
  LayoutDashboard, Users, FileText, Receipt,
  CreditCard, Package, Calendar, BarChart3, Bot, Settings,
  Bell, Search, TrendingUp, AlertCircle, Plus, Quote
} from "lucide-react";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
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

const recentInvoices = [
  { id: "INV-2024-001", customer: "John Doe", amount: "₦50,000", status: "Paid", date: "May 12, 2024" },
  { id: "INV-2024-002", customer: "Jane Smith", amount: "₦35,000", status: "Pending", date: "May 11, 2024" },
  { id: "INV-2024-003", customer: "BlueStar Ltd", amount: "₦70,000", status: "Overdue", date: "May 10, 2024" },
];

const upcomingEvents = [
  { title: "Follow up with David", time: "10:00 AM", date: "Today" },
  { title: "Project deadline - Website", date: "May 15" },
  { title: "Invoice due - BlueStar Ltd", date: "May 16" },
];

export default function DashboardPage() {
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-3 bg-background rounded-lg px-3 py-2 w-72 border border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Search..."
              className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
              <Plus className="w-4 h-4" />
              Create New
            </button>
            <button className="relative p-2 rounded-lg hover:bg-accent transition">
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
              MA
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Good morning, Mercy 👋</h1>
            <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your business today.</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: "₦145,000", change: "+12.5% from yesterday", positive: true, icon: TrendingUp },
              { label: "Outstanding Invoices", value: "₦78,500", change: "3 overdue", positive: false, icon: AlertCircle },
              { label: "Total Customers", value: "128", change: "+4 this month", positive: true, icon: Users },
              { label: "Profit This Month", value: "₦320,000", change: "+18.7% from last month", positive: true, icon: TrendingUp },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                <p className={`text-xs mt-2 ${stat.positive ? "text-green-500" : "text-red-500"}`}>
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recent Invoices */}
            <div className="md:col-span-2 bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Recent Invoices</h2>
                <Link href="/invoices" className="text-primary text-sm hover:underline">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground border-b border-border">
                      <th className="pb-2">Invoice</th>
                      <th className="pb-2">Customer</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInvoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-border last:border-0">
                        <td className="py-3 text-sm text-primary font-medium">{inv.id}</td>
                        <td className="py-3 text-sm text-foreground">{inv.customer}</td>
                        <td className="py-3 text-sm text-foreground">{inv.amount}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            inv.status === "Paid" ? "bg-green-100 text-green-700" :
                            inv.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">{inv.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
              {/* AI Suggestion */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">AI Suggestion</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Would you like me to remind your overdue customers? I can send friendly reminders to help you get paid faster.
                </p>
                <div className="flex gap-2">
                  <button className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg hover:opacity-90 transition">
                    Yes, remind them
                  </button>
                  <button className="border border-border text-xs px-3 py-1.5 rounded-lg hover:bg-accent transition">
                    Not now
                  </button>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="font-semibold text-foreground mb-3">Upcoming Events</h2>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.title} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0"></div>
                      <div>
                        <p className="text-sm text-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.time ? `${event.time} · ` : ""}{event.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}