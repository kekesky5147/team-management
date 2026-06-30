import type { TeamColumnConfig, TeamId } from "@/types/session";

/** 출석 대기 그리드: 세로 11줄 × 가로 3열 */
export const WAITING_GRID = {
  rows: 11,
  columns: 3,
  rowHeightRem: 2.75,
  gapRem: 0.5,
} as const;

export const WAITING_GRID_MAX_HEIGHT = `calc(${WAITING_GRID.rows} * ${WAITING_GRID.rowHeightRem}rem + ${WAITING_GRID.rows - 1} * ${WAITING_GRID.gapRem}rem)`;

export const WAITING_GRID_CAPACITY =
  WAITING_GRID.rows * WAITING_GRID.columns;

export const BULK_ASSIGN_TEAMS: {
  id: TeamId;
  label: string;
  buttonClass: string;
}[] = [
  {
    id: "A",
    label: "A팀",
    buttonClass:
      "bg-blue-500/10 text-blue-200/90 hover:bg-blue-500/15 hover:shadow-blue-500/10",
  },
  {
    id: "B",
    label: "B팀",
    buttonClass:
      "bg-orange-500/10 text-orange-200/90 hover:bg-orange-500/15 hover:shadow-orange-500/10",
  },
  {
    id: "C",
    label: "C팀",
    buttonClass:
      "bg-emerald-500/10 text-emerald-200/90 hover:bg-emerald-500/15 hover:shadow-emerald-500/10",
  },
];

export const TEAM_COLUMNS: TeamColumnConfig[] = [
  {
    id: "waiting",
    label: "출석 대기",
    headerClass: "bg-white/[0.03] text-neutral-200",
    badgeClass: "bg-white/10 text-neutral-300",
  },
  {
    id: "A",
    label: "A팀",
    headerClass: "bg-blue-500/[0.06] text-blue-200/90",
    badgeClass: "bg-blue-400/10 text-blue-200/80",
  },
  {
    id: "B",
    label: "B팀",
    headerClass: "bg-orange-500/[0.06] text-orange-200/90",
    badgeClass: "bg-orange-400/10 text-orange-200/80",
  },
  {
    id: "C",
    label: "C팀",
    headerClass: "bg-emerald-500/[0.06] text-emerald-200/90",
    badgeClass: "bg-emerald-400/10 text-emerald-200/80",
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
