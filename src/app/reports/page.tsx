
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AppLayout from "@/components/AppLayout";
import { Users, FileText, CreditCard, TrendingUp, TrendingDown } from "lucide-react";

type ReportData = {
  totalRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  totalCustomers: number;
  totalPayments: number;
  topCustomers: { name: string; amount: number }[];
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportData>({
    totalRevenue: 0, totalInvoices: 0, paidInvoices: 0,
    unpaidInvoices: 0, overdueInvoices: 0, totalCustomers: 0,
    totalPayments: 0, topCustomers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) { setLoading(false); return; }

      const [invoicesRes, customersRes, paymentsRes] = await Promise.all([
        supabase.from("invoices").select("*").eq("user_id", user.id),
        supabase.from("customers").select("*").eq("user_id", user.id),
        supabase.from("payments").select("*").eq("user_id", user.id),
      ]) as any[];

      const invoices = invoicesRes?.data || [];
      const customers = customersRes?.data || [];
      const payments = paymentsRes?.data || [];

      const totalRevenue = payments.reduce((sum: number, p: any) => sum + p.amount, 0);
      const paidInvoices = invoices.filter((i: any) => i.status === "paid").length;
      const unpaidInvoices = invoices.filter((i: any) => i.status === "unpaid").length;
      const overdueInvoices = invoices.filter((i: any) => i.status === "overdue").length;

      const customerPayments: Record<string, number> = {};
      for (const payment of payments) {
        const invoice = invoices.find((i: any) => i.id === payment.invoice_id);
        if (invoice?.customer_id) {
          customerPayments[invoice.customer_id] = (customerPayments[invoice.customer_id] || 0) + payment.amount;
        }
      }

      const topCustomers = await Promise.all(
        Object.entries(customerPayments)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(async ([id, amount]) => {
            const { data: cust } = await supabase.from("customers").select("full_name").eq("id", id).single();
            return { name: (cust as any)?.full_name || "Unknown", amount };
          })
      );

      setData({
        totalRevenue, totalInvoices: invoices.length, paidInvoices,
        unpaidInvoices, overdueInvoices, totalCustomers: customers.length,
        totalPayments: payments.length, topCustomers,
      });
      setLoading(false);
    };
    fetchReports();
  }, []);

  return (
    <AppLayout
      title="Reports"
      subtitle="Insights about your business performance."
    >
      <div className="px-4 md:px-8 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Revenue", value: `₦${data.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
                { label: "Total Invoices", value: data.totalInvoices, icon: FileText, color: "text-primary", bg: "bg-primary/5" },
                { label: "Total Customers", value: data.totalCustomers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Total Payments", value: data.totalPayments, icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold text-foreground mb-4">Invoice Breakdown</h2>
                <div className="space-y-4">
                  {[
                    { label: "Paid", value: data.paidInvoices, color: "bg-green-500" },
                    { label: "Unpaid", value: data.unpaidInvoices, color: "bg-yellow-500" },
                    { label: "Overdue", value: data.overdueInvoices, color: "bg-red-500" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground">{item.label}</span>
                        <span className="text-sm font-medium text-foreground">{item.value}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full`}
                          style={{ width: data.totalInvoices > 0 ? `${(item.value / data.totalInvoices) * 100}%` : "0%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold text-foreground mb-4">Top Customers</h2>
                {data.topCustomers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <TrendingDown className="w-8 h-8 text-muted-foreground/30 mb-2" />
                    <p className="text-muted-foreground text-sm">No payment data yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.topCustomers.map((customer, i) => (
                      <div key={customer.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold">{i + 1}</div>
                          <span className="text-sm text-foreground">{customer.name}</span>
                        </div>
                        <span className="text-sm font-medium text-green-600">₦{customer.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-2">Business Summary</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You have <strong className="text-foreground">{data.totalCustomers} customers</strong> and{" "}
                <strong className="text-foreground">{data.totalInvoices} invoices</strong> total.{" "}
                <strong className="text-green-600">{data.paidInvoices} paid</strong>
                {data.unpaidInvoices > 0 && <>, <strong className="text-yellow-600">{data.unpaidInvoices} unpaid</strong></>}
                {data.overdueInvoices > 0 && <>, <strong className="text-red-600">{data.overdueInvoices} overdue</strong></>}.{" "}
                Total revenue: <strong className="text-foreground">₦{data.totalRevenue.toLocaleString()}</strong>.
              </p>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
