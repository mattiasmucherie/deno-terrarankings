import {FreshContext} from "$fresh/server.ts";
import {State} from "../routes/_middleware.ts";
import {SupabaseClient} from "@supabase/supabase-js";

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

export const getUsersInRoom = async (sb: SupabaseClient<any, "public", any>, id: string) => {
  const {data, error} = await sb
    .from("users")
    .select("*")
    .eq("room_id", id);
  if (error) {
    throw new Error(error)
  }
  return data
}

export const createMatch = async (sb: SupabaseClient<any, "public", any>, roomId: string, form: FormData) => {
  const userIds = form.getAll("userIds");
  const points = form.getAll("points");
  const users: any[] = []
  points.forEach((p, i) => {
    if (p && Number(p)) {
      users.push({user_id: userIds[i], points: Number(p)})
    }
  })
  users.sort((a, b) => b.points - a.points);

  const {data: match} = await sb.from(
    "matches",
  ).upsert({
    room_id: roomId,
  }).select("id");

  users.forEach((item, index) => {
    item.standing = index + 1;
    item.old_elo = 1000
    item.new_elo = 1000
    item.match_id = match[0].id
  });

  const {data: matchParticipants, error} = await sb
    .from(
      "match_participants",
    ).upsert(users);
  if(error) {
    console.error(error)
  }
  return
}