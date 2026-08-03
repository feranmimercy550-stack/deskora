'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { LockedFeature } from '@/components/LockedFeature';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Mail, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';
import { isFeatureEnabled } from '@/lib/feature-gates';

export default function MarketingPage() {
  const { userPlan = 'free' } = useAuth();
  const hasFeature = isFeatureEnabled(userPlan as any, 'marketing');

  const [campaigns] = useState([
    {
      id: 1,
      name: 'January Newsletter',
      type: 'email',
      status: 'sent',
      recipients: 245,
      opens: 89,
      clicks: 34
    },
    {
      id: 2,
      name: 'New Year Promotion',
      type: 'sms',
      status: 'scheduled',
      recipients: 180,
      opens: 0,
      clicks: 0
    },
    {
      id: 3,
      name: 'WhatsApp Welcome',
      type: 'whatsapp',
      status: 'active',
      recipients: 320,
      opens: 145,
      clicks: 67
    }
  ]);

  if (!hasFeature) {
    return (
      <AppLayout title="Marketing" subtitle="Email, SMS, and WhatsApp campaigns">
        <LockedFeature
          feature="Marketing Automation"
          description="Create and automate email, SMS, and WhatsApp campaigns to reach your customers."
          currentPlan={userPlan}
          requiredPlan="Starter"
          benefits={[
            'Email Campaign Builder',
            'SMS & WhatsApp Integration',
            'Automation Workflows',
            'Segmentation & Targeting',
            'Analytics & Reports'
          ]}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Marketing"
      subtitle="Email, SMS, and WhatsApp campaigns"
      action={
        <Link
          href="/marketing/new-campaign"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Campaign Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Campaigns</p>
            <p className="text-2xl font-bold">{campaigns.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Recipients</p>
            <p className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.recipients, 0)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Avg Open Rate</p>
            <p className="text-2xl font-bold">36%</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Avg Click Rate</p>
            <p className="text-2xl font-bold">14%</p>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="text-left p-4 font-semibold">Campaign</th>
                <th className="text-left p-4 font-semibold">Type</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Recipients</th>
                <th className="text-left p-4 font-semibold">Open Rate</th>
                <th className="text-left p-4 font-semibold">CTR</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => {
                const openRate = campaign.recipients > 0 ? ((campaign.opens / campaign.recipients) * 100).toFixed(1) : '0';
                const ctr = campaign.opens > 0 ? ((campaign.clicks / campaign.opens) * 100).toFixed(1) : '0';
                
                return (
                  <tr key={campaign.id} className="border-b border-border hover:bg-accent/50 transition">
                    <td className="p-4 font-medium">{campaign.name}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-2">
                        {campaign.type === 'email' && <Mail className="w-4 h-4" />}
                        {campaign.type === 'sms' && <MessageSquare className="w-4 h-4" />}
                        {campaign.type === 'whatsapp' && <Send className="w-4 h-4" />}
                        {campaign.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        campaign.status === 'sent' ? 'bg-green-100 text-green-700' :
                        campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">{campaign.recipients}</td>
                    <td className="p-4">{openRate}%</td>
                    <td className="p-4">{ctr}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Channel Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Mail className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">Email Campaigns</h3>
            <p className="text-sm text-muted-foreground mb-4">Create professional email campaigns with templates</p>
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition text-sm font-medium">
              Create Email
            </button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">WhatsApp Campaigns</h3>
            <p className="text-sm text-muted-foreground mb-4">Send personalized WhatsApp messages</p>
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition text-sm font-medium">
              Send WhatsApp
            </button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Send className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">SMS Campaigns</h3>
            <p className="text-sm text-muted-foreground mb-4">Send SMS messages to your contacts</p>
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition text-sm font-medium">
              Send SMS
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
