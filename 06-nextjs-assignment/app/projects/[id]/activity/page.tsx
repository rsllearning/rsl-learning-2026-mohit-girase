import React from 'react';
import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/projects';

interface ProjectActivityPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectActivityPage({ params }: ProjectActivityPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-4 pt-2" id="project-activity-tab">
      <div className="text-xs text-zinc-400">
        Activity Log ({project.activities.length} entries)
      </div>

      <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/40">
        {project.activities.map((act) => (
          <div key={act.id} className="p-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-200">
                {act.user} <span className="text-zinc-500 font-normal">{act.action}</span> {act.target}
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">{act.timestamp}</span>
            </div>
            {act.details && (
              <p className="text-xs text-zinc-400">{act.details}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
