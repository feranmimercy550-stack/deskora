'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { LockedFeature } from '@/components/LockedFeature';
import { useAuth } from '@/hooks/useAuth';
import { Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { isFeatureEnabled } from '@/lib/feature-gates';

export default function DealsPage() {
  const { userPlan = 'free' } = useAuth();
  const hasFeature = isFeatureEnabled(userPlan as any, 'crm');

  const [deals] = useState([
    { id: 1, name: 'Website Redesign Project', company: 'Acme Corp', amount: 50000, stage: 'Negotiation', probability: 75 },
    { id: 2, name: 'Consulting Package', company: 'Tech Startup', amount: 25000, stage: 'Proposal Sent', probability: 50 },
    { id: 3, name: 'Support Contract', company: 'Global Services', amount: 15000, stage: 'Discovery', probability: 30 },
  ]);

  if (!hasFeature) {
    return (
      <AppLayout title="Deals" subtitle="Manage your sales deals and opportunities">
        <LockedFeature
          feature="Deal Management"
          description="Track deals through your sales pipeline stages from discovery to close."
          currentPlan={userPlan}
          requiredPlan="Professional"
          benefits={[
            'Kanban Pipeline View',
            'Deal Probability Tracking',
            'Custom Deal Stages',
            'Win/Loss Analysis',
            'Deal Forecasting'
          ]}
        />
      </AppLayout>
    );
  }

  const stages = ['Discovery', 'Proposal Sent', 'Negotiation', 'Closed Won'];

  return (
    <AppLayout
      title="Sales Deals"
      subtitle="Track your sales pipeline"
      action={
        <Link
          href="/deals/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          New Deal
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Pipeline Overview */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Sales Pipeline
          </h3>
          <p className="text-sm text-muted-foreground mb-6">Total Pipeline Value: ₦{(deals.reduce((sum, d) => sum + d.amount, 0) / 1000).toFixed(0)}K</p>
          
          {/* Kanban-style Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto">
            {stages.map((stage) => {
              const stageDeals = deals.filter(d => d.stage === stage);
              return (
                <div key={stage} className="bg-accent/30 rounded-lg p-4 min-w-[250px]">
                  <p className="font-semibold mb-2 text-sm">{stage}</p>
                  <p className="text-xs text-muted-foreground mb-4">₦{(stageDeals.reduce((sum, d) => sum + d.amount, 0) / 1000).toFixed(0)}K</p>
                  <div className="space-y-3">
                    {stageDeals.map((deal) => (
                      <div key={deal.id} className="bg-card border border-border rounded-lg p-3 hover:border-primary transition cursor-pointer">
                        <p className="font-medium text-sm">{deal.name}</p>
                        <p className="text-xs text-muted-foreground mb-2">{deal.company}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">₦{deal.amount.toLocaleString()}</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{deal.probability}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deal Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Deals</p>
            <p className="text-2xl font-bold">{deals.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Avg Deal Value</p>
            <p className="text-2xl font-bold">₦{(deals.reduce((sum, d) => sum + d.amount, 0) / deals.length / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Weighted Pipeline</p>
            <p className="text-2xl font-bold">₦{(deals.reduce((sum, d) => sum + (d.amount * d.probability / 100), 0) / 1000).toFixed(0)}K</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
