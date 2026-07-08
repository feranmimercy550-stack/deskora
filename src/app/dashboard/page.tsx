"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Users, FileText, Receipt,
  CreditCard, Package, Calendar, BarChart3, Bot,
  Settings, Bell, Search, TrendingUp, AlertCircle,
  Plus, Quote
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

type Invoice = {
  id: string;
  customer_name: string;
  amount: number;
  status: string;
  due_date: string;
};

type DashboardData = {
  totalRevenue: number;
  outstandingAmount: number;
  totalCustomers: number;
  profitThisMonth: number;
  recentInvoices: Invoice[];
  userName: string;
  businessName: string;
  unreadNotifications: number;
};

const statusStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-yellow-100 text-yellow-700",
  overdue: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-600",
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    totalRevenue: 0,
    outstandingAmount: 0,
    totalCustomers: 0,
    profitThisMonth: 0,
    recentInvoices: [],
    userName: "there",
    businessName: "Your Business",
    unreadNotifications: 0,
  });
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) { setLoading(false); return; }

      const [profileRes, invoicesRes, customersRes, paymentsRes, notificationsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("invoices").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("customers").select("id").eq("user_id", user.id),
        supabase.from("payments").select("*").eq("user_id", user.id),
        supabase.from("notifications").select("id").eq("user_id", user.id).eq("read", false),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invoices = invoicesRes.data || [] as any[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payments = paymentsRes.data || [] as any[];
      const profile = profileRes.data;

      const totalRevenue = payments.reduce((sum: number, p: any) => sum + p.amount, 0);
      const outstandingAmount = invoices
        .filter((i: any) => i.status === "unpaid" || i.status === "overdue")
        .reduce((sum: number, i: any) => sum + i.amount, 0);
      const thisMonth = new Date().getMonth();
      const profitThisMonth = payments
        .filter((p: any) => new Date(p.paid_at).getMonth() === thisMonth)
        .reduce((sum: number, p: any) => sum + p.amount, 0);

      const recentInvoices = await Promise.all(
        invoices.slice(0, 5).map(async (inv: any) => {
          let customer_name = "Unknown";
          if (inv.customer_id) {
            const { data: cust } = await supabase
              .from("customers").select("full_name").eq("id", inv.customer_id).single();
            if (cust) customer_name = cust.full_name;
          }
          return { ...inv, customer_name };
        })
      );

      setData({
        totalRevenue,
        outstandingAmount,
        totalCustomers: customersRes.data?.length || 0,
        profitThisMonth,
        recentInvoices,
        userName: profile?.full_name?.split(" ")[0] || "there",
        businessName: profile?.business_name || "Your Business",
        unreadNotifications: notificationsRes.data?.length || 0,
      });

      setLoading(false);
    };

    fetchDashboard();
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${link.active ? "bg-primary text-white" : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}>
              <link.icon className="w-4 h-4 shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 px-2 pt-4 border-t border-sidebar-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
            {data.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sidebar-foreground text-sm font-medium">{data.userName}</p>
            <p className="text-sidebar-foreground/60 text-xs">{data.businessName}</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-3 bg-background rounded-lg px-3 py-2 w-72 border border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input placeholder="Search..."
              className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="flex items-center gap-3">
            <Link href="/invoices"
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
              <Plus className="w-4 h-4" /> Create New
            </Link>
            <Link href="/notifications" className="relative p-2 rounded-lg hover:bg-accent transition">
              <Bell className="w-5 h-5 text-foreground" />
              {data.unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                  {data.unreadNotifications}
                </span>
              )}
            </Link>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
              {data.userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {getGreeting()}, {data.userName} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Here's what's happening with your business today.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Revenue", value: `₦${data.totalRevenue.toLocaleString()}`, change: "All time payments received", positive: true, icon: TrendingUp },
                  { label: "Outstanding Invoices", value: `₦${data.outstandingAmount.toLocaleString()}`, change: "Unpaid & overdue", positive: false, icon: AlertCircle },
                  { label: "Total Customers", value: data.totalCustomers, change: "Total clients added", positive: true, icon: Users },
                  { label: "Profit This Month", value: `₦${data.profitThisMonth.toLocaleString()}`, change: "Payments this month", positive: true, icon: TrendingUp },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                      <stat.icon className={`w-4 h-4 ${stat.positive ? "text-green-500" : "text-red-500"}`} />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className={`text-xs mt-2 ${stat.positive ? "text-green-500" : "text-red-500"}`}>
                      {stat.change}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-foreground">Recent Invoices</h2>
                    <Link href="/invoices" className="text-primary text-sm hover:underline">View all</Link>
                  </div>
                  {data.recentInvoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <FileText className="w-10 h-10 text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground text-sm">No invoices yet</p>
                      <Link href="/invoices" className="text-primary text-sm mt-1 hover:underline">
                        Create your first invoice
                      </Link>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-muted-foreground border-b border-border">
                          <th className="pb-2">Invoice</th>
                          <th className="pb-2">Customer</th>
                          <th className="pb-2">Amount</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2">Due Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentInvoices.map((inv) => (
                          <tr key={inv.id} className="border-b border-border last:border-0">
                            <td className="py-3 text-sm text-primary font-medium">
                              INV-{inv.id.slice(0, 6).toUpperCase()}
                            </td>
                            <td className="py-3 text-sm text-foreground">{inv.customer_name}</td>
                            <td className="py-3 text-sm text-foreground">₦{inv.amount.toLocaleString()}</td>
                            <td className="py-3">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusStyles[inv.status] || "bg-gray-100 text-gray-600"}`}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="py-3 text-sm text-muted-foreground">{inv.due_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="w-5 h-5 text-primary" />
                      <h2 className="font-semibold text-foreground">AI Suggestion</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {data.outstandingAmount > 0
                        ? `You have ₦${data.outstandingAmount.toLocaleString()} in outstanding invoices. Want me to send reminders?`
                        : "Your business looks great! Want help creating a new invoice or proposal?"}
                    </p>
                    <div className="flex gap-2">
                      <Link href="/ai-assistant"
                        className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg hover:opacity-90 transition">
                        Ask AI
                      </Link>
                      <button className="border border-border text-xs px-3 py-1.5 rounded-lg hover:bg-accent transition">
                        Not now
                      </button>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-5">
                    <h2 className="font-semibold text-foreground mb-3">Quick Actions</h2>
                    <div className="space-y-2">
                      {[
                        { label: "Add Customer", href: "/customers", icon: Users },
                        { label: "Create Invoice", href: "/invoices", icon: FileText },
                        { label: "Record Payment", href: "/payments", icon: CreditCard },
                        { label: "View Reports", href: "/reports", icon: BarChart3 },
                      ].map((action) => (
                        <Link key={action.label} href={action.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition text-sm text-foreground">
                          <action.icon className="w-4 h-4 text-primary" />
                          {action.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}