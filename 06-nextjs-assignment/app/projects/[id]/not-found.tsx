import React from 'react';
import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-zinc-100">Project Not Found</h1>
        <p className="text-xs text-zinc-400">
          The requested project ID does not exist or has been removed.
        </p>
      </div>
      <div>
        <Link
          href="/projects"
          className="inline-block px-3 py-1.5 rounded-md bg-zinc-100 text-zinc-950 text-xs font-medium hover:bg-white transition-colors"
        >
          Back to Projects
        </Link>
      </div>
    </div>
  );
}
