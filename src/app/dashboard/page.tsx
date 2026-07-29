"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AppLayout from "@/components/AppLayout";
import {
  Users, FileText, CreditCard, BarChart3, Bot,
  TrendingUp, AlertCircle, Plus
} from "lucide-react";

type Invoice = {
  id: string;
  customer_name: string;
  amount: number;
  status: string;
  due_date: string;
};

export default function DashboardPage() {
  const [firstName, setFirstName] = useState("there");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [profitThisMonth, setProfitThisMonth] = useState(0);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
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

      const [profileRes, invoicesRes, customersRes, paymentsRes] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", user.id).single(),
        supabase.from("invoices").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("customers").select("id").eq("user_id", user.id),
        supabase.from("payments").select("*").eq("user_id", user.id),
      ]) as any[];

      const profileData = profileRes?.data;
      const invoices = invoicesRes?.data || [];
      const payments = paymentsRes?.data || [];

      if (profileData?.full_name) {
        setFirstName(profileData.full_name.split(" ")[0]);
      }

      setTotalRevenue(payments.reduce((sum: number, p: any) => sum + p.amount, 0));
      setOutstandingAmount(invoices
        .filter((i: any) => i.status === "unpaid" || i.status === "overdue")
        .reduce((sum: number, i: any) => sum + i.amount, 0));
      setTotalCustomers(customersRes?.data?.length || 0);
      setProfitThisMonth(payments
        .filter((p: any) => new Date(p.paid_at).getMonth() === new Date().getMonth())
        .reduce((sum: number, p: any) => sum + p.amount, 0));

      const recent = await Promise.all(
        invoices.slice(0, 5).map(async (inv: any) => {
          let customer_name = "Unknown";
          if (inv.customer_id) {
            const { data: cust } = await supabase
              .from("customers").select("full_name").eq("id", inv.customer_id).single();
            if (cust) customer_name = (cust as any).full_name;
          }
          return { ...inv, customer_name };
        })
      );
      setRecentInvoices(recent);
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  const statusStyles: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    unpaid: "bg-yellow-100 text-yellow-700",
    overdue: "bg-red-100 text-red-700",
    draft: "bg-gray-100 text-gray-600",
  };

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Here's what's happening with your business today."
      action={
        <Link href="/invoices"
          className="bg-primary text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Create New</span>
        </Link>
      }
    >
      <div className="px-4 md:px-8 py-6 space-y-6">
        {/* Greeting */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {getGreeting()}, {firstName} 👋
          </h2>
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
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { label: "Total Revenue", value: `₦${totalRevenue.toLocaleString()}`, change: "All time", positive: true, icon: TrendingUp },
                { label: "Outstanding", value: `₦${outstandingAmount.toLocaleString()}`, change: "Unpaid invoices", positive: false, icon: AlertCircle },
                { label: "Customers", value: totalCustomers, change: "Total clients", positive: true, icon: Users },
                { label: "This Month", value: `₦${profitThisMonth.toLocaleString()}`, change: "Revenue", positive: true, icon: TrendingUp },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-muted-foreground text-xs md:text-sm">{stat.label}</p>
                    <stat.icon className={`w-4 h-4 ${stat.positive ? "text-green-500" : "text-red-500"}`} />
                  </div>
                  <p className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.positive ? "text-green-500" : "text-red-500"}`}>
                    {stat.change}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent Invoices + Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-foreground">Recent Invoices</h2>
                  <Link href="/invoices" className="text-primary text-sm hover:underline">View all</Link>
                </div>
                {recentInvoices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <FileText className="w-10 h-10 text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground text-sm">No invoices yet</p>
                    <Link href="/invoices" className="text-primary text-sm mt-1 hover:underline">
                      Create your first invoice
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-muted-foreground border-b border-border">
                          <th className="pb-2">Invoice</th>
                          <th className="pb-2">Customer</th>
                          <th className="pb-2">Amount</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentInvoices.map((inv) => (
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {/* AI Suggestion */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-5 h-5 text-primary" />
                    <h2 className="font-semibold text-foreground">AI Suggestion</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {outstandingAmount > 0
                      ? `You have ₦${outstandingAmount.toLocaleString()} outstanding. Want me to send reminders?`
                      : "Want help creating a new invoice or proposal?"}
                  </p>
                  <div className="flex gap-2">
                    <Link href="/ai-assistant"
                      className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg hover:opacity-90 transition">
                      Ask AI
                    </Link>
                    <button className="border border-border text-xs px-3 py-1.5 rounded-lg hover:bg-accent transition text-foreground">
                      Not now
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
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
    </AppLayout>
  );
}
