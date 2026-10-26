'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardSidebar() {
  const pathname = usePathname();

  const quickProjects = [
    { id: '1', title: 'Next.js Enterprise' },
    { id: '2', title: 'Cloud Migration' },
    { id: '3', title: 'Mobile Banking' },
  ];

  return (
    <aside
      id="dashboard-sidebar"
      className="w-full md:w-56 shrink-0 border-r border-zinc-800 bg-zinc-950 p-4 space-y-6"
    >
      <div className="space-y-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 px-2 pb-1">
          Navigation
        </div>
        <Link
          href="/dashboard"
          className={`block px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
            pathname === '/dashboard'
              ? 'bg-zinc-800 text-zinc-100'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          Dashboard Hub
        </Link>
      </div>

      <div className="space-y-1 pt-2 border-t border-zinc-800">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 px-2 pb-1">
          Pinned Projects
        </div>
        {quickProjects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="block px-2.5 py-1.5 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors truncate"
          >
            {p.title}
          </Link>
        ))}
        <Link
          href="/projects"
          className="block px-2.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-300"
        >
          All projects →
        </Link>
      </div>
    </aside>
  );
}
