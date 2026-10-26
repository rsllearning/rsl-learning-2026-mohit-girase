import React from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types';
import FavoriteButton from './FavoriteButton';
import { ArrowRight } from 'lucide-react';

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-3"
      id={`project-card-${project.id}`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] px-1.5 py-0.2 rounded border border-zinc-800 text-zinc-400">
              {project.category}
            </span>
            <span className="text-[11px] px-1.5 py-0.2 rounded border border-zinc-800 text-zinc-400 capitalize">
              {project.status.replace('-', ' ')}
            </span>
          </div>
          <FavoriteButton projectId={project.id} size="sm" />
        </div>

        <Link href={`/projects/${project.id}`} className="block">
          <h3 className="text-sm font-semibold text-zinc-200 hover:text-white transition-colors truncate">
            {project.title}
          </h3>
        </Link>

        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>

      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
        <span className="text-zinc-500">Lead: {project.lead.name}</span>
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
        >
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
}
