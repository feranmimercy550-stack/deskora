'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserSubscription, getSubscriptionPlans } from '@/lib/subscription-service';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface Subscription {
  id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  subscription_plans: {
    name: string;
    slug: string;
    price_monthly: number;
  };
}

interface Plan {
  id: string;
  name: string;
  slug: string;
  price_monthly: number;
}

export function BillingSection() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBillingData();
  }, [user?.id]);

  const loadBillingData = async () => {
    if (!user?.id) return;

    try {
      const [sub, plansList] = await Promise.all([
        getUserSubscription(user.id),
        getSubscriptionPlans()
      ]);
      setSubscription(sub);
      setPlans(plansList);
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      {subscription ? (
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Manage your subscription and billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {subscription.subscription_plans.name}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    ${subscription.subscription_plans.price_monthly}/month
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Billing period: {formatDate(subscription.current_period_start)} to{' '}
                    {formatDate(subscription.current_period_end)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <CreditCard className="w-4 h-4" />
                  <span>•••• •••• •••• 4242</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline">Update Payment Method</Button>
              <Button variant="outline">Download Invoice</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Active Plan</CardTitle>
            <CardDescription>Choose a plan to get started with Risely</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/pricing">
              <Button>
                View Plans
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Upgrade/Downgrade */}
      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle>Change Plan</CardTitle>
            <CardDescription>Upgrade or downgrade your subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {plans.map((plan: any) => (
                <Card key={plan.id} className={`cursor-pointer hover:shadow-lg transition-shadow ${
                  subscription.subscription_plans.slug === plan.slug ? 'ring-2 ring-purple-600' : ''
                }`}>
                  <CardHeader>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-4">${plan.price_monthly}</div>
                    {subscription.subscription_plans.slug === plan.slug ? (
                      <Button disabled className="w-full">Current Plan</Button>
                    ) : (
                      <Button 
                        variant={plan.slug === 'professional' ? 'default' : 'outline'}
                        className="w-full"
                      >
                        Switch
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your recent invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex items-center justify-between py-4 border-b last:border-0">
                <div>
                  <p className="font-medium">Invoice #{1000 + idx}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(Date.now() - idx * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$79.00</p>
                  <p className="text-sm text-green-600">Paid</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="link" className="mt-4">View All Invoices</Button>
        </CardContent>
      </Card>

      {/* Tax Information */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Information</CardTitle>
          <CardDescription>Manage your tax details for billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              Add your tax ID to get tax exemption benefits where applicable.
            </p>
          </div>
          <Button variant="outline" className="w-full">Add Tax Information</Button>
        </CardContent>
      </Card>
    </div>
  );
}
