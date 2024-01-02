import { FreshContext } from "$fresh/server.ts";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getCookies } from "$std/http/cookie.ts";
import { Session } from "https://deno.land/x/fresh_session@beta-0.3.0/src/type.ts";
import { Database } from "../utils/types/supabase.ts";

export interface State {
  token: string | null;
  supabaseClient: SupabaseClient<Database, "public">;
  session: Session<string, string>;
}

export async function handler(req: Request, ctx: FreshContext<State>) {
  const client = createClient<
    Database
  >(
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
