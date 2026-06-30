import type { FavoritePlayer, FavoritesState } from "@/types/favorites";

const STORAGE_KEY = "team-management:favorites";

export function createEmptyFavorites(): FavoritesState {
  return {
    players: [],
    updatedAt: new Date().toISOString(),
  };
}

export function loadFavoritesFromStorage(): FavoritesState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FavoritesState;
  } catch {
    return null;
  }
}

export function saveFavoritesToStorage(favorites: FavoritesState): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...favorites,
      updatedAt: new Date().toISOString(),
    }),
  );
}

export function hasDuplicateFavoriteName(
  favorites: FavoritesState,
  name: string,
): boolean {
  const trimmed = name.trim();
  return favorites.players.some((player) => player.name === trimmed);
}

export function addFavoritePlayer(
  favorites: FavoritesState,
  name: string,
): FavoritesState {
  const trimmed = name.trim();
  if (!trimmed) return favorites;
  if (hasDuplicateFavoriteName(favorites, trimmed)) return favorites;

  const player: FavoritePlayer = {
    id: crypto.randomUUID(),
    name: trimmed,
    createdAt: new Date().toISOString(),
  };

  return {
    ...favorites,
    players: [...favorites.players, player],
    updatedAt: new Date().toISOString(),
  };
}

export function removeFavoritePlayer(
  favorites: FavoritesState,
  id: string,
): FavoritesState {
  return {
    ...favorites,
    players: favorites.players.filter((player) => player.id !== id),
    updatedAt: new Date().toISOString(),
  };
}

export function removeFavoritePlayersBulk(
  favorites: FavoritesState,
  ids: string[],
): FavoritesState {
  if (ids.length === 0) return favorites;

  const idSet = new Set(ids);

  return {
    ...favorites,
    players: favorites.players.filter((player) => !idSet.has(player.id)),
    updatedAt: new Date().toISOString(),
  };
}
