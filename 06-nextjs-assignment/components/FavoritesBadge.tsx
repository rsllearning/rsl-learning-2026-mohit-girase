'use client';

import React, { useSyncExternalStore } from 'react';
import { useFavorites } from './FavoritesContext';

const emptySubscribe = () => () => {};

export default function FavoritesBadge() {
  const { favoritesCount } = useFavorites();

  // Guarantees exact SSR match during hydration, then safely mounts on client
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <span suppressHydrationWarning>
      Favorites{isClient && favoritesCount > 0 ? ` (${favoritesCount})` : ''}
    </span>
  );
}
