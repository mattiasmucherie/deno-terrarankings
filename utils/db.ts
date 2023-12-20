import {FreshContext} from "$fresh/server.ts";
import {State} from "../routes/_middleware.ts";
import {SupabaseClient} from "@supabase/supabase-js";
import {elo} from "./elo.ts";

export const getAllRooms = async (sb: SupabaseClient<any, "public", any>) => {
  const {data, error} = await sb.from("rooms")
    .select("*")
  if (error) {
    throw new Error(error)
  }
  return data
}

export const getOneRoom = async (sb: SupabaseClient<any, "public", any>, id: string) => {
  const {data, error} = await sb.from("rooms")
    .select("*")
    .eq("id", id);
  if (error) {
    throw new Error(error)
  }
  return data
}

export const getCorporations = async (sb: SupabaseClient<any, "public", any>) => {
  const {data, error} = await sb.from("corporations").select("*")
  if (error) {
    throw new Error(error)
  }
  return data
}

export const getUsersInRoom = async (sb: SupabaseClient<any, "public", any>, id: string) => {
  const {data, error} = await sb
    .from("users")
    .select("*")
    .eq("room_id", id).order('elo_rating', {ascending: false})
  if (error) {
    throw new Error(error)
  }
  return data
}

export const createMatch = async (sb: SupabaseClient<any, "public", any>, roomId: string, form: FormData, userProfiles: any[]) => {
  const userIds = form.getAll("userIds");
  const points = form.getAll("points");
  const corps = form.getAll("corp")
  const users: any[] = []
  points.forEach((p, i) => {
    if (p && Number(p)) {
      users.push({user_id: userIds[i], points: Number(p), corporation_id: corps[i]})
    }
  })
  users.sort((a, b) => b.points - a.points);
  console.warn(users)
  const eloMap = new Map(userProfiles.map((item) => [item.id, item.elo_rating]));
  users.forEach((item) => {
    item.old_elo = eloMap.get(item.user_id) || 1000
  });

  const newElo = elo(users.map(u => u.old_elo), users.map(u => u.points))

  const {data: match} = await sb.from(
    "matches",
  ).upsert({
    room_id: roomId,
  }).select("id");

  users.forEach((item, index) => {
    item.standing = index + 1;
    item.new_elo = newElo[index]
    item.match_id = match[0].id
  });

  const {error} = await sb
    .from(
      "match_participants",
    ).upsert(users);

  for (const user of users) {
    await sb.from('users')
      .update({elo_rating: user.new_elo})
      .eq('id', user.user_id)
      .single();

  }
  if (error) {
    console.error(error)
  }
  return
}

export type Matches = Match[]

export interface Match {
  id: string
  created_at: string
  match_participants: MatchParticipant[]
}

export interface MatchParticipant {
  standing: number
  new_elo: number
  old_elo: number
  user: User
  corporation: Corporation
}

export interface User {
  name: string
}

export interface Corporation {
  name: string
}

export async function fetchMatchDetails(sb: SupabaseClient<any, "public", any>): Promise<Matches> {
  const {data, error} = await sb
    .from('matches')
    .select(`
            id,
            created_at,
            match_participants (
                standing,
                new_elo,
                old_elo,
                user: users (
                    name
                ),
                corporation: corporations (
                    name
                )
            )
        `).order('created_at', {ascending: false})

  if (error) {
    console.error('Error fetching data:', error);
    throw new Error(error)
  }

  return data
}
