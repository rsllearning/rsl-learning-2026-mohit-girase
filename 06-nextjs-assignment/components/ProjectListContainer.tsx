'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '@/lib/types';
import ProjectCard from './ProjectCard';
import { useFavorites } from './FavoritesContext';
import Link from 'next/link';

interface ProjectListContainerProps {
  projects: Project[];
  isFavoritesFilter: boolean;
}

export default function ProjectListContainer({
  projects,
  isFavoritesFilter,
}: ProjectListContainerProps) {
  const { isFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayedProjects =
    isFavoritesFilter && mounted
      ? projects.filter((p) => isFavorite(p.id))
      : isFavoritesFilter && !mounted
      ? []
      : projects;

  if (displayedProjects.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 text-center text-xs text-zinc-400 space-y-2">
        <p>No projects match your current criteria.</p>
        <Link href="/projects" className="text-zinc-200 underline inline-block">
          Reset filters
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" id="projects-grid">
      {displayedProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
