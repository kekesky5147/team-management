export type TeamId = "A" | "B" | "C";

export type Player = {
  id: string;
  name: string;
  teamId: TeamId | null;
};

export type SessionState = {
  players: Player[];
  updatedAt: string;
};

export type TeamColumnId = TeamId | "waiting";

export type TeamColumnConfig = {
  id: TeamColumnId;
  label: string;
  headerClass: string;
  badgeClass: string;
};
