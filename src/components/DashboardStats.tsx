'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, FileText, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardMetrics, getBusinessHealthScore } from '@/lib/analytics-service';
import { useAuth } from '@/hooks/useAuth';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

export function DashboardStats() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [healthScore, setHealthScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    try {
      const [metricsData, score] = await Promise.all([
        getDashboardMetrics(user.id),
        getBusinessHealthScore(user.id)
      ]);
      setMetrics(metricsData);
      setHealthScore(score);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return <div>Loading dashboard...</div>;
  }

  const stats: StatCard[] = [
    {
      title: 'Total Revenue',
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      change: metrics.revenueGrowth,
      icon: <CreditCard className="w-6 h-6" />,
      trend: 'up'
    },
    {
      title: 'Total Invoices',
      value: metrics.totalInvoices,
      change: 8,
      icon: <FileText className="w-6 h-6" />,
      trend: 'up'
    },
    {
      title: 'Total Customers',
      value: metrics.totalCustomers,
      change: 2,
      icon: <Users className="w-6 h-6" />,
      trend: 'up'
    },
    {
      title: 'Avg Invoice Value',
      value: `$${metrics.averageInvoiceValue}`,
      change: 5,
      icon: <TrendingUp className="w-6 h-6" />,
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <Card>
        <CardHeader>
          <CardTitle>Business Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Score</p>
              <p className="text-4xl font-bold text-purple-600">{healthScore}%</p>
            </div>
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="8"
                  strokeDasharray={`${(healthScore / 100) * 283} 283`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Your business is performing well. Keep up the momentum!
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {Math.abs(stat.change)}% {stat.trend === 'up' ? 'increase' : 'decrease'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invoice Status */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-3xl font-bold text-green-600">{metrics.paidInvoices}</p>
              <p className="text-xs text-gray-500 mt-1">invoices</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Outstanding</p>
              <p className="text-3xl font-bold text-blue-600">{metrics.outstandingInvoices}</p>
              <p className="text-xs text-gray-500 mt-1">invoices</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-3xl font-bold text-red-600">{metrics.overdueInvoices}</p>
              <p className="text-xs text-gray-500 mt-1">invoices</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              New Invoice
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              Add Customer
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              Record Payment
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              View Reports
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
