'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { LockedFeature } from '@/components/LockedFeature';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Kanban, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { isFeatureEnabled } from '@/lib/feature-gates';

export default function ProjectsPage() {
  const { userPlan = 'free' } = useAuth();
  const hasFeature = isFeatureEnabled(userPlan as any, 'projects');

  const [projects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      client: 'Acme Corp',
      status: 'in-progress',
      progress: 65,
      tasks: 24,
      completedTasks: 16,
      dueDate: '2024-02-28'
    },
    {
      id: 2,
      name: 'Mobile App MVP',
      client: 'Tech Startup',
      status: 'planning',
      progress: 20,
      tasks: 12,
      completedTasks: 2,
      dueDate: '2024-03-15'
    },
  ]);

  if (!hasFeature) {
    return (
      <AppLayout title="Projects" subtitle="Manage projects and tasks">
        <LockedFeature
          feature="Project Management"
          description="Organize work with Kanban boards, timelines, and task tracking."
          currentPlan={userPlan}
          requiredPlan="Professional"
          benefits={[
            'Kanban Board View',
            'Timeline & Calendar View',
            'Task Management',
            'Time Tracking',
            'File Collaboration'
          ]}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Projects"
      subtitle="Manage and track your projects"
      action={
        <Link
          href="/projects/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Project Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Projects</p>
            <p className="text-2xl font-bold">{projects.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold">{projects.filter(p => p.status === 'in-progress').length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Avg Completion</p>
            <p className="text-2xl font-bold">{Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <p className="text-2xl font-bold">{projects.reduce((sum, p) => sum + p.tasks, 0)}</p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {project.status === 'in-progress' ? 'In Progress' : 'Planning'}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-accent rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {project.completedTasks}/{project.tasks} tasks
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Due {new Date(project.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button className="mt-4 w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition text-sm font-medium">
                View Project
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
