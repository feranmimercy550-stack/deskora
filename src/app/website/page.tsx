'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { LockedFeature } from '@/components/LockedFeature';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Globe, Layout, Palette } from 'lucide-react';
import Link from 'next/link';
import { isFeatureEnabled } from '@/lib/feature-gates';

export default function WebsitePage() {
  const { userPlan = 'free' } = useAuth();
  const hasFeature = isFeatureEnabled(userPlan as any, 'website');

  const [websites] = useState([
    {
      id: 1,
      name: 'My Business Website',
      domain: 'mybusiness.risely.app',
      template: 'Professional',
      visitors: 1234,
      status: 'published'
    }
  ]);

  if (!hasFeature) {
    return (
      <AppLayout title="Website Builder" subtitle="Create and customize your business website">
        <LockedFeature
          feature="Website Builder"
          description="Create a professional website without coding. Use AI-powered templates and drag-and-drop editor."
          currentPlan={userPlan}
          requiredPlan="Starter"
          benefits={[
            'AI Website Generator',
            'Drag and Drop Editor',
            'Professional Templates',
            'Custom Domain Support',
            'SEO Optimization'
          ]}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Website Builder"
      subtitle="Create and manage your business website"
      action={
        <Link
          href="/website/create"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          New Website
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Templates Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Website Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Professional', 'Creative', 'Minimal', 'Corporate', 'Ecommerce', 'Service-Based'].map((template) => (
              <div key={template} className="border border-border rounded-lg p-4 hover:border-primary cursor-pointer transition">
                <Layout className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="font-medium">{template}</p>
                <p className="text-sm text-muted-foreground">Ready to use</p>
              </div>
            ))}
          </div>
        </div>

        {/* Your Websites */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Your Websites</h3>
          <div className="space-y-2">
            {websites.map((website) => (
              <div key={website.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{website.name}</p>
                    <p className="text-sm text-muted-foreground">{website.domain}</p>
                  </div>
                </div>
                <span className="text-sm font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">Published</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customization Options */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Customization Features
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-center gap-2">✓ <span>Custom Domain</span></li>
            <li className="flex items-center gap-2">✓ <span>SEO Optimization</span></li>
            <li className="flex items-center gap-2">✓ <span>Blog Integration</span></li>
            <li className="flex items-center gap-2">✓ <span>Analytics Tracking</span></li>
            <li className="flex items-center gap-2">✓ <span>Email Forms</span></li>
            <li className="flex items-center gap-2">✓ <span>Payment Integration</span></li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
