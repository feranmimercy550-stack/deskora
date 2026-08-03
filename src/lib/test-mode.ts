// Test mode service for development/testing without payment
'use client';

type SubscriptionPlan = 'free' | 'starter' | 'professional' | 'business' | 'enterprise';

const TEST_MODE_KEY = 'risely_test_mode_enabled';
const TEST_PLAN_KEY = 'risely_test_plan';

export function enableTestMode(plan: SubscriptionPlan = 'enterprise') {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TEST_MODE_KEY, 'true');
  localStorage.setItem(TEST_PLAN_KEY, plan);
  window.location.reload();
}

export function disableTestMode() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TEST_MODE_KEY);
  localStorage.removeItem(TEST_PLAN_KEY);
  window.location.reload();
}

export function isTestModeEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(TEST_MODE_KEY) === 'true';
}

export function getTestPlan(): SubscriptionPlan {
  if (typeof window === 'undefined') return 'free';
  return (localStorage.getItem(TEST_PLAN_KEY) as SubscriptionPlan) || 'enterprise';
}

export function clearTestMode() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TEST_MODE_KEY);
  localStorage.removeItem(TEST_PLAN_KEY);
}

// Get effective plan (test mode takes precedence)
export function getEffectivePlan(actualPlan: SubscriptionPlan): SubscriptionPlan {
  if (isTestModeEnabled()) {
    return getTestPlan();
  }
  return actualPlan;
}
