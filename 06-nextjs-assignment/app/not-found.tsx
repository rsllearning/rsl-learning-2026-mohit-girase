import React from 'react';
import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-zinc-100">404 - Page Not Found</h1>
        <p className="text-xs text-zinc-400">
          The page you requested does not exist.
        </p>
      </div>
      <div>
        <Link
          href="/"
          className="inline-block px-3.5 py-1.5 rounded-md bg-zinc-100 text-zinc-950 text-xs font-medium hover:bg-white transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
