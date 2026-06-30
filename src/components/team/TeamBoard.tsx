"use client";

import { TEAM_COLUMNS } from "@/lib/teams";
import type { Player, TeamId } from "@/types/session";

import { TeamColumn } from "./TeamColumn";

type TeamBoardProps = {
  players: Player[];
  onAssignTeam: (id: string, teamId: TeamId | null) => void;
  onRemove: (id: string) => void;
};

function filterPlayersByColumn(
  players: Player[],
  columnId: (typeof TEAM_COLUMNS)[number]["id"],
) {
  if (columnId === "waiting") {
    return players.filter((player) => player.teamId === null);
  }

  return players.filter((player) => player.teamId === columnId);
}

export function TeamBoard({ players, onAssignTeam, onRemove }: TeamBoardProps) {
  const waitingConfig = TEAM_COLUMNS.find((column) => column.id === "waiting")!;
  const teamConfigs = TEAM_COLUMNS.filter((column) => column.id !== "waiting");
  const waitingPlayers = filterPlayersByColumn(players, "waiting");

  return (
    <section className="flex flex-col gap-4">
      <TeamColumn
        config={waitingConfig}
        players={waitingPlayers}
        variant="waiting"
        onAssignTeam={onAssignTeam}
        onRemove={onRemove}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {teamConfigs.map((config) => (
          <TeamColumn
            key={config.id}
            config={config}
            players={filterPlayersByColumn(players, config.id)}
            onAssignTeam={onAssignTeam}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  );
}
