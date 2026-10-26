import React from 'react';
import { ProjectDetailSkeleton } from '@/components/Skeleton';

export default function ProjectDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <ProjectDetailSkeleton />
    </div>
  );
}
