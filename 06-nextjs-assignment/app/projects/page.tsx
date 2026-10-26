import React, { Suspense } from 'react';
import { getFilteredProjects, getAllProjects } from '@/lib/projects';
import ProjectFilters from '@/components/ProjectFilters';
import ProjectListContainer from '@/components/ProjectListContainer';

export const metadata = {
  title: 'Projects | Project Explorer',
  description: 'Browse organizational projects with search parameters and dynamic routing.',
};

interface ProjectsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    filter?: string;
    simulateDelay?: string;
    simulateError?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const resolvedParams = await searchParams;

  const simulateDelayMs = resolvedParams.simulateDelay
    ? parseInt(resolvedParams.simulateDelay, 10)
    : undefined;
  const simulateErrorBool = resolvedParams.simulateError === 'true';

  const projects = await getFilteredProjects({
    search: resolvedParams.search,
    status: resolvedParams.status,
    simulateDelay: simulateDelayMs,
    simulateError: simulateErrorBool,
  });

  const allProjects = await getAllProjects();
  const isFavoritesOnly = resolvedParams.filter === 'favorites';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6" id="projects-page">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100">
          Projects
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Explore and filter organization projects using URL query parameters.
        </p>
      </div>

      <Suspense fallback={<div className="h-10 rounded-md bg-zinc-900 border border-zinc-800" />}>
        <ProjectFilters
          totalCount={allProjects.length}
          filteredCount={projects.length}
        />
      </Suspense>

      <ProjectListContainer
        projects={projects}
        isFavoritesFilter={isFavoritesOnly}
      />
    </div>
  );
}
