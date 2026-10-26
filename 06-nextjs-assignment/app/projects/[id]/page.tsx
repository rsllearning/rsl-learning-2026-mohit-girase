import React from 'react';
import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/projects';

interface ProjectOverviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectOverviewPage({ params }: ProjectOverviewPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6 pt-2" id="project-overview-tab">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Project Overview
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-2 text-xs">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Metadata
          </h3>
          <div className="space-y-1 text-zinc-300">
            <div><span className="text-zinc-500">Lead:</span> {project.lead.name} ({project.lead.email})</div>
            <div><span className="text-zinc-500">Category:</span> {project.category}</div>
            <div><span className="text-zinc-500">Target Date:</span> {project.targetDate}</div>
            <div><span className="text-zinc-500">Budget:</span> {project.spent} / {project.budget}</div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Technologies
        </h3>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 rounded border border-zinc-800 text-zinc-300 bg-zinc-900"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
