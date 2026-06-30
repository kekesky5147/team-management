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
  onAssignTeam: (id: string, teamId: TeamId | null) => void;
  onRemove: (id: string) => void;
};

export function PlayerCard({
  player,
  onAssignTeam,
  onRemove,
}: PlayerCardProps) {
  const currentOptionId = getCurrentTeamOptionId(player.teamId);

  const handleAssign = (optionId: TeamId | "waiting") => {
    const teamId = optionId === "waiting" ? null : optionId;
    onAssignTeam(player.id, teamId);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background px-2 py-1.5 shadow-sm">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="min-h-10 flex-1 justify-between px-3 text-base font-medium"
            />
          }
        >
          <span className="truncate">{player.name}</span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
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
                {isCurrent && <Check className="size-4 text-muted-foreground" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn(
          "shrink-0 text-muted-foreground hover:text-destructive",
          "min-h-10 min-w-10",
        )}
        aria-label={`${player.name} 삭제`}
        onClick={() => onRemove(player.id)}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
