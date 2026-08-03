'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { LockedFeature } from '@/components/LockedFeature';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Calendar, Clock, MapPin, Video } from 'lucide-react';
import Link from 'next/link';
import { isFeatureEnabled } from '@/lib/feature-gates';

export default function AppointmentsPage() {
  const { userPlan = 'free' } = useAuth();
  const hasFeature = isFeatureEnabled(userPlan as any, 'appointments');

  const [appointments] = useState([
    {
      id: 1,
      title: 'Client Meeting - Acme Corp',
      client: 'John Doe',
      date: new Date(Date.now() + 86400000),
      time: '10:00 AM',
      type: 'video',
      duration: '30 mins',
      link: 'zoom.us/meeting/123'
    },
    {
      id: 2,
      title: 'Project Kickoff',
      client: 'Jane Smith',
      date: new Date(Date.now() + 172800000),
      time: '2:00 PM',
      type: 'in-person',
      duration: '1 hour',
      location: 'Conference Room A'
    },
  ]);

  if (!hasFeature) {
    return (
      <AppLayout title="Appointments" subtitle="Schedule and manage client meetings">
        <LockedFeature
          feature="Appointment Booking"
          description="Schedule meetings, sync with calendar, and send automatic reminders to clients."
          currentPlan={userPlan}
          requiredPlan="Starter"
          benefits={[
            'Online Booking Calendar',
            'Video Call Integration',
            'Automatic Reminders',
            'Calendar Sync',
            'Meeting Links'
          ]}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Appointments"
      subtitle="Schedule and manage client meetings"
      action={
        <Link
          href="/appointments/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          Schedule Appointment
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Calendar View */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Your Schedule
          </h3>
          <div className="grid grid-cols-7 gap-2 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-sm">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square flex items-center justify-center border border-border rounded-lg text-sm hover:bg-accent transition cursor-pointer"
              >
                {i < 3 ? '' : i - 2}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="border border-border rounded-lg p-4 hover:bg-accent/50 transition flex justify-between items-start"
              >
                <div className="flex-1">
                  <p className="font-semibold">{apt.title}</p>
                  <p className="text-sm text-muted-foreground mb-3">Client: {apt.client}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {apt.date.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {apt.time} - {apt.duration}
                    </div>
                    {apt.type === 'video' ? (
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-muted-foreground" />
                        Video Call
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {apt.location}
                      </div>
                    )}
                  </div>
                </div>

                <button className="ml-4 px-3 py-2 text-sm bg-primary text-primary-foreground rounded hover:opacity-90 transition">
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Options */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Calendar Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Google Calendar', 'Outlook', 'Apple Calendar'].map((cal) => (
              <button
                key={cal}
                className="p-4 border border-border rounded-lg hover:border-primary hover:bg-accent/50 transition text-sm font-medium"
              >
                Connect {cal}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
