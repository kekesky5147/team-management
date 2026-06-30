"use client";

import { Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

import { PlayerCard } from "@/components/team/PlayerCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  appleCard,
  appleCardContent,
  appleCardHeader,
  appleDivider,
  appleMuted,
  appleSectionLabel,
  appleSmallButton,
  appleTouchIconButton,
} from "@/lib/apple-ui";
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
  onAssignTeamsBulk: (ids: string[], teamId: TeamId | null) => void;
  onRemoveBulk: (ids: string[]) => void;
};

const waitingMainGridClassName = "grid w-full grid-flow-col gap-2 sm:gap-2.5";

const waitingMainGridStyle: React.CSSProperties = {
  gridTemplateColumns: `repeat(${WAITING_GRID.columns}, minmax(0, 1fr))`,
  gridTemplateRows: `repeat(${WAITING_GRID.rows}, ${WAITING_GRID.rowHeightRem}rem)`,
  maxHeight: WAITING_GRID_MAX_HEIGHT,
};

const waitingOverflowGridClassName = "grid w-full grid-cols-3 gap-2 sm:gap-2.5";

export function WaitingColumn({
  config,
  players,
  onAssignTeamsBulk,
  onRemoveBulk,
}: WaitingColumnProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const mainPlayers = players.slice(0, WAITING_GRID_CAPACITY);
  const overflowPlayers = players.slice(WAITING_GRID_CAPACITY);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

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
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;

    onRemoveBulk(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const renderPlayers = (list: Player[]) =>
    list.map((player) => (
      <PlayerCard
        key={player.id}
        player={player}
        compact
        selectionMode
        selected={selectedIds.has(player.id)}
        onToggleSelect={toggleSelection}
      />
    ));

  return (
    <Card className={cn(appleCard, "h-full")}>
      <CardHeader
        className={cn(
          appleCardHeader,
          "rounded-t-2xl",
          config.headerClass,
        )}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="shrink-0 text-base font-semibold tracking-tight text-inherit">
              {config.label}
            </CardTitle>

            <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
              {BULK_ASSIGN_TEAMS.map((team) => (
                <Button
                  key={team.id}
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={selectedIds.size === 0}
                  onClick={() => handleBulkAssign(team.id)}
                  aria-label={`${team.label} 배정`}
                  className={cn(
                    appleTouchIconButton,
                    "text-sm font-semibold disabled:opacity-40",
                    team.buttonClass,
                  )}
                >
                  {team.id}
                </Button>
              ))}

              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={selectedIds.size === 0}
                onClick={handleBulkDelete}
                aria-label="선택 삭제"
                className={cn(
                  appleTouchIconButton,
                  "bg-red-500/10 text-red-300/90 disabled:opacity-40",
                )}
              >
                <Trash2 className="size-4" />
              </Button>

              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={selectedIds.size === 0}
                onClick={clearSelection}
                className={cn(
                  appleSmallButton,
                  "bg-white/8 text-neutral-300 disabled:opacity-40",
                )}
              >
                취소
              </Button>

              <Badge
                className={cn(
                  "rounded-full border-0 px-3 py-1 text-sm font-medium shadow-none",
                  config.badgeClass,
                )}
              >
                {players.length}명
              </Badge>
            </div>
          </div>

          {selectedIds.size > 0 && (
            <p className={`${appleMuted} text-xs`}>
              {selectedIds.size}명 선택됨 · 팀 아이콘 또는 삭제
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent
        className={cn(appleCardContent, "cursor-default")}
        onClick={clearSelection}
      >
        {players.length === 0 ? (
          <p className={`${appleMuted} py-12 text-center`}>
            아직 배정된 선수가 없습니다
          </p>
        ) : (
          <div onClick={(event) => event.stopPropagation()}>
            <div
              className={waitingMainGridClassName}
              style={waitingMainGridStyle}
            >
              {renderPlayers(mainPlayers)}
            </div>

            {overflowPlayers.length > 0 && (
              <div>
                <div className={appleDivider} />
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className={appleSectionLabel}>추가 인원</p>
                  <Badge className="rounded-full border-0 bg-white/10 px-3 py-1 text-sm font-medium text-neutral-300 shadow-none">
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
