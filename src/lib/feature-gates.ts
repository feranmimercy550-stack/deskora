// Feature gates based on subscription plans
export type PlanType = 'free' | 'starter' | 'professional' | 'business' | 'enterprise';

export interface FeatureGates {
  dashboard: boolean;
  website: boolean;
  crm: boolean;
  invoicing: boolean;
  basicAnalytics: boolean;
  settings: boolean;
  aiAssistant: boolean;
  automation: boolean;
  marketing: boolean;
  advancedReports: boolean;
  teamManagement: boolean;
  inventory: boolean;
  api: boolean;
  marketplace: boolean;
  appointments: boolean;
  projects: boolean;
  aiBusinessAdvisor: boolean;
  payroll: boolean;
  whiteLabelFeatures: boolean;
  customIntegrations: boolean;
  enterpriseSupport: boolean;
}

const featuresByPlan: Record<PlanType, FeatureGates> = {
  free: {
    dashboard: true,
    website: true, // basic only
    crm: true, // 50 contacts
    invoicing: true, // basic
    basicAnalytics: true,
    settings: true,
    aiAssistant: false,
    automation: false,
    marketing: false,
    advancedReports: false,
    teamManagement: false,
    inventory: false,
    api: false,
    marketplace: false,
    appointments: false,
    projects: false,
    aiBusinessAdvisor: false,
    payroll: false,
    whiteLabelFeatures: false,
    customIntegrations: false,
    enterpriseSupport: false,
  },
  starter: {
    dashboard: true,
    website: true,
    crm: true,
    invoicing: true,
    basicAnalytics: true,
    settings: true,
    aiAssistant: true,
    automation: true, // basic
    marketing: true, // email, sms, whatsapp
    advancedReports: false,
    teamManagement: false,
    inventory: false,
    api: false,
    marketplace: false,
    appointments: true,
    projects: false,
    aiBusinessAdvisor: false,
    payroll: false,
    whiteLabelFeatures: false,
    customIntegrations: false,
    enterpriseSupport: false,
  },
  professional: {
    dashboard: true,
    website: true,
    crm: true,
    invoicing: true,
    basicAnalytics: true,
    settings: true,
    aiAssistant: true,
    automation: true,
    marketing: true,
    advancedReports: true,
    teamManagement: true,
    inventory: false,
    api: true,
    marketplace: false,
    appointments: true,
    projects: true,
    aiBusinessAdvisor: false,
    payroll: false,
    whiteLabelFeatures: false,
    customIntegrations: false,
    enterpriseSupport: false,
  },
  business: {
    dashboard: true,
    website: true,
    crm: true,
    invoicing: true,
    basicAnalytics: true,
    settings: true,
    aiAssistant: true,
    automation: true,
    marketing: true,
    advancedReports: true,
    teamManagement: true,
    inventory: true,
    api: true,
    marketplace: false,
    appointments: true,
    projects: true,
    aiBusinessAdvisor: true,
    payroll: true,
    whiteLabelFeatures: false,
    customIntegrations: false,
    enterpriseSupport: false,
  },
  enterprise: {
    dashboard: true,
    website: true,
    crm: true,
    invoicing: true,
    basicAnalytics: true,
    settings: true,
    aiAssistant: true,
    automation: true,
    marketing: true,
    advancedReports: true,
    teamManagement: true,
    inventory: true,
    api: true,
    marketplace: true,
    appointments: true,
    projects: true,
    aiBusinessAdvisor: true,
    payroll: true,
    whiteLabelFeatures: true,
    customIntegrations: true,
    enterpriseSupport: true,
  },
};

export function getFeatureGates(plan: PlanType): FeatureGates {
  // Check if test mode is enabled - only works on client side
  if (typeof window !== 'undefined') {
    try {
      const testModeEnabled = localStorage.getItem('risely_test_mode_enabled') === 'true';
      if (testModeEnabled) {
        const testPlan = (localStorage.getItem('risely_test_plan') as PlanType) || 'enterprise';
        return featuresByPlan[testPlan] || featuresByPlan.enterprise;
      }
    } catch (e) {
      // localStorage not available, continue with normal plan
    }
  }
  
  return featuresByPlan[plan] || featuresByPlan.free;
}

export function isFeatureEnabled(plan: PlanType, feature: keyof FeatureGates): boolean {
  const gates = getFeatureGates(plan);
  return gates[feature] as boolean;
}
