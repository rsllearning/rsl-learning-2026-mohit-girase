import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950 py-6 text-xs text-zinc-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span>Project Explorer</span> • <span className="text-zinc-600">Next.js App Router Assignment</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <Link href="/projects" className="hover:text-zinc-200 transition-colors">
            Projects
          </Link>
          <Link href="/dashboard" className="hover:text-zinc-200 transition-colors">
            Dashboard
          </Link>
          <Link href="/about" className="hover:text-zinc-200 transition-colors">
            About
          </Link>
          <Link href="/settings" className="hover:text-zinc-200 transition-colors">
            Settings
          </Link>
        </div>
      </div>
    </footer>
  );
}
