'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { LockedFeature } from '@/components/LockedFeature';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Zap, GitBranch, Play, Pause } from 'lucide-react';
import Link from 'next/link';
import { isFeatureEnabled } from '@/lib/feature-gates';

export default function AutomationPage() {
  const { userPlan = 'free' } = useAuth();
  const hasFeature = isFeatureEnabled(userPlan as any, 'automation');

  const [workflows] = useState([
    {
      id: 1,
      name: 'Send Invoice Reminder',
      trigger: 'Invoice Overdue',
      actions: ['Send Email', 'Add Note to CRM'],
      status: 'active',
      runs: 45,
      lastRun: '2024-02-10'
    },
    {
      id: 2,
      name: 'New Customer Welcome',
      trigger: 'Customer Added',
      actions: ['Send Welcome Email', 'Create Task', 'Send WhatsApp'],
      status: 'active',
      runs: 23,
      lastRun: '2024-02-12'
    },
    {
      id: 3,
      name: 'Payment Confirmation',
      trigger: 'Payment Received',
      actions: ['Send Receipt', 'Update Invoice'],
      status: 'inactive',
      runs: 12,
      lastRun: '2024-02-08'
    },
  ]);

  if (!hasFeature) {
    return (
      <AppLayout title="Automation" subtitle="Build automated workflows">
        <LockedFeature
          feature="Workflow Automation"
          description="Create powerful automations with triggers and actions without coding."
          currentPlan={userPlan}
          requiredPlan="Starter"
          benefits={[
            'Workflow Builder',
            'Email Automation',
            'CRM Updates',
            'Conditional Logic',
            'Multi-step Actions'
          ]}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Automation"
      subtitle="Create and manage automated workflows"
      action={
        <Link
          href="/automation/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          Create Workflow
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Workflows</p>
            <p className="text-2xl font-bold">{workflows.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-green-600">{workflows.filter(w => w.status === 'active').length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Runs</p>
            <p className="text-2xl font-bold">{workflows.reduce((sum, w) => sum + w.runs, 0)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold">99.2%</p>
          </div>
        </div>

        {/* Workflows List */}
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{workflow.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-4 h-4" />
                      Trigger: {workflow.trigger}
                    </span>
                    <span>Runs: {workflow.runs}</span>
                  </div>
                </div>
                <button className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  workflow.status === 'active'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}>
                  {workflow.status === 'active' ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Enable
                    </>
                  )}
                </button>
              </div>

              <div className="mb-4 p-3 bg-accent/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {workflow.actions.map((action, i) => (
                    <span key={i} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {action}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Last run: {new Date(workflow.lastRun).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Templates */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Popular Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Payment Reminder', desc: 'Send reminder for unpaid invoices' },
              { name: 'Lead Nurture', desc: 'Auto-send follow-ups to leads' },
              { name: 'Customer Onboarding', desc: 'Welcome sequence for new customers' },
            ].map((template) => (
              <button key={template.name} className="p-4 border border-border rounded-lg hover:border-primary hover:bg-accent/50 transition text-left">
                <p className="font-medium text-sm">{template.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{template.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
