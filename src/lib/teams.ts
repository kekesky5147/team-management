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
      "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/50",
  },
  {
    id: "B",
    label: "B팀",
    buttonClass:
      "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-300 dark:hover:bg-orange-900/50",
  },
  {
    id: "C",
    label: "C팀",
    buttonClass:
      "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-900/50",
  },
];

export const TEAM_COLUMNS: TeamColumnConfig[] = [
  {
    id: "waiting",
    label: "출석 대기",
    headerClass:
      "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800/60 dark:text-zinc-200 dark:border-zinc-700",
    badgeClass:
      "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100",
  },
  {
    id: "A",
    label: "A팀",
    headerClass:
      "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900",
    badgeClass:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200",
  },
  {
    id: "B",
    label: "B팀",
    headerClass:
      "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-900",
    badgeClass:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-200",
  },
  {
    id: "C",
    label: "C팀",
    headerClass:
      "bg-green-50 text-green-700 border-green-100 dark:bg-green-950/50 dark:text-green-300 dark:border-green-900",
    badgeClass:
      "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200",
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
