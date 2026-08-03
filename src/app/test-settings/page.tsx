'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { enableTestMode, disableTestMode, isTestModeEnabled, getTestPlan } from '@/lib/test-mode';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

type SubscriptionPlan = 'free' | 'starter' | 'professional' | 'business' | 'enterprise';

export default function TestSettingsPage() {
  const [testModeEnabled, setTestModeEnabled] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('enterprise');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTestModeEnabled(isTestModeEnabled());
    setSelectedPlan(getTestPlan());
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  const plans: Array<{ value: SubscriptionPlan; label: string; description: string }> = [
    { value: 'free', label: 'Free', description: 'Basic features only' },
    { value: 'starter', label: 'Starter', description: '+Website, Marketing, Appointments' },
    { value: 'professional', label: 'Professional', description: '+Leads, Deals, Team, Projects' },
    { value: 'business', label: 'Business', description: '+Inventory, HR, AI Advisor' },
    { value: 'enterprise', label: 'Enterprise', description: 'All features (Recommended)' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Test Mode Settings</h1>
          <p className="text-foreground/60">Enable test mode to access all premium features for testing without payment</p>
        </div>

        {/* Warning */}
        <Card className="mb-6 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Development Feature</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">This is for testing and development only. Production users cannot access this page.</p>
            </div>
          </div>
        </Card>

        {/* Current Status */}
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-foreground/60">Test Mode:</span>
              <span className={`font-semibold ${testModeEnabled ? 'text-green-600' : 'text-red-600'}`}>
                {testModeEnabled ? 'ENABLED ✓' : 'DISABLED'}
              </span>
            </div>
            {testModeEnabled && (
              <div className="flex justify-between items-center">
                <span className="text-foreground/60">Active Plan:</span>
                <span className="font-semibold text-blue-600 capitalize">{selectedPlan}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Plan Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Select Test Plan</h2>
          <div className="grid gap-3 mb-6">
            {plans.map((plan) => (
              <button
                key={plan.value}
                onClick={() => setSelectedPlan(plan.value)}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  selectedPlan === plan.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-semibold">{plan.label}</div>
                <div className="text-sm text-foreground/60">{plan.description}</div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                enableTestMode(selectedPlan);
              }}
              className="flex-1 bg-primary hover:bg-primary/90"
              size="lg"
            >
              {testModeEnabled ? 'Update Test Mode' : 'Enable Test Mode'}
            </Button>
            {testModeEnabled && (
              <Button
                onClick={() => {
                  disableTestMode();
                }}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Disable Test Mode
              </Button>
            )}
          </div>
        </Card>

        {/* Features Matrix */}
        <Card className="mt-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Features by Plan</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Feature</th>
                  <th className="text-center py-2 px-2">Free</th>
                  <th className="text-center py-2 px-2">Starter</th>
                  <th className="text-center py-2 px-2">Pro</th>
                  <th className="text-center py-2 px-2">Business</th>
                  <th className="text-center py-2 px-2">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Dashboard', plans: [true, true, true, true, true] },
                  { name: 'Customers', plans: [true, true, true, true, true] },
                  { name: 'Invoicing', plans: [true, true, true, true, true] },
                  { name: 'Website Builder', plans: [false, true, true, true, true] },
                  { name: 'Marketing', plans: [false, true, true, true, true] },
                  { name: 'Appointments', plans: [false, true, true, true, true] },
                  { name: 'Leads & Deals', plans: [false, false, true, true, true] },
                  { name: 'Team Management', plans: [false, false, true, true, true] },
                  { name: 'Projects', plans: [false, false, true, true, true] },
                  { name: 'Inventory', plans: [false, false, false, true, true] },
                  { name: 'HR & Payroll', plans: [false, false, false, true, true] },
                  { name: 'AI Business Advisor', plans: [false, false, false, true, true] },
                  { name: 'Automation', plans: [false, true, true, true, true] },
                  { name: 'White-label', plans: [false, false, false, false, true] },
                ].map((feature) => (
                  <tr key={feature.name} className="border-b hover:bg-secondary/50">
                    <td className="py-2 px-2 font-medium">{feature.name}</td>
                    {feature.plans.map((available, idx) => (
                      <td key={idx} className="text-center py-2 px-2">
                        {available ? '✓' : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
