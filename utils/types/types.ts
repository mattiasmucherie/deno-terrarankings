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
interface User {
  id: string;
  created_at: string;
  name: string;
  elo_rating: number;
  room_id: string;
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
  match_participants: MatchParticipant[];
}

export interface MatchParticipant {
  standing: number;
  new_elo: number;
  old_elo: number;
  points: number;
  user: { name: string };
  corporation: { name: string };
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
  name: string;
}
