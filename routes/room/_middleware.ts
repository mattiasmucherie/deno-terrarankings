import { FreshContext } from "$fresh/src/server/types.ts";
import { State } from "../_middleware.ts";

/**
 * Checks if a specific session is allowed for a given room ID.
 * If the session is allowed, it calls the `next` function.
 * If not, it returns a redirect response to a different URL.
 * @param _req - The request object representing an HTTP request.
 * @param ctx - The context object containing the state and other information.
 * @returns The result of the `next` function or a redirect response object.
 */
export async function handler(
  _req: Request,
  ctx: FreshContext<State>,
): Promise<Response> {
  const sessionRoomAllowed = ctx.state.session.get(`room-${ctx.params.roomId}`);

  if (sessionRoomAllowed === true) {
    return await ctx.next();
  }

  const redirectUrl = `/join/${ctx.params.roomId}`;
  const response = new Response("", {
    status: 307,
    headers: { Location: redirectUrl },
  });

  return response;
}
