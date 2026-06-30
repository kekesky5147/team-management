"use client";

import { useCallback, useEffect, useState } from "react";

import {
  addPlayerToSession,
  assignPlayerTeam,
  assignPlayersTeam,
  createEmptySession,
  hasDuplicateName,
  loadSessionFromStorage,
  removePlayerFromSession,
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

  const removePlayer = useCallback((id: string) => {
    setSession((prev) => removePlayerFromSession(prev, id));
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
    removePlayer,
    assignTeam,
    assignTeamsBulk,
    resetSession,
    checkDuplicateName,
  };
}
