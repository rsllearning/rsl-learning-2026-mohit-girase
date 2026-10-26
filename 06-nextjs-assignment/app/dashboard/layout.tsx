import React, { Suspense } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col md:flex-row bg-zinc-950 min-h-[calc(100vh-3.5rem)]">
      <Suspense fallback={<div className="w-full md:w-56 border-r border-zinc-800 bg-zinc-950 p-4" />}>
        <DashboardSidebar />
      </Suspense>

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full">
        {children}
      </div>
    </div>
  );
}
