"use client";

import { Check, ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  appleDropdownContent,
  applePlayerSurface,
  appleSelectableCard,
  appleSelectableCardSelected,
  appleSelectableCardUnselected,
  appleTouchIconButton,
} from "@/lib/apple-ui";
import {
  getCurrentTeamOptionId,
  TEAM_ASSIGN_OPTIONS,
} from "@/lib/teams";
import { cn } from "@/lib/utils";
import type { Player, TeamId } from "@/types/session";

type PlayerCardProps = {
  player: Player;
  compact?: boolean;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  onAssignTeam: (id: string, teamId: TeamId | null) => void;
  onRemove: (id: string) => void;
};

export function PlayerCard({
  player,
  compact = false,
  selectionMode = false,
  selected = false,
  onToggleSelect,
  onAssignTeam,
  onRemove,
}: PlayerCardProps) {
  const currentOptionId = getCurrentTeamOptionId(player.teamId);

  const handleAssign = (optionId: TeamId | "waiting") => {
    const teamId = optionId === "waiting" ? null : optionId;
    onAssignTeam(player.id, teamId);
  };

  const handleToggleSelect = () => {
    onToggleSelect?.(player.id);
  };

  const handleSelectionKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleToggleSelect();
  };

  if (selectionMode) {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        aria-label={`${player.name} ${selected ? "선택됨" : "선택 안 됨"}`}
        onClick={(event) => {
          event.stopPropagation();
          handleToggleSelect();
        }}
        onKeyDown={handleSelectionKeyDown}
        className={cn(
          appleSelectableCard,
          "grid place-items-center",
          compact
            ? "h-11 min-h-11 max-h-11 w-full min-w-0 px-1.5"
            : "min-h-11 w-full px-3 py-2",
          selected
            ? appleSelectableCardSelected
            : appleSelectableCardUnselected,
        )}
      >
        <span
          className={cn(
            "w-full min-w-0 truncate text-center font-medium text-neutral-200",
            compact ? "text-xs sm:text-sm" : "text-base",
            selected && "text-blue-100",
          )}
        >
          {player.name}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        applePlayerSurface,
        "relative grid w-full place-items-center",
        compact
          ? "h-10 min-h-10 max-h-10 min-w-0 px-8"
          : "min-h-11 px-11 py-1 sm:py-2",
      )}
    >
      <div className="w-full min-w-0">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className={cn(
                  "relative w-full min-w-0 touch-manipulation justify-center font-medium text-neutral-200 transition-all duration-200 active:scale-95 hover:bg-white/5",
                  compact
                    ? "h-10 min-h-10 rounded-lg px-0 text-xs"
                    : "min-h-11 rounded-lg px-0 text-base",
                )}
              />
            }
          >
            <span
              className={cn(
                "block w-full truncate text-center font-medium text-neutral-200",
                compact ? "text-xs" : "text-base",
              )}
            >
              {player.name}
            </span>
            {!compact && (
              <ChevronDown className="absolute top-1/2 right-0 size-4 -translate-y-1/2 shrink-0 text-neutral-500" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className={`${appleDropdownContent} w-40`}
          >
            {TEAM_ASSIGN_OPTIONS.map((option) => {
              const isCurrent = option.id === currentOptionId;

              return (
                <DropdownMenuItem
                  key={option.id}
                  disabled={isCurrent}
                  onClick={() => handleAssign(option.id)}
                  className="min-h-11 justify-center rounded-lg text-center text-base text-neutral-200 focus:bg-white/10"
                >
                  <span>{option.label}</span>
                  {isCurrent && (
                    <Check className="size-4 text-neutral-400" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Button
        type="button"
        variant="ghost"
        className={cn(
          appleTouchIconButton,
          "absolute top-1/2 right-0 -translate-y-1/2",
          compact && "h-8 min-h-8 w-8 min-w-8",
        )}
        aria-label={`${player.name} 삭제`}
        onClick={() => onRemove(player.id)}
      >
        <X className={compact ? "size-3.5" : "size-4"} />
      </Button>
    </div>
  );
}
