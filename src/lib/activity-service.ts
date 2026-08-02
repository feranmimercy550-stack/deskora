import { supabase } from './supabase';

export type ActivityAction = 
  | 'user_signup'
  | 'profile_updated'
  | 'invoice_created'
  | 'invoice_paid'
  | 'customer_added'
  | 'payment_received'
  | 'plan_upgraded'
  | 'plan_downgraded'
  | 'team_member_added'
  | 'report_generated'
  | 'integration_connected';

// Log activity
export async function logActivity(
  userId: string,
  action: ActivityAction,
  resourceType?: string,
  resourceId?: string,
  metadata?: Record<string, any>
) {
  const { error } = await supabase
    .from('activity_logs')
    .insert({
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata: metadata || {}
    });

  if (error) {
    console.error('Error logging activity:', error);
  }
}

// Get user's recent activity
export async function getUserActivity(userId: string, limit: number = 20) {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching activity:', error);
    return [];
  }

  return data || [];
}

// Get activity summary
export async function getActivitySummary(userId: string, days: number = 30) {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('action')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

  if (error) {
    console.error('Error fetching activity summary:', error);
    return {};
  }

  const summary: Record<string, number> = {};
  (data || []).forEach(log => {
    summary[log.action] = (summary[log.action] || 0) + 1;
  });

  return summary;
}

// Create notification
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  actionUrl?: string
) {
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      message,
      action_url: actionUrl,
      is_read: false
    });

  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

// Get user's notifications
export async function getUserNotifications(userId: string, unreadOnly: boolean = false) {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId);

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data || [];
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
}

// Get unread notification count
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error getting notification count:', error);
    return 0;
  }

  return count || 0;
}

// Delete notification
export async function deleteNotification(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

// Send actionable notifications for key events
export async function notifyUser(userId: string, event: 'invoice_paid' | 'payment_received' | 'new_customer' | 'plan_upgraded') {
  const messages = {
    invoice_paid: {
      title: 'Invoice Paid',
      message: 'You received a payment for an invoice.',
      type: 'payment'
    },
    payment_received: {
      title: 'Payment Received',
      message: 'A customer payment has been received.',
      type: 'payment'
    },
    new_customer: {
      title: 'New Customer Added',
      message: 'A new customer has been added to your account.',
      type: 'customer'
    },
    plan_upgraded: {
      title: 'Plan Upgraded',
      message: 'Your subscription has been upgraded.',
      type: 'billing'
    }
  };

  const msg = messages[event];
  await createNotification(userId, msg.type, msg.title, msg.message);
}
