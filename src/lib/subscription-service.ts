import { supabase } from './supabase';

export interface SubscriptionPlan {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  max_customers?: number | null;
  max_invoices?: number | null;
  max_users?: number | null;
}

// Default subscription plans for Risely
export const defaultPlans: SubscriptionPlan[] = [
  {
    name: 'Starter',
    slug: 'starter',
    description: 'Perfect for freelancers and small businesses',
    price_monthly: 29,
    price_yearly: 290,
    features: [
      'Up to 10 customers',
      'Unlimited invoices',
      'Email support',
      'Basic reports',
      'Invoice templates'
    ],
    max_customers: 10,
    max_invoices: null,
    max_users: 1
  },
  {
    name: 'Professional',
    slug: 'professional',
    description: 'For growing businesses',
    price_monthly: 79,
    price_yearly: 790,
    features: [
      'Up to 100 customers',
      'Unlimited invoices',
      'Priority email & chat support',
      'Advanced reports & analytics',
      'Invoice templates',
      'AI-powered insights',
      'Up to 3 team members',
      'Custom branding'
    ],
    max_customers: 100,
    max_invoices: null,
    max_users: 3
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'For large organizations',
    price_monthly: 199,
    price_yearly: 1990,
    features: [
      'Unlimited customers',
      'Unlimited invoices',
      '24/7 phone & chat support',
      'Advanced analytics & AI',
      'Custom integrations',
      'Unlimited team members',
      'White-label options',
      'API access',
      'Dedicated account manager'
    ],
    max_customers: null,
    max_invoices: null,
    max_users: null
  }
];

// Initialize subscription plans in database
export async function initializeSubscriptionPlans() {
  const plans = defaultPlans.map(plan => ({
    name: plan.name,
    slug: plan.slug,
    description: plan.description,
    price_monthly: plan.price_monthly,
    price_yearly: plan.price_yearly,
    features: plan.features,
    max_customers: plan.max_customers,
    max_invoices: plan.max_invoices,
    max_users: plan.max_users,
    is_active: true
  }));

  const { error } = await supabase
    .from('subscription_plans')
    .upsert(plans, { onConflict: 'slug' });

  if (error) {
    console.error('Error initializing subscription plans:', error);
    throw error;
  }
}

// Get user's current subscription
export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      subscription_plans (*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching subscription:', error);
  }

  return data;
}

// Get all active plans
export async function getSubscriptionPlans() {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('price_monthly', { ascending: true });

  if (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }

  return data;
}

// Create a new subscription
export async function createSubscription(
  userId: string,
  planId: string,
  paymentMethodId?: string
) {
  const now = new Date();
  const currentPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_id: planId,
      status: 'active',
      current_period_start: now.toISOString(),
      current_period_end: currentPeriodEnd.toISOString(),
      payment_method_id: paymentMethodId,
      auto_renew: true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }

  return data;
}

// Update subscription plan
export async function updateSubscriptionPlan(
  subscriptionId: string,
  newPlanId: string
) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ plan_id: newPlanId })
    .eq('id', subscriptionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }

  return data;
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('id', subscriptionId)
    .select()
    .single();

  if (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }

  return data;
}

// Check plan features for user
export async function checkPlanFeature(userId: string, feature: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription) {
    return false;
  }

  const features = subscription.subscription_plans?.features || [];
  return features.includes(feature);
}

// Get plan feature limits
export async function getPlanLimits(userId: string) {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription) {
    return { maxCustomers: 0, maxInvoices: 0, maxUsers: 1 };
  }

  return {
    maxCustomers: subscription.subscription_plans?.max_customers || 10,
    maxInvoices: subscription.subscription_plans?.max_invoices || 100,
    maxUsers: subscription.subscription_plans?.max_users || 1
  };
}
