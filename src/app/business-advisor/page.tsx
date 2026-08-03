'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { LockedFeature } from '@/components/LockedFeature';
import { useAuth } from '@/hooks/useAuth';
import { TrendingUp, AlertTriangle, Target, Zap } from 'lucide-react';
import { isFeatureEnabled } from '@/lib/feature-gates';

export default function BusinessAdvisorPage() {
  const { userPlan = 'free' } = useAuth();
  const hasFeature = isFeatureEnabled(userPlan as any, 'aiBusinessAdvisor');

  if (!hasFeature) {
    return (
      <AppLayout title="AI Business Advisor" subtitle="Get AI-powered business insights">
        <LockedFeature
          feature="AI Business Advisor"
          description="Get intelligent recommendations to grow your business based on real-time data."
          currentPlan={userPlan}
          requiredPlan="Business"
          benefits={[
            'Business Health Score',
            'Revenue Forecasting',
            'Growth Recommendations',
            'Risk Alerts',
            'Competitive Insights'
          ]}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="AI Business Advisor"
      subtitle="AI-powered insights and recommendations for your business"
    >
      <div className="space-y-6">
        {/* Daily Greeting */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-2">Good morning, Mercy</h2>
          <p className="text-muted-foreground mb-6">Here's your daily business summary and AI recommendations.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Yesterday's Revenue</p>
              <p className="text-2xl font-bold">₦250,000</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% from yesterday</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">New Leads</p>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-blue-600 mt-1">3 hot, 5 warm, 4 cold</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Overdue Invoices</p>
              <p className="text-2xl font-bold text-orange-600">3</p>
              <p className="text-xs text-orange-600 mt-1">₦85,000 outstanding</p>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            AI Recommendations
          </h3>
          <div className="space-y-3">
            <div className="p-4 border border-border rounded-lg hover:bg-accent/50 transition cursor-pointer">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Focus on High-Value Leads</p>
                  <p className="text-sm text-muted-foreground">Your 3 hot leads have an average deal size of ₦50K. Consider personalized outreach to these prospects.</p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg hover:bg-accent/50 transition cursor-pointer">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Follow Up on Overdue Invoices</p>
                  <p className="text-sm text-muted-foreground">Send automated reminders to customers with overdue invoices. This could recover ₦85K this week.</p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg hover:bg-accent/50 transition cursor-pointer">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Optimize Pricing Strategy</p>
                  <p className="text-sm text-muted-foreground">Based on market trends, increasing your premium tier price by 15% could increase revenue by 8-10%.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Business Health Score</h3>
            <div className="relative inline-block">
              <svg className="w-32 h-32" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="226" strokeDashoffset="56.5" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold">78</p>
                  <p className="text-xs text-muted-foreground">Excellent</p>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Revenue Growth</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-accent rounded h-2">
                  <div className="bg-green-500 h-2 rounded" style={{ width: '85%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Customer Retention</span>
                  <span>72%</span>
                </div>
                <div className="w-full bg-accent rounded h-2">
                  <div className="bg-blue-500 h-2 rounded" style={{ width: '72%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Payment Collection</span>
                  <span>68%</span>
                </div>
                <div className="w-full bg-accent rounded h-2">
                  <div className="bg-orange-500 h-2 rounded" style={{ width: '68%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Financial Forecast</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">This Month's Revenue (Projected)</p>
                <p className="text-2xl font-bold text-green-600 mt-1">₦1.2M</p>
                <p className="text-xs text-green-600 mt-2">↑ 18% vs last month</p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Q1 Forecast</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">₦3.8M</p>
                <p className="text-xs text-blue-600 mt-2">Based on current trends</p>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-700 font-medium">Break-even Point</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">25 days</p>
                <p className="text-xs text-purple-600 mt-2">On current trajectory</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Report */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Report</h3>
          <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition">
            Generate Weekly Summary
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
