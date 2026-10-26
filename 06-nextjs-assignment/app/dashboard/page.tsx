import React, { Suspense } from 'react';
import StreamingStats from '@/components/streaming/StreamingStats';
import StreamingActivity from '@/components/streaming/StreamingActivity';
import { StreamingSectionSkeleton } from '@/components/Skeleton';

export const metadata = {
  title: 'Dashboard | Project Explorer',
  description: 'Central hub with React Suspense streaming Server Components.',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6" id="dashboard-hub">
      {/* Immediate Rendered Shell */}
      <div className="space-y-1 border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-zinc-100">
          Dashboard Hub
        </h1>
        <p className="text-xs text-zinc-400">
          Central hub demonstrating React Suspense and Server Component streaming.
        </p>
      </div>

      {/* Streamed Component 1: Project Statistics */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Project Statistics
        </div>
        <Suspense fallback={<StreamingSectionSkeleton title="Statistics" />}>
          <StreamingStats />
        </Suspense>
      </div>

      {/* Streamed Component 2: Recent Activity */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Audit & Activity Feed
        </div>
        <Suspense fallback={<StreamingSectionSkeleton title="Activity Feed" />}>
          <StreamingActivity />
        </Suspense>
      </div>
    </div>
  );
}
