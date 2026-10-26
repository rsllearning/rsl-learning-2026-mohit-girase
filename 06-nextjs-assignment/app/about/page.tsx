import React from 'react';

export const metadata = {
  title: 'About | Project Explorer',
  description: 'Application architecture and Next.js App Router implementation details.',
};

export default function AboutPage() {
  const sections = [
    {
      title: 'App Router Architecture',
      desc: 'Organized with the Next.js App Router using nested layouts, dynamic routes (/projects/[id]), and catch-all routes (/projects/[id]/docs/[[...slug]]).',
    },
    {
      title: 'Server and Client Component Separation',
      desc: 'Server Components handle data fetching, query parameters, and static generation. Client Components are reserved for interactive boundaries such as search input debouncing, task checklists, and favorite bookmarking.',
    },
    {
      title: 'Streaming UI with Suspense',
      desc: 'The Dashboard demonstrates streaming with React Suspense, allowing heavy Server Components to stream in asynchronously while rendering the shell immediately.',
    },
    {
      title: 'Loading & Error Boundaries',
      desc: 'Built-in loading.tsx provides immediate visual feedback, and error.tsx catches runtime exceptions with an interactive retry option.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8" id="about-page">
      <div className="space-y-2 border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          About Project Explorer
        </h1>
        <p className="text-xs text-zinc-400">
          A lightweight project management portal developed for the Next.js assignment.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((sec) => (
          <div
            key={sec.title}
            className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-1"
          >
            <h2 className="text-sm font-semibold text-zinc-200">{sec.title}</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">{sec.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
