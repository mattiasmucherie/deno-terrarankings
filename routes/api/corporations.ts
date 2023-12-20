import { FreshContext } from "$fresh/server.ts";
import {State} from "../_middleware.ts";

export const handler = async  (req: Request, ctx: FreshContext<State>): Promise<Response> => {

  const reqData = await req.json()
  const { data, error } = await ctx.state.supabaseClient
    .from('corporations')
    .insert(reqData)
  if(error) {
    console.error(error)
  }
  return new Response("OK!");
};