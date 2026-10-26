'use client';

import React from 'react';
import Link from 'next/link';

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-zinc-100">
          Failed to load projects
        </h2>
        <p className="text-xs text-zinc-400">
          {error.message || 'An error occurred while loading projects.'}
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 pt-2">
        <button
          onClick={() => reset()}
          type="button"
          className="px-3 py-1.5 rounded-md bg-zinc-100 text-zinc-950 text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
        >
          Retry
        </button>
        <Link
          href="/projects"
          className="px-3 py-1.5 rounded-md border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
        >
          Reset
        </Link>
      </div>
    </div>
  );
}
