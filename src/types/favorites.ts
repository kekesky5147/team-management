export type FavoritePlayer = {
  id: string;
  name: string;
  createdAt: string;
};

export type FavoritesState = {
  players: FavoritePlayer[];
  updatedAt: string;
};
