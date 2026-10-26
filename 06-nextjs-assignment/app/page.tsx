import React from 'react';
import Link from 'next/link';
import { getAllProjects } from '@/lib/projects';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Project Explorer',
  description: 'A lightweight project management portal built with Next.js App Router.',
};

export default async function HomePage() {
  const projects = await getAllProjects();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Minimal Header */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
          Project Explorer
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
          A lightweight project management portal for employees to browse projects, view project details, and navigate across sections using the Next.js App Router.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/projects"
            className="px-3.5 py-1.5 rounded-md bg-zinc-100 text-zinc-950 text-xs font-semibold hover:bg-white transition-colors"
          >
            Browse Projects
          </Link>
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-medium hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Open Dashboard
          </Link>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Available Projects ({projects.length})
          </h2>
          <Link
            href="/projects"
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="divide-y divide-zinc-800/80 border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/40">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex items-center justify-between p-3.5 hover:bg-zinc-900/80 transition-colors group"
            >
              <div className="space-y-1 min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-200 group-hover:text-white truncate">
                    {project.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded border border-zinc-800 text-zinc-400 capitalize">
                    {project.status.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 truncate max-w-lg">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs text-zinc-400">
                <span className="hidden sm:inline text-zinc-500">{project.category}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
