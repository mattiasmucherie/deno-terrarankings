// deno-lint-ignore-file no-explicit-any
import { FreshContext } from "$fresh/server.ts";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getCookies } from "$std/http/cookie.ts";
import {Session} from "https://deno.land/x/fresh_session@beta-0.3.0/src/type.ts";
import { Matches } from "../utils/db.ts";

export interface State {
  token: string | null;
  supabaseClient: SupabaseClient<any, "public", any>;
  rooms: { id: string, created_at: string, name: string }[]
  users: { id: string, created_at: string, name: string, elo_rating: number, room_id: string }[]
  corps : {id:string, name: string}[]
  matches: Matches
  session: Session<string, string>
}

export async function handler(req: Request, ctx: FreshContext<State>) {
  const client = createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_KEY") || "",
  );

  ctx.state.supabaseClient = client;

  const supaCreds = getCookies(req.headers)["supaLogin"];

  if (!supaCreds) {
    return ctx.next();
  }

  const { error } = await client.auth.getUser(supaCreds);

  if (error) {
    console.log(error.message);
    ctx.state.token = null;
  } else {
    ctx.state.token = supaCreds;
  }

  return await ctx.next();
}
