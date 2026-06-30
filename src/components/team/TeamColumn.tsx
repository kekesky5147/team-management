import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  WAITING_GRID,
  WAITING_GRID_CAPACITY,
  WAITING_GRID_MAX_HEIGHT,
} from "@/lib/teams";
import { cn } from "@/lib/utils";
import type { Player, TeamColumnConfig, TeamId } from "@/types/session";

import { PlayerCard } from "./PlayerCard";

type TeamColumnProps = {
  config: TeamColumnConfig;
  players: Player[];
  variant?: "default" | "waiting";
  onAssignTeam: (id: string, teamId: TeamId | null) => void;
  onRemove: (id: string) => void;
};

const waitingMainGridClassName =
  "grid w-full grid-flow-col gap-2";

const waitingMainGridStyle: React.CSSProperties = {
  gridTemplateColumns: `repeat(${WAITING_GRID.columns}, minmax(0, 1fr))`,
  gridTemplateRows: `repeat(${WAITING_GRID.rows}, ${WAITING_GRID.rowHeightRem}rem)`,
  maxHeight: WAITING_GRID_MAX_HEIGHT,
};

const waitingOverflowGridClassName = "grid w-full grid-cols-3 gap-2";

function renderPlayerCards(
  players: Player[],
  onAssignTeam: (id: string, teamId: TeamId | null) => void,
  onRemove: (id: string) => void,
  compact = false,
) {
  return players.map((player) => (
    <PlayerCard
      key={player.id}
      player={player}
      compact={compact}
      onAssignTeam={onAssignTeam}
      onRemove={onRemove}
    />
  ));
}

export function TeamColumn({
  config,
  players,
  variant = "default",
  onAssignTeam,
  onRemove,
}: TeamColumnProps) {
  const isWaiting = variant === "waiting";
  const mainPlayers = isWaiting
    ? players.slice(0, WAITING_GRID_CAPACITY)
    : players;
  const overflowPlayers = isWaiting
    ? players.slice(WAITING_GRID_CAPACITY)
    : [];

  return (
    <Card className="h-full gap-0 py-0 shadow-sm">
      <CardHeader
        className={cn(
          "rounded-t-xl border-b px-4 py-4",
          config.headerClass,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">
            {config.label}
          </CardTitle>
          <Badge className={cn("px-2.5 py-1 text-sm", config.badgeClass)}>
            {players.length}명
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={cn("px-4 py-4", !isWaiting && "space-y-2")}>
        {players.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            아직 배정된 선수가 없습니다
          </p>
        ) : isWaiting ? (
          <div>
            <div
              className={waitingMainGridClassName}
              style={waitingMainGridStyle}
            >
              {renderPlayerCards(mainPlayers, onAssignTeam, onRemove, true)}
            </div>

            {overflowPlayers.length > 0 && (
              <div className="mt-4 border-t border-border pt-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    추가 인원
                  </p>
                  <Badge variant="secondary" className="text-sm">
                    {overflowPlayers.length}명
                  </Badge>
                </div>

                <div className={waitingOverflowGridClassName}>
                  {renderPlayerCards(
                    overflowPlayers,
                    onAssignTeam,
                    onRemove,
                    true,
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          renderPlayerCards(players, onAssignTeam, onRemove)
        )}
      </CardContent>
    </Card>
  );
}
