import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  appleCard,
  appleCardContent,
  appleCardHeader,
  appleMuted,
} from "@/lib/apple-ui";
import { cn } from "@/lib/utils";
import type { Player, TeamColumnConfig, TeamId } from "@/types/session";

import { PlayerCard } from "./PlayerCard";

type TeamColumnProps = {
  config: TeamColumnConfig;
  players: Player[];
  onAssignTeam: (id: string, teamId: TeamId | null) => void;
  onRemove: (id: string) => void;
};

export function TeamColumn({
  config,
  players,
  onAssignTeam,
  onRemove,
}: TeamColumnProps) {
  return (
    <Card className={cn(appleCard, "@container/team-col h-full transition-all duration-300 hover-hover:shadow-lg hover-hover:shadow-black/20")}>
      <CardHeader className={cn(appleCardHeader, "rounded-t-2xl", config.headerClass)}>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-semibold tracking-tight text-inherit">
            {config.label}
          </CardTitle>
          <Badge
            className={cn(
              "rounded-full border-0 px-3 py-1 text-sm font-medium shadow-none",
              config.badgeClass,
            )}
          >
            {players.length}명
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={appleCardContent}>
        {players.length === 0 ? (
          <p className={`${appleMuted} py-12 text-center`}>
            아직 배정된 선수가 없습니다
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-1 lg:gap-3">
            {players.map((player) => (
              <li key={player.id} className="min-w-0">
                <PlayerCard
                  player={player}
                  compact
                  onAssignTeam={onAssignTeam}
                  onRemove={onRemove}
                />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
