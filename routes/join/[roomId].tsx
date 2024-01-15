import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { State } from "../_middleware.ts";
import * as bcrypt from "$bcrypt";
import { getOneRoom } from "../../utils/db.ts";
export const handler: Handlers<unknown, State> = {
  GET(_req, ctx) {
    const allowedToRoom = ctx.state.session.get(`room-${ctx.params.roomId}`);

    if (allowedToRoom === true) {
      return new Response("", {
        status: 307,
        headers: { Location: `/room/${ctx.params.roomId}` },
      });
    }

    return ctx.render({ ...ctx.state });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const password = form.get("roomPassword") as string;
    const room = await getOneRoom(ctx.state.supabaseClient, ctx.params.roomId);
    const result = bcrypt.compareSync(
      password,
      room.hashed_password,
    );

    const headers = new Headers();
    let redirect = `/room/${ctx.params.roomId}`;
    if (result) {
      ctx.state.session.set(`room-${ctx.params.roomId}`, true);
    } else {
      redirect = `/join/${ctx.params.roomId}?error=wrong password`;
    }
    headers.set("location", redirect);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default function JoinRoomPage(props: PageProps<unknown, State>) {
  const err = props.url.searchParams.get("error");

  return (
    <div className="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
      <form method="post" className="flex flex-col gap-4 items-center">
        <div className="w-full">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-mercury-100"
          >
            Room Password
          </label>

          <input
            type="password"
            id="roomPassword"
            name="roomPassword"
            className="bg-cod-gray-950 border border-mercury-100 rounded text-sm block w-full p-2.5 placeholder-mercury-100 text-mercury-100"
            placeholder="Enter room password"
            required
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 w-fit font-semibold rounded bg-transparent text-mercury-100 border border-mercury-100 "
        >
          Enter room
        </button>
        {err && <p>{err}</p>}
      </form>
    </div>
  );
}
