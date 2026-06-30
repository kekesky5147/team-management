"use client";

import { TEAM_COLUMNS } from "@/lib/teams";
import type { Player, TeamId } from "@/types/session";

import { TeamCarousel } from "./TeamCarousel";
import { TeamColumn } from "./TeamColumn";
import { WaitingColumn } from "./WaitingColumn";

type TeamBoardProps = {
  players: Player[];
  onAssignTeam: (id: string, teamId: TeamId | null) => void;
  onAssignTeamsBulk: (ids: string[], teamId: TeamId | null) => void;
  onRemove: (id: string) => void;
  onRemoveBulk: (ids: string[]) => void;
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

export function TeamBoard({
  players,
  onAssignTeam,
  onAssignTeamsBulk,
  onRemove,
  onRemoveBulk,
}: TeamBoardProps) {
  const waitingConfig = TEAM_COLUMNS.find((column) => column.id === "waiting")!;
  const teamConfigs = TEAM_COLUMNS.filter((column) => column.id !== "waiting");
  const waitingPlayers = filterPlayersByColumn(players, "waiting");

  const getTeamPlayers = (teamId: (typeof TEAM_COLUMNS)[number]["id"]) =>
    filterPlayersByColumn(players, teamId);

  return (
    <section className="flex flex-col gap-6 sm:gap-8">
      <WaitingColumn
        config={waitingConfig}
        players={waitingPlayers}
        onAssignTeamsBulk={onAssignTeamsBulk}
        onRemoveBulk={onRemoveBulk}
      />

      <TeamCarousel
        teamConfigs={teamConfigs}
        getPlayers={getTeamPlayers}
        onAssignTeam={onAssignTeam}
        onRemove={onRemove}
      />

      <div
        className="hidden grid-cols-3 gap-4 lg:grid"
        aria-label="A/B/C 팀 배정"
      >
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
