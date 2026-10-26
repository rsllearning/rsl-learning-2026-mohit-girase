'use client';

import React, { useState, useEffect } from 'react';
import { useFavorites } from './FavoritesContext';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  projectId: string;
  className?: string;
  size?: 'sm' | 'md';
}

export default function FavoriteButton({
  projectId,
  className = '',
  size = 'md',
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const favorite = mounted ? isFavorite(projectId) : false;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(projectId);
      }}
      type="button"
      id={`fav-btn-${projectId}`}
      aria-label={favorite ? 'Remove from favorites' : 'Mark as favorite'}
      title={favorite ? 'Remove from favorites' : 'Mark as favorite'}
      suppressHydrationWarning
      className={`p-1.5 rounded transition-colors cursor-pointer ${
        favorite
          ? 'text-red-400 hover:text-red-300'
          : 'text-zinc-500 hover:text-zinc-300'
      } ${className}`}
    >
      <Heart
        className={`w-3.5 h-3.5 ${favorite ? 'fill-current' : ''}`}
      />
    </button>
  );
}
