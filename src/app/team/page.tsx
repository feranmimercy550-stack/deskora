'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { LockedFeature } from '@/components/LockedFeature';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Mail, Shield, UserX } from 'lucide-react';
import Link from 'next/link';
import { isFeatureEnabled } from '@/lib/feature-gates';

export default function TeamPage() {
  const { userPlan = 'free' } = useAuth();
  const hasFeature = isFeatureEnabled(userPlan as any, 'teamManagement');

  const [members] = useState([
    { id: 1, name: 'You', email: 'your@email.com', role: 'Owner', joined: '2024-01-01', status: 'active' },
    { id: 2, name: 'Alice Johnson', email: 'alice@company.com', role: 'Manager', joined: '2024-01-15', status: 'active' },
    { id: 3, name: 'Bob Smith', email: 'bob@company.com', role: 'Viewer', joined: '2024-02-01', status: 'active' },
  ]);

  if (!hasFeature) {
    return (
      <AppLayout title="Team Management" subtitle="Manage team members and permissions">
        <LockedFeature
          feature="Team Management"
          description="Add team members, set permissions, and manage roles."
          currentPlan={userPlan}
          requiredPlan="Professional"
          benefits={[
            'Unlimited Team Members',
            'Role-based Permissions',
            'Activity Tracking',
            'Department Management',
            'Attendance Tracking'
          ]}
        />
      </AppLayout>
    );
  }

  const roleColors: Record<string, string> = {
    Owner: 'bg-purple-100 text-purple-700',
    Manager: 'bg-blue-100 text-blue-700',
    Editor: 'bg-green-100 text-green-700',
    Viewer: 'bg-gray-100 text-gray-700'
  };

  return (
    <AppLayout
      title="Team Management"
      subtitle="Manage team members and permissions"
      action={
        <Link
          href="/team/invite"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Team Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Members</p>
            <p className="text-2xl font-bold">{members.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-green-600">{members.filter(m => m.status === 'active').length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Seat Usage</p>
            <p className="text-2xl font-bold">{members.length} / 5</p>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Role</th>
                <th className="text-left p-4 font-semibold">Joined</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-border hover:bg-accent/50 transition">
                  <td className="p-4 font-medium">{member.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">{member.email}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${roleColors[member.role]}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{new Date(member.joined).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <div className="flex gap-2">
                      {member.id !== 1 && (
                        <>
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
                            <Shield className="w-4 h-4" />
                          </button>
                          <button className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 transition">
                            <UserX className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending Invitations */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Pending Invitations
          </h3>
          <p className="text-sm text-muted-foreground">No pending invitations at this time.</p>
        </div>

        {/* Roles & Permissions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Roles & Permissions</h3>
          <div className="space-y-3">
            {[
              { role: 'Owner', perms: 'Full access to all features and settings' },
              { role: 'Manager', perms: 'Can manage customers, invoices, and team members' },
              { role: 'Editor', perms: 'Can create and edit invoices and customers' },
              { role: 'Viewer', perms: 'Read-only access to all data' }
            ].map((item) => (
              <div key={item.role} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.role}</p>
                  <p className="text-xs text-muted-foreground">{item.perms}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
