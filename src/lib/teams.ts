import type { TeamColumnConfig, TeamId } from "@/types/session";

export const TEAM_COLUMNS: TeamColumnConfig[] = [
  {
    id: "waiting",
    label: "출석 대기",
    headerClass: "bg-zinc-100 text-zinc-700 border-zinc-200",
    badgeClass: "bg-zinc-200 text-zinc-700",
  },
  {
    id: "A",
    label: "A팀",
    headerClass: "bg-blue-50 text-blue-700 border-blue-100",
    badgeClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "B",
    label: "B팀",
    headerClass: "bg-orange-50 text-orange-700 border-orange-100",
    badgeClass: "bg-orange-100 text-orange-700",
  },
  {
    id: "C",
    label: "C팀",
    headerClass: "bg-green-50 text-green-700 border-green-100",
    badgeClass: "bg-green-100 text-green-700",
  },
];

export const TEAM_ASSIGN_OPTIONS: {
  id: TeamId | "waiting";
  label: string;
}[] = [
  { id: "waiting", label: "출석 대기" },
  { id: "A", label: "A팀" },
  { id: "B", label: "B팀" },
  { id: "C", label: "C팀" },
];

export function getCurrentTeamOptionId(
  teamId: TeamId | null,
): TeamId | "waiting" {
  return teamId ?? "waiting";
}
