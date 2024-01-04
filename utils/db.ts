import { SupabaseClient } from "@supabase/supabase-js";
import { elo } from "@/utils/elo.ts";
import { Database } from "@/utils/types/supabase.ts";
import {
  Corporation,
  CorporationData,
  LatestMatches,
  MatchDetails,
  OneRoom,
  RivalStat,
  Rooms,
  RoomWithUsers,
  User,
} from "@/utils/types/types.ts";

export const getAllRooms = async (
  sb: SupabaseClient<Database, "public">,
): Promise<Rooms> => {
  const { data, error } = await sb.from("rooms").select(`
      id,
      created_at,
      name,
      users (
        *
      )
    `);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getOneRoom = async (
  sb: SupabaseClient<Database, "public">,
  id: string,
): Promise<OneRoom> => {
  const { data, error } = await sb
    .from("rooms")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getCorporations = async (
  sb: SupabaseClient<Database, "public">,
): Promise<Corporation[]> => {
  const { data, error } = await sb
    .from("corporations")
    .select("*")
    .order("name", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getMaps = async (sb: SupabaseClient<Database, "public">) => {
  const { data, error } = await sb.from("maps").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getUsersInRoom = async (
  sb: SupabaseClient<Database, "public">,
  id: string,
) => {
  const { data, error } = await sb
    .from("users")
    .select("*")
    .eq("room_id", id)
    .order("elo_rating", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getRoomWithUsers = async (
  sb: SupabaseClient<Database, "public">,
  roomId: string,
): Promise<RoomWithUsers> => {
  const { data, error } = await sb
    .from("rooms")
    .select(
      `
      *,
      users (
        *
      )
    `,
    )
    .eq("id", roomId)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  data.users.sort((a: User, b: User) => b.elo_rating - a.elo_rating);
  return data;
};

export async function getRoomDetailsWithMatches(
  sb: SupabaseClient<Database, "public">,
  roomId: string,
) {
  const { data, error } = await sb.rpc("get_room_details_with_matches", {
    room_id: roomId,
  });

  if (error) {
    console.error("Error fetching data:", error);
    throw new Error(error.message);
  }

  return data;
}

function checkUniqueElementsWithEmptyAllowed(arr: FormDataEntryValue[]) {
  const uniqueElements = new Set();

  for (const elem of arr) {
    if (elem === "") continue;
    if (uniqueElements.has(elem)) {
      return false;
    }
    uniqueElements.add(elem);
  }
  return true;
}

export const createMatch = async (
  sb: SupabaseClient<Database, "public">,
  roomId: string,
  form: FormData,
  userProfiles: User[],
) => {
  const userIds = form.getAll("userIds");
  const points = form.getAll("points");
  const corps = form.getAll("corp");
  const mapId = form.get("map")?.toString() || null;

  if (!checkUniqueElementsWithEmptyAllowed(corps)) {
    throw new Error("Cannot have the same corporation for multiple players");
  }

  const users: {
    user_id: string;
    points: number;
    corporation_id: string;
    old_elo: number;
    match_id: string;
    standing: number;
    new_elo: number;
  }[] = [];
  points.forEach((p, i) => {
    if (p && Number(p)) {
      users.push({
        user_id: userIds[i] as string,
        points: Number(p),
        corporation_id: corps[i] as string,
        old_elo: 0,
        new_elo: 0,
        standing: 0,
        match_id: "",
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

  const newElo = elo(
    users.map((u) => u.old_elo),
    users.map((u) => u.points),
  );

  const { data: match } = await sb
    .from("matches")
    .upsert({
      room_id: roomId,
      map_id: mapId,
    })
    .select("id");
  if (match) {
    users.forEach((item, index) => {
      item.standing = index + 1;
      item.new_elo = newElo[index];
      item.match_id = match[0].id;
    });
  }
  const { error } = await sb.from("match_participants").upsert(users);

  for (const user of users) {
    await sb
      .from("users")
      .update({ elo_rating: user.new_elo })
      .eq("id", user.user_id)
      .single();
  }
  if (error) {
    console.error(error);
  }
  return;
};

export async function fetchMatchDetails(
  sb: SupabaseClient<Database, "public">,
  roomId: string,
  limit: number | boolean = 3,
): Promise<MatchDetails[]> {
  const { data, error } = await sb
    .from("matches")
    .select(
      `
            id,
            created_at,
            room_id,
            maps(
              name,
              color
            ),
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
        `,
    )
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })
    .limit(limit as number);

  if (error) {
    console.error("Error fetching data:", error);
    throw new Error(error.message);
  }

  return data;
}

interface GameStat {
  id: string;
  name: string;
  total_plays: number;
  winrate: number;
}

function calculateAdjustedWinRates(data: GameStat[]) {
  const totalWinRate = data.reduce((acc, game) => acc + game.winrate! / 100, 0);
  const M = totalWinRate / data.length;
  const totalPlays = data.reduce((acc, game) => acc + game.total_plays!, 0);
  const C = totalPlays / data.length;

  const getAdjustedWinRate = (game: GameStat): number => {
    return (
      (C * M + game.total_plays! * (game.winrate! / 100)) /
      (C + game.total_plays!)
    );
  };

  return data
    .map((game) => ({
      ...game,
      adjustedWinRate: getAdjustedWinRate(game) * 100,
    }))
    .sort((a, b) => b.adjustedWinRate - a.adjustedWinRate);
}

export const getCorporationPlayStats = async (
  sb: SupabaseClient<Database, "public">,
): Promise<CorporationData[]> => {
  const { data, error } = await sb.from("corporation_stats").select("*");

  if (error) {
    throw new Error(error.message);
  }
  return calculateAdjustedWinRates(data);
};

export const getRoomStats = async (
  sb: SupabaseClient<Database, "public">,
  roomId: string,
) => {
  const { data, error } = await sb
    .from("room_stats")
    .select("*")
    .eq("room_id", roomId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export async function getUserLatestMatches(
  sb: SupabaseClient<Database, "public">,
  userId: string,
): Promise<LatestMatches[]> {
  const { data, error } = await sb
    .from("match_participants")
    .select(
      `
        standing,
        old_elo,
        new_elo,
        points,
        matches (
          created_at,
          maps(
            name
          )
        ),
        corporations (
          name
        ),
        users (
          name,
          elo_rating
        )
      `,
    )
    .eq("user_id", userId);

  if (error) throw error;
  data.sort((a, b) => {
    const dateA = new Date(a.matches!.created_at);
    const dateB = new Date(b.matches!.created_at);

    return dateB.getTime() - dateA.getTime();
  });
  return data;
}

export async function getMainRival(
  sb: SupabaseClient<Database, "public">,
  playerId: string,
): Promise<RivalStat> {
  const { data, error } = await sb
    .from("rival_stats")
    .select("rival_name, games_played")
    .eq("main_user_id", playerId)
    .order("games_played", { ascending: false })
    .limit(1);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data[0];
}
