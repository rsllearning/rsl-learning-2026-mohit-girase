'use client';

import React, { useState, useEffect } from 'react';
import { useFavorites } from './FavoritesContext';

export default function SettingsClient() {
  const { favoritesCount } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReset = () => {
    localStorage.removeItem('pe_favorites');
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      {/* Theme setting */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-1">
        <h2 className="text-xs font-semibold text-zinc-200">Appearance</h2>
        <p className="text-xs text-zinc-400">
          The portal is configured in minimal Dark Mode.
        </p>
      </div>

      {/* Favorites management */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
        <div>
          <h2 className="text-xs font-semibold text-zinc-200">Saved Favorites</h2>
          <p className="text-xs text-zinc-400" suppressHydrationWarning>
            Currently storing {mounted ? favoritesCount : 0} pinned project(s) in browser localStorage.
          </p>
        </div>

        <button
          onClick={handleReset}
          type="button"
          className="px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Reset Favorites
        </button>
      </div>
    </div>
  );
}
