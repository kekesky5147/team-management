"use client";

import { useCallback, useState } from "react";

import { PlayerCard } from "@/components/team/PlayerCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BULK_ASSIGN_TEAMS,
  WAITING_GRID,
  WAITING_GRID_CAPACITY,
  WAITING_GRID_MAX_HEIGHT,
} from "@/lib/teams";
import { cn } from "@/lib/utils";
import type { Player, TeamColumnConfig, TeamId } from "@/types/session";

type WaitingColumnProps = {
  config: TeamColumnConfig;
  players: Player[];
  onAssignTeam: (id: string, teamId: TeamId | null) => void;
  onAssignTeamsBulk: (ids: string[], teamId: TeamId | null) => void;
  onRemove: (id: string) => void;
};

const waitingMainGridClassName = "grid w-full grid-flow-col gap-2";

const waitingMainGridStyle: React.CSSProperties = {
  gridTemplateColumns: `repeat(${WAITING_GRID.columns}, minmax(0, 1fr))`,
  gridTemplateRows: `repeat(${WAITING_GRID.rows}, ${WAITING_GRID.rowHeightRem}rem)`,
  maxHeight: WAITING_GRID_MAX_HEIGHT,
};

const waitingOverflowGridClassName = "grid w-full grid-cols-3 gap-2";

export function WaitingColumn({
  config,
  players,
  onAssignTeam,
  onAssignTeamsBulk,
  onRemove,
}: WaitingColumnProps) {
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const mainPlayers = players.slice(0, WAITING_GRID_CAPACITY);
  const overflowPlayers = players.slice(WAITING_GRID_CAPACITY);

  const exitMultiSelectMode = useCallback(() => {
    setIsMultiSelectMode(false);
    setSelectedIds(new Set());
  }, []);

  const toggleMultiSelectMode = () => {
    if (isMultiSelectMode) {
      exitMultiSelectMode();
      return;
    }
    setIsMultiSelectMode(true);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBulkAssign = (teamId: TeamId) => {
    if (selectedIds.size === 0) return;

    onAssignTeamsBulk(Array.from(selectedIds), teamId);
    exitMultiSelectMode();
  };

  const renderPlayers = (list: Player[]) =>
    list.map((player) => (
      <PlayerCard
        key={player.id}
        player={player}
        compact
        selectionMode={isMultiSelectMode}
        selected={selectedIds.has(player.id)}
        onToggleSelect={toggleSelection}
        onAssignTeam={onAssignTeam}
        onRemove={onRemove}
      />
    ));

  return (
    <Card className="h-full gap-0 py-0 shadow-sm">
      <CardHeader
        className={cn(
          "rounded-t-xl border-b px-4 py-4",
          config.headerClass,
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="shrink-0 text-base font-semibold">
            {config.label}
          </CardTitle>

          {isMultiSelectMode && (
            <div className="flex flex-wrap items-center gap-1.5">
              {BULK_ASSIGN_TEAMS.map((team) => (
                <Button
                  key={team.id}
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={selectedIds.size === 0}
                  onClick={() => handleBulkAssign(team.id)}
                  className={cn("h-8 min-h-8 px-2.5 text-xs", team.buttonClass)}
                >
                  {team.label}
                </Button>
              ))}
            </div>
          )}

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={isMultiSelectMode ? "secondary" : "outline"}
              onClick={toggleMultiSelectMode}
              className="h-8 min-h-8 px-2.5 text-xs"
            >
              {isMultiSelectMode ? "취소" : "다중선택"}
            </Button>

            <Badge className={cn("px-2.5 py-1 text-sm", config.badgeClass)}>
              {players.length}명
            </Badge>
          </div>
        </div>

        {isMultiSelectMode && selectedIds.size > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {selectedIds.size}명 선택됨 · 팀 버튼을 눌러 일괄 배정
          </p>
        )}
      </CardHeader>

      <CardContent className="px-4 py-4">
        {players.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            아직 배정된 선수가 없습니다
          </p>
        ) : (
          <div>
            <div
              className={waitingMainGridClassName}
              style={waitingMainGridStyle}
            >
              {renderPlayers(mainPlayers)}
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
                  {renderPlayers(overflowPlayers)}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
