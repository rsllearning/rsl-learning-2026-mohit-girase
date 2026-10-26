import React from 'react';

export function Skeleton({ className = 'h-4 w-full' }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded bg-zinc-800 ${className}`} aria-hidden="true" />;
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-8 w-full" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="h-24 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4" />
    </div>
  );
}

export function StreamingSectionSkeleton({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>Loading {title}...</span>
        <span className="text-[10px] text-zinc-500 font-mono">Suspense fallback</span>
      </div>
      <div className="space-y-2 pt-1">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
