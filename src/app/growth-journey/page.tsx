'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export default function GrowthJourneyPage() {
  const { userPlan = 'free' } = useAuth();

  const planProgression = [
    {
      plan: 'Free',
      current: userPlan === 'free',
      features: ['Dashboard', 'CRM (50 contacts)', 'Basic Invoices', 'Basic Analytics'],
      nextMilestone: 'Starter'
    },
    {
      plan: 'Starter',
      current: userPlan === 'starter',
      features: ['Everything in Free', 'AI Website Builder', 'Email Marketing', 'WhatsApp Integration', 'Appointment Booking'],
      nextMilestone: 'Professional'
    },
    {
      plan: 'Professional',
      current: userPlan === 'professional',
      features: ['Everything in Starter', 'Team Management', 'Advanced Analytics', 'Projects', 'API Access'],
      nextMilestone: 'Business'
    },
    {
      plan: 'Business',
      current: userPlan === 'business',
      features: ['Everything in Professional', 'Inventory Management', 'HR & Payroll', 'Multi-location', 'AI Business Advisor'],
      nextMilestone: 'Enterprise'
    },
    {
      plan: 'Enterprise',
      current: userPlan === 'enterprise',
      features: ['Everything', 'Unlimited Users', 'White-label', 'Custom Integrations', 'Dedicated Support'],
      nextMilestone: null
    },
  ];

  const [expandedPlan, setExpandedPlan] = useState(userPlan);

  const calculateProgress = () => {
    const plans = ['free', 'starter', 'professional', 'business', 'enterprise'];
    const currentIndex = plans.indexOf(userPlan);
    return ((currentIndex + 1) / plans.length) * 100;
  };

  return (
    <AppLayout
      title="Growth Journey"
      subtitle="Your path to unlocking more powerful features"
    >
      <div className="space-y-6">
        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-2">Your Growth Path</h2>
          <p className="text-muted-foreground mb-6">You're on the <span className="font-semibold capitalize">{userPlan}</span> plan</p>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="font-medium">{Math.round(calculateProgress())}%</span>
            </div>
            <div className="w-full bg-accent rounded-full h-3">
              <div className="bg-primary h-3 rounded-full transition-all duration-500" style={{ width: `${calculateProgress()}%` }} />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              You're making great progress! {userPlan !== 'enterprise' && `Upgrade to unlock more powerful features for your business.`}
            </p>
          </div>
        </div>

        {/* Plan Progression */}
        <div className="space-y-4">
          {planProgression.map((item, index) => (
            <div key={item.plan} className="space-y-0">
              {/* Plan Card */}
              <button
                onClick={() => setExpandedPlan(expandedPlan === item.plan ? '' : item.plan)}
                className={`w-full p-6 rounded-t-lg border-l-4 transition text-left ${
                  item.current
                    ? 'bg-primary/5 border-l-primary border border-primary/20'
                    : 'bg-card border-l-border border border-border hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {item.plan}
                      {item.current && <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Current Plan</span>}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.plan === 'Free' && 'Perfect for getting started'}
                      {item.plan === 'Starter' && 'Great for growing businesses'}
                      {item.plan === 'Professional' && 'For established teams'}
                      {item.plan === 'Business' && 'Full-featured platform'}
                      {item.plan === 'Enterprise' && 'Custom solutions & white-label'}
                    </p>
                  </div>
                  <ArrowRight className={`w-5 h-5 text-muted-foreground transition-transform ${expandedPlan === item.plan ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {/* Features List */}
              {expandedPlan === item.plan && (
                <div className="bg-card border border-t-0 border-border rounded-b-lg p-6 space-y-3">
                  <p className="font-semibold text-sm">Includes:</p>
                  <ul className="space-y-2">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {!item.current && item.nextMilestone && (
                    <div className="pt-4 border-t border-border">
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition mt-4"
                      >
                        Upgrade to {item.plan}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Arrow between plans */}
              {index < planProgression.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-border to-border/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Upgrade Benefits */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Why Upgrade?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="font-semibold text-sm mb-2">Save Time</p>
              <p className="text-sm text-muted-foreground">Automate repetitive tasks and focus on growing your business.</p>
            </div>
            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="font-semibold text-sm mb-2">Grow Revenue</p>
              <p className="text-sm text-muted-foreground">Access tools designed to help you close more deals and retain customers.</p>
            </div>
            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="font-semibold text-sm mb-2">Scale Operations</p>
              <p className="text-sm text-muted-foreground">Manage teams, inventory, and complex workflows as you grow.</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
