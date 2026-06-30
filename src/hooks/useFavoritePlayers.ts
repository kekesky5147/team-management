"use client";

import { useCallback, useEffect, useState } from "react";

import {
  addFavoritePlayer,
  createEmptyFavorites,
  hasDuplicateFavoriteName,
  loadFavoritesFromStorage,
  removeFavoritePlayer,
  removeFavoritePlayersBulk,
  saveFavoritesToStorage,
} from "@/lib/favorites";
import type { FavoritePlayer, FavoritesState } from "@/types/favorites";

export function useFavoritePlayers() {
  const [favorites, setFavorites] = useState<FavoritesState>(createEmptyFavorites);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadFavoritesFromStorage();
    if (loaded) {
      setFavorites(loaded);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveFavoritesToStorage(favorites);
  }, [favorites, isHydrated]);

  const addFavorite = useCallback((name: string) => {
    setFavorites((prev) => addFavoritePlayer(prev, name));
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => removeFavoritePlayer(prev, id));
  }, []);

  const removeFavoritesBulk = useCallback((ids: string[]) => {
    setFavorites((prev) => removeFavoritePlayersBulk(prev, ids));
  }, []);

  const checkDuplicateFavoriteName = useCallback(
    (name: string) => hasDuplicateFavoriteName(favorites, name),
    [favorites],
  );

  return {
    favorites,
    favoritePlayers: favorites.players as FavoritePlayer[],
    isHydrated,
    addFavorite,
    removeFavorite,
    removeFavoritesBulk,
    checkDuplicateFavoriteName,
  };
}
