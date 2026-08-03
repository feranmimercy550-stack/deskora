'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { LockedFeature } from '@/components/LockedFeature';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Filter, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { isFeatureEnabled } from '@/lib/feature-gates';

export default function LeadsPage() {
  const { userPlan = 'free' } = useAuth();
  const hasFeature = isFeatureEnabled(userPlan as any, 'crm');

  const [leads] = useState([
    { id: 1, name: 'Acme Corporation', email: 'contact@acme.com', status: 'hot', value: 50000, source: 'Referral' },
    { id: 2, name: 'Tech Startup Inc', email: 'info@techstartup.com', status: 'warm', value: 25000, source: 'Website' },
    { id: 3, name: 'Global Services Ltd', email: 'sales@globalservices.com', status: 'cold', value: 15000, source: 'Email Campaign' },
  ]);

  if (!hasFeature) {
    return (
      <AppLayout title="Sales Leads" subtitle="Track and manage your sales pipeline">
        <LockedFeature
          feature="Lead Management"
          description="Track sales leads, manage pipelines, and convert opportunities to customers."
          currentPlan={userPlan}
          requiredPlan="Professional"
          benefits={[
            'Unlimited Lead Tracking',
            'Sales Pipeline Visualization',
            'Lead Scoring',
            'Automatic Follow-ups',
            'Lead Source Analytics'
          ]}
        />
      </AppLayout>
    );
  }

  const statusColors: Record<string, string> = {
    hot: 'bg-red-100 text-red-700',
    warm: 'bg-yellow-100 text-yellow-700',
    cold: 'bg-blue-100 text-blue-700'
  };

  return (
    <AppLayout
      title="Sales Leads"
      subtitle="Manage your sales pipeline and track opportunities"
      action={
        <Link
          href="/leads/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Leads</p>
            <p className="text-2xl font-bold">{leads.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Hot Leads</p>
            <p className="text-2xl font-bold text-red-600">{leads.filter(l => l.status === 'hot').length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Pipeline Value</p>
            <p className="text-2xl font-bold">₦{(leads.reduce((sum, l) => sum + l.value, 0) / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-2xl font-bold">32%</p>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter by Status</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="text-left p-4 font-semibold">Company</th>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Value</th>
                <th className="text-left p-4 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-border hover:bg-accent/50 transition">
                  <td className="p-4 font-medium">{lead.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">{lead.email}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[lead.status]}`}>
                      {lead.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 font-medium">₦{lead.value.toLocaleString()}</td>
                  <td className="p-4 text-sm text-muted-foreground">{lead.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
