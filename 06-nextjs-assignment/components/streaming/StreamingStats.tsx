import React from 'react';
import projectsData from '@/data/projects.json';

export default async function StreamingStats() {
  // Simulate slow Server Component data fetch for React Suspense demonstration (Requirement 8)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const total = projectsData.length;
  const activeCount = projectsData.filter((p) => p.status === 'active').length;
  const inProgressCount = projectsData.filter((p) => p.status === 'in-progress').length;
  const completedCount = projectsData.filter((p) => p.status === 'completed').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" id="streamed-stats">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-1">
        <div className="text-[11px] text-zinc-500">Total Projects</div>
        <div className="text-xl font-bold text-zinc-100">{total}</div>
      </div>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-1">
        <div className="text-[11px] text-zinc-500">Active</div>
        <div className="text-xl font-bold text-zinc-100">{activeCount}</div>
      </div>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-1">
        <div className="text-[11px] text-zinc-500">In Progress</div>
        <div className="text-xl font-bold text-zinc-100">{inProgressCount}</div>
      </div>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-1">
        <div className="text-[11px] text-zinc-500">Completed</div>
        <div className="text-xl font-bold text-zinc-100">{completedCount}</div>
      </div>
    </div>
  );
}
