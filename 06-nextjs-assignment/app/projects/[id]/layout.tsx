import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/projects';
import ProjectNavTabs from '@/components/ProjectNavTabs';
import FavoriteButton from '@/components/FavoriteButton';

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6" id="project-detail-layout">
      {/* Breadcrumbs */}
      <div className="text-xs text-zinc-500 flex items-center gap-1.5">
        <Link href="/projects" className="hover:text-zinc-300">
          Projects
        </Link>
        <span>/</span>
        <span className="text-zinc-300 truncate max-w-xs">{project.title}</span>
      </div>

      {/* Project Header */}
      <div className="space-y-3 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-1.5 py-0.2 rounded border border-zinc-800 text-zinc-400 capitalize">
                {project.status.replace('-', ' ')}
              </span>
              <span className="text-[11px] px-1.5 py-0.2 rounded border border-zinc-800 text-zinc-400">
                {project.category}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              {project.title}
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </div>

          <FavoriteButton projectId={project.id} size="md" />
        </div>

        {/* Navigation Tabs */}
        <div className="pt-2">
          <Suspense fallback={<div className="h-8 border-b border-zinc-800" />}>
            <ProjectNavTabs projectId={project.id} />
          </Suspense>
        </div>
      </div>

      {/* Tab Content */}
      <div>{children}</div>
    </div>
  );
}
