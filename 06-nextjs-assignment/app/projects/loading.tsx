import React from 'react';
import { ProjectCardSkeleton } from '@/components/Skeleton';

export default function ProjectsLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-2">
        <div className="h-6 w-32 bg-zinc-800 rounded" />
        <div className="h-3 w-64 bg-zinc-800 rounded" />
      </div>

      <div className="h-10 bg-zinc-900 border border-zinc-800 rounded-md" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </div>
  );
}
