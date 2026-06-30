"use client";

import { AttendanceInput } from "@/components/session/AttendanceInput";
import { SessionHeader } from "@/components/session/SessionHeader";
import { TeamBoard } from "@/components/team/TeamBoard";
import { useSessionStorage } from "@/hooks/useSessionStorage";

export function TeamManagementApp() {
  const {
    session,
    isHydrated,
    players,
    addPlayer,
    removePlayer,
    assignTeam,
    assignTeamsBulk,
    resetSession,
    checkDuplicateName,
  } = useSessionStorage();

  if (!isHydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <SessionHeader
        sessionDate={session.sessionDate}
        totalCount={players.length}
        onReset={resetSession}
      />

      <AttendanceInput onAdd={addPlayer} checkDuplicateName={checkDuplicateName} />

      <TeamBoard
        players={players}
        onAssignTeam={assignTeam}
        onAssignTeamsBulk={assignTeamsBulk}
        onRemove={removePlayer}
      />
    </div>
  );
}
