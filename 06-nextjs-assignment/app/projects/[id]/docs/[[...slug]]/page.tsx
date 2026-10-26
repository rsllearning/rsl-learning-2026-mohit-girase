import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectById, getProjectDocBySlug } from '@/lib/projects';

interface ProjectDocsPageProps {
  params: Promise<{
    id: string;
    slug?: string[];
  }>;
}

export default async function ProjectDocsPage({ params }: ProjectDocsPageProps) {
  const { id, slug } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const currentSegments = slug || [];
  const requestedPath = `/projects/${id}/docs${
    currentSegments.length > 0 ? '/' + currentSegments.join('/') : ''
  }`;

  const { doc } = await getProjectDocBySlug(id, currentSegments);

  const presetLinks = [
    { label: 'Overview', path: `/projects/${id}/docs`, segments: [] },
    { label: 'Setup', path: `/projects/${id}/docs/setup`, segments: ['setup'] },
    {
      label: 'Setup / Database',
      path: `/projects/${id}/docs/setup/database`,
      segments: ['setup', 'database'],
    },
    {
      label: 'Setup / Database / Migrations',
      path: `/projects/${id}/docs/setup/database/migrations`,
      segments: ['setup', 'database', 'migrations'],
    },
  ];

  const isCurrent = (segs: string[]) => {
    if (segs.length !== currentSegments.length) return false;
    return segs.every((s, i) => s === currentSegments[i]);
  };

  return (
    <div className="space-y-6 pt-2" id="project-docs-catchall">
      {/* Route diagnostic box */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-2 text-xs">
        <div className="text-zinc-400 font-mono">
          Route: <span className="text-zinc-200">app/projects/[id]/docs/[[...slug]]/page.tsx</span>
        </div>
        <div className="text-zinc-400 font-mono">
          Requested URL: <span className="text-zinc-100 font-bold">{requestedPath}</span>
        </div>
        <div className="text-zinc-400 font-mono">
          Segments: [
          {currentSegments.map((s, i) => (
            <span key={i} className="text-zinc-200">
              {i > 0 ? ', ' : ''}&quot;{s}&quot;
            </span>
          ))}
          ]
        </div>
      </div>

      {/* Docs layout: Sidebar + Body */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Nav Links */}
        <div className="md:col-span-1 space-y-1 text-xs">
          <div className="text-[11px] font-semibold uppercase text-zinc-500 pb-1">
            Documentation
          </div>
          {presetLinks.map((item) => {
            const active = isCurrent(item.segments);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-2.5 py-1.5 rounded transition-colors ${
                  active
                    ? 'bg-zinc-800 text-zinc-100 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Content */}
        <div className="md:col-span-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
          <div className="space-y-1 border-b border-zinc-800 pb-3">
            <h2 className="text-base font-bold text-zinc-100">
              {doc?.title || 'Documentation'}
            </h2>
            {doc?.summary && (
              <p className="text-xs text-zinc-400">{doc.summary}</p>
            )}
          </div>
          <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
            {doc?.content}
          </div>
        </div>
      </div>
    </div>
  );
}
