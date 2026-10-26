'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface ProjectFiltersProps {
  totalCount: number;
  filteredCount: number;
}

export default function ProjectFilters({
  totalCount,
  filteredCount,
}: ProjectFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get('search') || '';
  const currentStatus = searchParams.get('status') || 'all';
  const isFavoritesOnly = searchParams.get('filter') === 'favorites';

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchTerm.trim() });
  };

  const handleReset = () => {
    setSearchTerm('');
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters = Boolean(currentSearch) || currentStatus !== 'all' || isFavoritesOnly;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            id="projects-search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value === '') {
                updateFilters({ search: null });
              }
            }}
            placeholder="Search projects..."
            className="w-full pl-9 pr-16 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-hidden focus:border-zinc-600 transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                updateFilters({ search: null });
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Status Dropdown */}
        <select
          id="filter-status-select"
          value={currentStatus}
          onChange={(e) => updateFilters({ status: e.target.value })}
          className="text-xs py-1.5 px-2.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 focus:outline-hidden focus:border-zinc-600 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
          <option value="planning">Planning</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            type="button"
            className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1.5 transition-colors cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
        <div>
          Showing {filteredCount} of {totalCount} projects
        </div>

        {/* Minimal video demo triggers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateFilters({ simulateDelay: '1500' })}
            className="text-[11px] px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors cursor-pointer"
            title="Demonstrate App Router loading.tsx skeleton"
          >
            Demo: Loading UI
          </button>
          <button
            type="button"
            onClick={() => updateFilters({ simulateError: 'true' })}
            className="text-[11px] px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors cursor-pointer"
            title="Demonstrate App Router error.tsx error boundary"
          >
            Demo: Error Handling
          </button>
        </div>
      </div>
    </div>
  );
}
