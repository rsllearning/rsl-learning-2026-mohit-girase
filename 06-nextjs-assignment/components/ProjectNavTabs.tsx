'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ProjectNavTabsProps {
  projectId: string;
}

export default function ProjectNavTabs({ projectId }: ProjectNavTabsProps) {
  const pathname = usePathname();

  const tabs = [
    { label: 'Overview', href: `/projects/${projectId}`, exact: true },
    { label: 'Team', href: `/projects/${projectId}/team`, exact: false },
    { label: 'Tasks', href: `/projects/${projectId}/tasks`, exact: false },
    { label: 'Activity', href: `/projects/${projectId}/activity`, exact: false },
    { label: 'Docs', href: `/projects/${projectId}/docs`, exact: false },
  ];

  const isTabActive = (tab: (typeof tabs)[0]) => {
    if (tab.exact) {
      return pathname === tab.href;
    }
    return pathname.startsWith(tab.href);
  };

  return (
    <div className="border-b border-zinc-800 flex items-center gap-2 overflow-x-auto">
      {tabs.map((tab) => {
        const active = isTabActive(tab);
        return (
          <Link
            key={tab.label}
            href={tab.href}
            id={`tab-${tab.label.toLowerCase()}`}
            className={`px-3 py-2 text-xs font-medium border-b -mb-px transition-colors whitespace-nowrap ${
              active
                ? 'border-zinc-200 text-zinc-100'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
