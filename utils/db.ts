import { SupabaseClient } from "@supabase/supabase-js";
import { elo } from "./elo.ts";

export const getAllRooms = async (sb: SupabaseClient<any, "public", any>) => {
  const { data, error } = await sb.from("rooms")
    .select(`
      *,
      users (
        *
      )
    `);
  if (error) {
    throw new Error(error);
  }
  return data;
};

export const getOneRoom = async (
  sb: SupabaseClient<any, "public", any>,
  id: string,
) => {
  const { data, error } = await sb.from("rooms")
    .select("*")
    .eq("id", id);
  if (error) {
    throw new Error(error);
  }
  return data;
};

export const getCorporations = async (
  sb: SupabaseClient<any, "public", any>,
) => {
  const { data, error } = await sb.from("corporations").select("*").order(
    "name",
    { ascending: true },
  );
  if (error) {
    throw new Error(error);
  }
  return data;
};

export const getUsersInRoom = async (
  sb: SupabaseClient<any, "public", any>,
  id: string,
) => {
  const { data, error } = await sb
    .from("users")
    .select("*")
    .eq("room_id", id).order("elo_rating", { ascending: false });
  if (error) {
    throw new Error(error);
  }
  return data;
};

export const getRoomWithUsers = async (
  sb: SupabaseClient<any, "public", any>,
  roomId: string,
) => {
  const { data, error } = await sb
    .from("rooms")
    .select(`
      *,
      users (
        *
      )
    `)
    .eq("id", roomId)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  data.users.sort((a: any, b: any) => b.elo_rating - a.elo_rating);
  return data;
};

export async function getRoomDetailsWithMatches(
  sb: SupabaseClient<any, "public", any>,
  roomId: string,
) {
  const { data, error } = await sb
    .rpc("get_room_details_with_matches", { room_id: roomId });

  if (error) {
    console.error("Error fetching data:", error);
    throw new Error(error.message);
  }

  return data;
}

function checkUniqueElementsWithEmptyAllowed(arr: FormDataEntryValue[]) {
  const uniqueElements = new Set();

  for (const elem of arr) {
    // Skip empty strings
    if (elem === "") continue;

    // Check if the element is already in the set (not unique)
    if (uniqueElements.has(elem)) {
      return false;
    }

    // Add the element to the set
    uniqueElements.add(elem);
  }

  // If all non-empty elements are unique
  return true;
}
export const createMatch = async (
  sb: SupabaseClient<any, "public", any>,
  roomId: string,
  form: FormData,
  userProfiles: any[],
) => {
  const userIds = form.getAll("userIds");
  const points = form.getAll("points");
  const corps = form.getAll("corp");
  if (!checkUniqueElementsWithEmptyAllowed(corps)) {
    throw new Error("Cannot have the same corporation for multiple players");
  }
  const users: any[] = [];
  points.forEach((p, i) => {
    if (p && Number(p)) {
      users.push({
        user_id: userIds[i],
        points: Number(p),
        corporation_id: corps[i],
      });
    }
  });
  users.sort((a, b) => b.points - a.points);
  const eloMap = new Map(
    userProfiles.map((item) => [item.id, item.elo_rating]),
  );
  users.forEach((item) => {
    item.old_elo = eloMap.get(item.user_id) || 1000;
  });

  const newElo = elo(users.map((u) => u.old_elo), users.map((u) => u.points));

  const { data: match } = await sb.from(
    "matches",
  ).upsert({
    room_id: roomId,
  }).select("id");

  users.forEach((item, index) => {
    item.standing = index + 1;
    item.new_elo = newElo[index];
    item.match_id = match[0].id;
  });

  const { error } = await sb
    .from(
      "match_participants",
    ).upsert(users);

  for (const user of users) {
    await sb.from("users")
      .update({ elo_rating: user.new_elo })
      .eq("id", user.user_id)
      .single();
  }
  if (error) {
    console.error(error);
  }
  return;
};

export type Matches = Match[];

export interface Match {
  id: string;
  created_at: string;
  match_participants: MatchParticipant[];
}

export interface MatchParticipant {
  standing: number;
  new_elo: number;
  old_elo: number;
  points: number;
  user: User;
  corporation: Corporation;
}

export interface User {
  name: string;
}

export interface Corporation {
  name: string;
}

export async function fetchMatchDetails(
  sb: SupabaseClient<any, "public", any>,
  roomId: string,
  limit: number | boolean = 3,
): Promise<Matches> {
  const { data, error } = await sb
    .from("matches")
    .select(`
            id,
            created_at,
            room_id,
            match_participants (
                standing,
                new_elo,
                old_elo,
                points,
                user: users (
                    name
                ),
                corporation: corporations (
                    name
                )
            )
        `).eq("room_id", roomId).order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching data:", error);
    throw new Error(error);
  }

  return data;
}

interface GameStat {
  id: string;
  name: string;
  total_plays: number;
  winrate: number; // Assuming this is a percentage
}
function calculateAdjustedWinRates(
  data: GameStat[],
) {
  // Calculate the overall average win rate
  const totalWinRate = data.reduce(
    (acc, game) => acc + (game.winrate / 100),
    0,
  );
  const M = totalWinRate / data.length;
  // Calculate the average number of games played
  const totalPlays = data.reduce((acc, game) => acc + game.total_plays, 0);
  const C = totalPlays / data.length;

  // Function to calculate Bayesian adjusted win rate
  const getAdjustedWinRate = (game: GameStat): number => {
    return ((C * M) + (game.total_plays * (game.winrate / 100))) /
      (C + game.total_plays);
  };

  // Calculate and return the adjusted win rates
  return data.map((game) => ({
    ...game,
    adjustedWinRate: getAdjustedWinRate(game) * 100,
  })).sort((a, b) => b.adjustedWinRate - a.adjustedWinRate);
}
export const getCorporationPlayStats = async (
  sb: SupabaseClient<any, "public", any>,
) => {
  const { data, error } = await sb.from("corporation_stats").select("*");

  if (error) {
    throw new Error(error.message);
  }
  return calculateAdjustedWinRates(data);
};

export const getRoomStats = async (
  sb: SupabaseClient<any, "public", any>,
  roomId: string,
) => {
  const { data, error } = await sb.from("room_stats")
    .select("*")
    .eq("room_id", roomId);

  if (error) {
    throw new Error(error.message);
  }
  console.warn(data);
  return data;
};

type MatchDetails = {
  standing: number;
  old_elo: number;
  new_elo: number;
  points: number;
  matches: {
    created_at: string;
  };
  corporations: {
    name: string;
  };
  users: {
    name: string;
    elo_rating: number;
  };
};

export type UserMatchData = MatchDetails[];

export async function getUserLatestMatches(
  sb: SupabaseClient<any, "public", any>,
  userId: string,
) {
  const { data, error } = await sb
    .from("match_participants")
    .select(`
        standing,
        old_elo,
        new_elo,
        points,
        matches (
          created_at
        ),
        corporations (
          name
        ),
        users (
          name,
          elo_rating
        )
      `)
    .eq("user_id", userId);

  if (error) throw error;
  (data as UserMatchData).sort((a, b) => {
    const dateA = new Date(a.matches.created_at);
    const dateB = new Date(b.matches.created_at);

    return dateB.getTime() - dateA.getTime();
  });
  return (data as UserMatchData);
}
