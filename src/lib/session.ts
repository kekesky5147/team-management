import type { Player, SessionState, TeamId } from "@/types/session";

const STORAGE_KEY = "team-management:session";

export function createEmptySession(): SessionState {
  return {
    players: [],
    updatedAt: new Date().toISOString(),
  };
}

export function loadSessionFromStorage(): SessionState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<SessionState> & {
      sessionDate?: string;
    };

    if (!Array.isArray(parsed.players)) return null;

    return {
      players: parsed.players,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveSessionToStorage(session: SessionState): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...session,
      updatedAt: new Date().toISOString(),
    }),
  );
}

export function addPlayerToSession(
  session: SessionState,
  name: string,
): SessionState {
  const trimmed = name.trim();
  if (!trimmed) return session;

  const player: Player = {
    id: crypto.randomUUID(),
    name: trimmed,
    teamId: null,
  };

  return {
    ...session,
    players: [...session.players, player],
    updatedAt: new Date().toISOString(),
  };
}

export function removePlayerFromSession(
  session: SessionState,
  id: string,
): SessionState {
  return {
    ...session,
    players: session.players.filter((player) => player.id !== id),
    updatedAt: new Date().toISOString(),
  };
}

export function removePlayersBulkFromSession(
  session: SessionState,
  ids: string[],
): SessionState {
  if (ids.length === 0) return session;

  const idSet = new Set(ids);

  return {
    ...session,
    players: session.players.filter((player) => !idSet.has(player.id)),
    updatedAt: new Date().toISOString(),
  };
}

export function assignPlayerTeam(
  session: SessionState,
  id: string,
  teamId: TeamId | null,
): SessionState {
  return {
    ...session,
    players: session.players.map((player) =>
      player.id === id ? { ...player, teamId } : player,
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function assignPlayersTeam(
  session: SessionState,
  ids: string[],
  teamId: TeamId | null,
): SessionState {
  if (ids.length === 0) return session;

  const idSet = new Set(ids);

  return {
    ...session,
    players: session.players.map((player) =>
      idSet.has(player.id) ? { ...player, teamId } : player,
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function resetSessionState(): SessionState {
  return createEmptySession();
}

export function hasDuplicateName(session: SessionState, name: string): boolean {
  const trimmed = name.trim();
  return session.players.some((player) => player.name === trimmed);
}

export type BulkAddResult = {
  session: SessionState;
  addedCount: number;
  skippedCount: number;
};

export function addPlayersBulkToSession(
  session: SessionState,
  names: string[],
): BulkAddResult {
  let nextSession = session;
  let addedCount = 0;
  let skippedCount = 0;

  for (const name of names) {
    const trimmed = name.trim();
    if (!trimmed) continue;

    if (hasDuplicateName(nextSession, trimmed)) {
      skippedCount += 1;
      continue;
    }

    nextSession = addPlayerToSession(nextSession, trimmed);
    addedCount += 1;
  }

  return { session: nextSession, addedCount, skippedCount };
}
