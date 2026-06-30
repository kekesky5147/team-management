import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

      <CardContent className="space-y-2 px-4 py-4">
        {players.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            아직 배정된 선수가 없습니다
          </p>
        ) : (
          players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onAssignTeam={onAssignTeam}
              onRemove={onRemove}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
