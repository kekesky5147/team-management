import type { Player, SessionState, TeamId } from "@/types/session";

const STORAGE_KEY = "team-management:session";

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatSessionDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

export function createEmptySession(): SessionState {
  return {
    sessionDate: getTodayDateString(),
    players: [],
    updatedAt: new Date().toISOString(),
  };
}

export function loadSessionFromStorage(): SessionState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionState;
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
