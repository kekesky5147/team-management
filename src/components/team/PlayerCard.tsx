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
  getCurrentTeamOptionId,
  TEAM_ASSIGN_OPTIONS,
} from "@/lib/teams";
import { cn } from "@/lib/utils";
import type { Player, TeamId } from "@/types/session";

type PlayerCardProps = {
  player: Player;
  compact?: boolean;
  onAssignTeam: (id: string, teamId: TeamId | null) => void;
  onRemove: (id: string) => void;
};

export function PlayerCard({
  player,
  compact = false,
  onAssignTeam,
  onRemove,
}: PlayerCardProps) {
  const currentOptionId = getCurrentTeamOptionId(player.teamId);

  const handleAssign = (optionId: TeamId | "waiting") => {
    const teamId = optionId === "waiting" ? null : optionId;
    onAssignTeam(player.id, teamId);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-lg border bg-background shadow-sm",
        compact
          ? "h-11 min-h-11 max-h-11 w-full min-w-0 px-1 py-1"
          : "gap-2 px-2 py-1.5",
      )}
    >
      <div className="min-w-0 flex-1">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className={cn(
                  "min-h-10 w-full touch-manipulation font-medium",
                  compact
                    ? "h-full min-h-0 justify-center px-1 text-xs active:bg-muted max-md:rounded-md md:justify-between sm:px-2 sm:text-sm"
                    : "justify-center px-3 text-base active:bg-muted max-md:rounded-md md:justify-between",
                )}
              />
            }
          >
            <span className="truncate">{player.name}</span>
            <ChevronDown
              className={cn(
                "hidden shrink-0 text-muted-foreground md:block",
                compact ? "size-3.5" : "size-4",
              )}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {TEAM_ASSIGN_OPTIONS.map((option) => {
              const isCurrent = option.id === currentOptionId;

              return (
                <DropdownMenuItem
                  key={option.id}
                  disabled={isCurrent}
                  onClick={() => handleAssign(option.id)}
                  className="min-h-10 text-base"
                >
                  <span className="flex-1">{option.label}</span>
                  {isCurrent && (
                    <Check className="size-4 text-muted-foreground" />
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
        size="icon-sm"
        className={cn(
          "shrink-0 text-muted-foreground hover:text-destructive",
          compact ? "h-8 min-h-8 min-w-8 w-8" : "min-h-10 min-w-10",
        )}
        aria-label={`${player.name} 삭제`}
        onClick={() => onRemove(player.id)}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
