"use client";

import { useState } from "react";

import { FavoritePlayersSheet } from "@/components/favorites/FavoritePlayersSheet";
import { AttendanceInput } from "@/components/session/AttendanceInput";
import { SessionHeader } from "@/components/session/SessionHeader";
import { TeamBoard } from "@/components/team/TeamBoard";
import { useFavoritePlayers } from "@/hooks/useFavoritePlayers";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { appleContainer, appleMuted } from "@/lib/apple-ui";

export function TeamManagementApp() {
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const {
    isHydrated: isSessionHydrated,
    players,
    addPlayer,
    addPlayersBulk,
    removePlayer,
    removePlayersBulk,
    assignTeam,
    assignTeamsBulk,
    resetSession,
    checkDuplicateName,
  } = useSessionStorage();

  const {
    favoritePlayers,
    isHydrated: isFavoritesHydrated,
    addFavorite,
    removeFavorite,
    removeFavoritesBulk,
    checkDuplicateFavoriteName,
  } = useFavoritePlayers();

  const isHydrated = isSessionHydrated && isFavoritesHydrated;

  if (!isHydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className={appleMuted}>불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={appleContainer}>
      <SessionHeader
        totalCount={players.length}
        onReset={resetSession}
        onOpenFavorites={() => setFavoritesOpen(true)}
      />

      <AttendanceInput onAdd={addPlayer} checkDuplicateName={checkDuplicateName} />

      <TeamBoard
        players={players}
        onAssignTeam={assignTeam}
        onAssignTeamsBulk={assignTeamsBulk}
        onRemove={removePlayer}
        onRemoveBulk={removePlayersBulk}
      />

      <FavoritePlayersSheet
        open={favoritesOpen}
        onOpenChange={setFavoritesOpen}
        favorites={favoritePlayers}
        onAddFavorite={addFavorite}
        onRemoveFavorite={removeFavorite}
        onRemoveFavoritesBulk={removeFavoritesBulk}
        onAddToWaiting={addPlayersBulk}
        checkDuplicateFavoriteName={checkDuplicateFavoriteName}
      />
    </div>
  );
}
