import React from 'react';
import Link from 'next/link';
import projectsData from '@/data/projects.json';

export default async function StreamingActivity() {
  // Simulate slow Server Component data fetch (Requirement 8)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const activities = projectsData.flatMap((p) =>
    p.activities.map((act) => ({
      ...act,
      projectId: p.id,
      projectTitle: p.title,
    }))
  ).slice(0, 5);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
        <span className="font-medium text-zinc-200">Recent Activity</span>
        <span className="text-[11px] text-zinc-500 font-mono">Streamed in 2.0s</span>
      </div>

      <div className="divide-y divide-zinc-800/80">
        {activities.map((item) => (
          <div key={item.id} className="py-2.5 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-zinc-200 font-medium">{item.user}</span>
              <span className="text-[11px] text-zinc-500 font-mono">{item.timestamp}</span>
            </div>
            <div className="text-zinc-400">
              <span className="capitalize">{item.action}</span>: {item.target}
            </div>
            <Link
              href={`/projects/${item.projectId}`}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 inline-block"
            >
              in {item.projectTitle} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
