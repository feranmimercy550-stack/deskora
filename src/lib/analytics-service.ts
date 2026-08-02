export interface DashboardMetrics {
  totalRevenue: number;
  totalInvoices: number;
  totalCustomers: number;
  averageInvoiceValue: number;
  outstandingInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  revenueGrowth: number;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  topCustomers: Array<{ name: string; revenue: number }>;
}

// Mock data for demonstration
export const mockDashboardMetrics: DashboardMetrics = {
  totalRevenue: 25430,
  totalInvoices: 47,
  totalCustomers: 12,
  averageInvoiceValue: 541,
  outstandingInvoices: 8,
  paidInvoices: 38,
  overdueInvoices: 1,
  revenueGrowth: 12.5,
  revenueByMonth: [
    { month: 'Jan', revenue: 4200 },
    { month: 'Feb', revenue: 3800 },
    { month: 'Mar', revenue: 5100 },
    { month: 'Apr', revenue: 4900 },
    { month: 'May', revenue: 5430 },
    { month: 'Jun', revenue: 2000 }
  ],
  topCustomers: [
    { name: 'Acme Corp', revenue: 5430 },
    { name: 'Tech Startup Inc', revenue: 3200 },
    { name: 'Global Services', revenue: 2800 },
    { name: 'Local Business', revenue: 2100 }
  ]
};

// Get dashboard metrics
export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  try {
    // TODO: Replace with actual database queries
    // This will fetch real data from customers, invoices, and payments tables
    return mockDashboardMetrics;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return mockDashboardMetrics;
  }
}

// Get revenue forecast
export async function getRevenueForecast(userId: string, months: number = 6) {
  try {
    const forecast = Array.from({ length: months }, (_, i) => ({
      month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short'
      }),
      projected: Math.round(3000 + Math.random() * 3000),
      actual: i < 3 ? Math.round(3000 + Math.random() * 3000) : null
    }));

    return forecast;
  } catch (error) {
    console.error('Error calculating revenue forecast:', error);
    return [];
  }
}

// Get customer insights
export async function getCustomerInsights(userId: string) {
  try {
    return {
      totalCustomers: 12,
      newThisMonth: 3,
      activeCustomers: 10,
      churnedCustomers: 2,
      customerSatisfactionScore: 4.7,
      topIndustry: 'Technology',
      avgCustomerLifetimeValue: 2119
    };
  } catch (error) {
    console.error('Error fetching customer insights:', error);
    return null;
  }
}

// Get payment insights
export async function getPaymentInsights(userId: string) {
  try {
    return {
      onTimePaymentRate: 92.5,
      averagePaymentTime: 18, // days
      mostCommonPaymentMethod: 'Credit Card',
      refundRate: 0.8,
      paymentSuccessRate: 98.2,
      failedTransactions: 3
    };
  } catch (error) {
    console.error('Error fetching payment insights:', error);
    return null;
  }
}

// Get business health score
export async function getBusinessHealthScore(userId: string): Promise<number> {
  try {
    const metrics = await getDashboardMetrics(userId);
    const customerInsights = await getCustomerInsights(userId);
    const paymentInsights = await getPaymentInsights(userId);

    if (!customerInsights || !paymentInsights) return 0;

    let score = 50; // Base score

    // Revenue growth
    score += metrics.revenueGrowth > 10 ? 15 : metrics.revenueGrowth > 0 ? 10 : 0;

    // Invoice collection
    score += customerInsights.activeCustomers > 10 ? 15 : customerInsights.activeCustomers > 5 ? 10 : 5;

    // Payment success
    score += paymentInsights.paymentSuccessRate > 95 ? 15 : paymentInsights.paymentSuccessRate > 90 ? 10 : 5;

    // Overdue invoices
    score -= metrics.overdueInvoices * 5;

    return Math.min(100, Math.max(0, score));
  } catch (error) {
    console.error('Error calculating health score:', error);
    return 0;
  }
}
