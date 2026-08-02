import { supabase } from './supabase';

export interface EmailTemplate {
  name: string;
  category: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables?: Record<string, string>;
}

// Email template library
export const emailTemplates: Record<string, EmailTemplate> = {
  welcome: {
    name: 'Welcome',
    category: 'onboarding',
    subject: 'Welcome to Risely – Your AI Business Operating System',
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%); padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Risely!</h1>
        </div>
        <div style="background: white; padding: 40px 20px; border-radius: 0 0 12px 12px;">
          <p style="color: #333; font-size: 16px; line-height: 1.6;">Hi {{fullName}},</p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for signing up! We're excited to help you run your business smarter with AI-powered insights and automation.
          </p>
          <div style="margin: 30px 0;">
            <a href="{{dashboardUrl}}" style="background: linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 600;">
              Get Started
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">Questions? Reply to this email or visit our help center.</p>
        </div>
      </div>
    `,
    variables: {
      fullName: 'User Full Name',
      dashboardUrl: 'Dashboard URL'
    }
  },
  
  invoiceCreated: {
    name: 'Invoice Created',
    category: 'invoices',
    subject: 'Invoice {{invoiceNumber}} created in Risely',
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #5B21B6;">
          <h2 style="margin: 0 0 15px 0; color: #333;">Invoice {{invoiceNumber}} Created</h2>
          <p style="margin: 0; color: #666;">Amount: <strong>{{amount}}</strong></p>
          <p style="margin: 10px 0 0 0; color: #666;">Customer: <strong>{{customerName}}</strong></p>
        </div>
      </div>
    `,
    variables: {
      invoiceNumber: 'Invoice Number',
      amount: 'Amount',
      customerName: 'Customer Name'
    }
  },

  paymentReceived: {
    name: 'Payment Received',
    category: 'payments',
    subject: 'Payment received – {{amount}}',
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f0fdf4; padding: 20px; border-left: 4px solid #16a34a;">
          <h2 style="margin: 0 0 15px 0; color: #166534;">Payment Received!</h2>
          <p style="margin: 0; color: #15803d;">Amount: <strong>{{amount}}</strong></p>
          <p style="margin: 10px 0 0 0; color: #15803d;">Reference: <strong>{{reference}}</strong></p>
        </div>
      </div>
    `,
    variables: {
      amount: 'Amount',
      reference: 'Payment Reference'
    }
  },

  subscriptionRenewal: {
    name: 'Subscription Renewal',
    category: 'billing',
    subject: 'Your Risely subscription renews on {{date}}',
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: white; padding: 40px 20px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Subscription Renewal Notice</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Your {{planName}} subscription will automatically renew on {{date}} for {{amount}}.
          </p>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">
            No action is needed. You'll continue to have full access to Risely.
          </p>
        </div>
      </div>
    `,
    variables: {
      planName: 'Plan Name',
      date: 'Renewal Date',
      amount: 'Amount'
    }
  },

  teamInvitation: {
    name: 'Team Invitation',
    category: 'team',
    subject: '{{inviterName}} invited you to join {{businessName}} on Risely',
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: white; padding: 40px 20px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">You've been invited!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            {{inviterName}} invited you to collaborate on {{businessName}} using Risely.
          </p>
          <div style="margin: 30px 0;">
            <a href="{{inviteUrl}}" style="background: linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 600;">
              Accept Invitation
            </a>
          </div>
        </div>
      </div>
    `,
    variables: {
      inviterName: 'Inviter Name',
      businessName: 'Business Name',
      inviteUrl: 'Invite URL'
    }
  },

  weeklyReport: {
    name: 'Weekly Report',
    category: 'reports',
    subject: 'Your weekly Risely report – {{week}}',
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: white; padding: 40px 20px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Your Weekly Report</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; color: #666;"><strong>Revenue:</strong> {{revenue}}</p>
            <p style="margin: 10px 0 0 0; color: #666;"><strong>New Customers:</strong> {{newCustomers}}</p>
          </div>
          <a href="{{reportUrl}}" style="color: #5B21B6; text-decoration: none; font-weight: 600;">View full report →</a>
        </div>
      </div>
    `,
    variables: {
      week: 'Week',
      revenue: 'Revenue',
      newCustomers: 'New Customers',
      reportUrl: 'Report URL'
    }
  },

  passwordReset: {
    name: 'Password Reset',
    category: 'security',
    subject: 'Reset your Risely password',
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: white; padding: 40px 20px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Password Reset Request</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We received a request to reset your password. Click the button below to set a new password.
          </p>
          <div style="margin: 30px 0;">
            <a href="{{resetUrl}}" style="background: #d32f2f; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 600;">
              Reset Password
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">This link expires in 24 hours. If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `,
    variables: {
      resetUrl: 'Reset URL'
    }
  },

  confirmEmail: {
    name: 'Confirm Email',
    category: 'security',
    subject: 'Confirm your email address',
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: white; padding: 40px 20px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Verify Your Email</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Click the button below to confirm your email address and activate your account.
          </p>
          <div style="margin: 30px 0;">
            <a href="{{confirmUrl}}" style="background: linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 600;">
              Confirm Email
            </a>
          </div>
        </div>
      </div>
    `,
    variables: {
      confirmUrl: 'Confirmation URL'
    }
  }
};

// Function to render template with variables
export function renderTemplate(templateKey: string, variables: Record<string, string>): { subject: string; html: string } {
  const template = emailTemplates[templateKey];
  if (!template) {
    throw new Error(`Template ${templateKey} not found`);
  }

  let subject = template.subject;
  let html = template.htmlContent;

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(regex, value);
    html = html.replace(regex, value);
  });

  return { subject, html };
}

// Function to save templates to database
export async function saveEmailTemplates() {
  const templates = Object.entries(emailTemplates).map(([key, template]) => ({
    name: template.name,
    category: template.category,
    subject: template.subject,
    html_content: template.htmlContent,
    text_content: template.textContent || '',
    variables: template.variables || {}
  }));

  const { error } = await supabase
    .from('email_templates')
    .upsert(templates, { onConflict: 'name' });

  if (error) {
    console.error('Error saving email templates:', error);
    throw error;
  }
}

// Function to send emails (ready for Resend integration)
export async function sendEmail(to: string, templateKey: string, variables: Record<string, string>) {
  const { subject, html } = renderTemplate(templateKey, variables);

  try {
    // This will be connected to Resend API
    console.log('Email prepared:', { to, subject, templateKey });
    return { success: true, subject, html };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
