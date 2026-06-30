"use client";

import { useCallback, useEffect, useState } from "react";

import {
  addPlayerToSession,
  addPlayersBulkToSession,
  assignPlayerTeam,
  assignPlayersTeam,
  createEmptySession,
  hasDuplicateName,
  loadSessionFromStorage,
  removePlayerFromSession,
  removePlayersBulkFromSession,
  resetSessionState,
  saveSessionToStorage,
} from "@/lib/session";
import type { SessionState, TeamId } from "@/types/session";

export function useSessionStorage() {
  const [session, setSession] = useState<SessionState>(createEmptySession);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadSessionFromStorage();
    if (loaded) {
      setSession(loaded);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveSessionToStorage(session);
  }, [session, isHydrated]);

  const addPlayer = useCallback((name: string) => {
    setSession((prev) => addPlayerToSession(prev, name));
  }, []);

  const addPlayersBulk = useCallback((names: string[]) => {
    let addedCount = 0;
    let skippedCount = 0;

    setSession((prev) => {
      const bulkResult = addPlayersBulkToSession(prev, names);
      addedCount = bulkResult.addedCount;
      skippedCount = bulkResult.skippedCount;
      return bulkResult.session;
    });

    return { addedCount, skippedCount };
  }, []);

  const removePlayer = useCallback((id: string) => {
    setSession((prev) => removePlayerFromSession(prev, id));
  }, []);

  const removePlayersBulk = useCallback((ids: string[]) => {
    setSession((prev) => removePlayersBulkFromSession(prev, ids));
  }, []);

  const assignTeam = useCallback((id: string, teamId: TeamId | null) => {
    setSession((prev) => assignPlayerTeam(prev, id, teamId));
  }, []);

  const assignTeamsBulk = useCallback((ids: string[], teamId: TeamId | null) => {
    setSession((prev) => assignPlayersTeam(prev, ids, teamId));
  }, []);

  const resetSession = useCallback(() => {
    setSession(resetSessionState());
  }, []);

  const checkDuplicateName = useCallback(
    (name: string) => hasDuplicateName(session, name),
    [session],
  );

  return {
    session,
    isHydrated,
    players: session.players,
    addPlayer,
    addPlayersBulk,
    removePlayer,
    removePlayersBulk,
    assignTeam,
    assignTeamsBulk,
    resetSession,
    checkDuplicateName,
  };
}
