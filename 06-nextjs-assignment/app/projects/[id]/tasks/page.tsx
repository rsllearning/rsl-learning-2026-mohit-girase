import React from 'react';
import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/projects';
import ProjectTasksClient from '@/components/ProjectTasksClient';

interface ProjectTasksPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectTasksPage({ params }: ProjectTasksPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div id="project-tasks-tab">
      <ProjectTasksClient initialTasks={project.tasks} />
    </div>
  );
}
