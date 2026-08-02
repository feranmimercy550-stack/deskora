import { supabase } from './supabase';

export interface OnboardingStep {
  step: number;
  title: string;
  description: string;
  completed: boolean;
}

// Onboarding steps
export const onboardingSteps: Record<number, OnboardingStep> = {
  1: { step: 1, title: 'Complete Profile', description: 'Fill in your business details', completed: false },
  2: { step: 2, title: 'Add First Customer', description: 'Add your first customer', completed: false },
  3: { step: 3, title: 'Create Invoice', description: 'Create your first invoice', completed: false },
  4: { step: 4, title: 'Setup Payment', description: 'Configure payment methods', completed: false },
  5: { step: 5, title: 'Explore AI', description: 'Try AI-powered features', completed: false }
};

// Initialize onboarding progress
export async function initializeOnboarding(userId: string) {
  const { data, error } = await supabase
    .from('onboarding_progress')
    .insert({
      user_id: userId,
      step_completed: 0,
      profile_completed: false,
      first_customer_added: false,
      first_invoice_created: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error initializing onboarding:', error);
    return null;
  }

  return data;
}

// Get onboarding progress
export async function getOnboardingProgress(userId: string) {
  const { data, error } = await supabase
    .from('onboarding_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching onboarding progress:', error);
  }

  return data;
}

// Complete profile step
export async function completeProfileStep(userId: string) {
  const { error } = await supabase
    .from('onboarding_progress')
    .update({
      profile_completed: true,
      step_completed: 1
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error completing profile step:', error);
    throw error;
  }
}

// Complete customer step
export async function completeCustomerStep(userId: string) {
  const { error } = await supabase
    .from('onboarding_progress')
    .update({
      first_customer_added: true,
      step_completed: 2
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error completing customer step:', error);
    throw error;
  }
}

// Complete invoice step
export async function completeInvoiceStep(userId: string) {
  const { error } = await supabase
    .from('onboarding_progress')
    .update({
      first_invoice_created: true,
      step_completed: 3
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error completing invoice step:', error);
    throw error;
  }
}

// Mark onboarding as complete
export async function completeOnboarding(userId: string) {
  const { error } = await supabase
    .from('onboarding_progress')
    .update({
      step_completed: 5,
      completed_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error completing onboarding:', error);
    throw error;
  }
}

// Get onboarding completion percentage
export async function getOnboardingPercentage(userId: string): Promise<number> {
  const progress = await getOnboardingProgress(userId);
  
  if (!progress) {
    return 0;
  }

  const completedSteps = Object.values({
    profile: progress.profile_completed,
    customer: progress.first_customer_added,
    invoice: progress.first_invoice_created
  }).filter(Boolean).length;

  return Math.round((completedSteps / 3) * 100);
}

// Get next onboarding step
export async function getNextOnboardingStep(userId: string): Promise<OnboardingStep | null> {
  const progress = await getOnboardingProgress(userId);
  
  if (!progress) {
    return onboardingSteps[1] || null;
  }

  const stepNumber = progress.step_completed + 1;
  return onboardingSteps[stepNumber] || null;
}

// Check if onboarding is complete
export async function isOnboardingComplete(userId: string): Promise<boolean> {
  const progress = await getOnboardingProgress(userId);
  return progress?.completed_at !== null || progress?.step_completed >= 5 || false;
}
