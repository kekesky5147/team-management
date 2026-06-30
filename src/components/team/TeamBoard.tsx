"use client";

import { TEAM_COLUMNS } from "@/lib/teams";
import { cn } from "@/lib/utils";
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

      <div
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "md:grid md:grid-cols-3 md:overflow-visible md:snap-none md:pb-0",
        )}
        aria-label="A/B/C 팀 배정"
      >
        {teamConfigs.map((config) => (
          <div
            key={config.id}
            className="w-full min-w-full shrink-0 snap-center md:min-w-0 md:w-auto md:shrink"
          >
            <TeamColumn
              config={config}
              players={filterPlayersByColumn(players, config.id)}
              onAssignTeam={onAssignTeam}
              onRemove={onRemove}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
