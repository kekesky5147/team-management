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
  onAssignTeam: (id: string, teamId: TeamId | null) => void;
  onAssignTeamsBulk: (ids: string[], teamId: TeamId | null) => void;
  onRemove: (id: string) => void;
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
  onAssignTeam,
  onAssignTeamsBulk,
  onRemove,
  onRemoveBulk,
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
        selectionMode={isMultiSelectMode}
        selected={selectedIds.has(player.id)}
        onToggleSelect={toggleSelection}
        onAssignTeam={onAssignTeam}
        onRemove={onRemove}
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

            <div className="flex shrink-0 items-center gap-2">
              {isMultiSelectMode && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={selectedIds.size === 0}
                  onClick={handleBulkDelete}
                  aria-label="선택 삭제"
                  className={cn(
                    appleSmallButton,
                    "bg-red-500/10 text-red-300/90 disabled:opacity-40",
                  )}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}

              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={toggleMultiSelectMode}
                className={cn(
                  appleSmallButton,
                  isMultiSelectMode
                    ? "bg-white/12 text-neutral-100"
                    : "bg-white/8 text-neutral-300",
                )}
              >
                {isMultiSelectMode ? "취소" : "다중선택"}
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

          {isMultiSelectMode && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {BULK_ASSIGN_TEAMS.map((team) => (
                  <Button
                    key={team.id}
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={selectedIds.size === 0}
                    onClick={() => handleBulkAssign(team.id)}
                    className={cn(appleSmallButton, team.buttonClass)}
                  >
                    {team.label}
                  </Button>
                ))}
              </div>

              {selectedIds.size > 0 && (
                <p className={`${appleMuted} text-xs`}>
                  {selectedIds.size}명 선택됨 · 팀 배정 또는 삭제
                </p>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent
        className={cn(appleCardContent, isMultiSelectMode && "cursor-default")}
        onClick={isMultiSelectMode ? exitMultiSelectMode : undefined}
      >
        {players.length === 0 ? (
          <p className={`${appleMuted} py-12 text-center`}>
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
