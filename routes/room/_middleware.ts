import { FreshContext } from "$fresh/src/server/types.ts";
import { State } from "../_middleware.ts";

export async function handler(req: Request, ctx: FreshContext<State>) {
  const sessionRoomAllowed = ctx.state.session.get(`room-${ctx.params.roomId}`);
  if (sessionRoomAllowed === true) {
    return await ctx.next();
  }
  return new Response("", {
    status: 307,
    headers: { Location: `/join/${ctx.params.roomId}` },
  });
}
