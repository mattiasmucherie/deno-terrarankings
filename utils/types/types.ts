export type Rooms = Room[];

interface Room {
  id: string;
  created_at: string;
  name: string;
  users: User[];
}

export interface OneRoom {
  id: string;
  created_at: string;
  name: string;
  hashed_password: string;
}
export interface User {
  id: string;
  created_at: string;
  name: string;
  elo_rating: number;
  room_id: string | null;
}

export type CorporationData = {
  total_plays: number;
  name: string;
  winrate: number;
  id: string;
  adjustedWinRate: number;
};

export interface MatchDetails {
  id: string;
  created_at: string;
  room_id: string;
  maps: { name: string; color: string | null } | null;
  match_participants: MatchParticipant[];
}

export interface MatchParticipant {
  standing: number;
  new_elo: number;
  old_elo: number;
  points: number;
  user: { name: string } | null;
  corporation: { name: string | null } | null;
}
export interface RoomWithUsers {
  id: string;
  created_at: string;
  name: string;
  hashed_password: string;
  users: User[];
}
export interface Corporation {
  id: string;
  created_at: string;
  name: string | null;
}

export interface LatestMatches {
  standing: number;
  old_elo: number;
  new_elo: number;
  points: number;
  matches: { created_at: string } | null;
  corporations: { name: string | null } | null;
  users: {
    name: string;
    elo_rating: number;
  } | null;
}

export interface RivalStat {
  rival_name: string | null;
  games_played: number | null;
}
