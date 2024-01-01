import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import Layout from "../../components/Layout.tsx";
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
      room[0].hashed_password,
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
    <Layout isLoggedIn={!!props.state.token}>
      <div className="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
        <form method="post" className="flex flex-col gap-4 items-center">
          <div className="w-full">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-ivory"
            >
              Room Password
            </label>

            <input
              type="password"
              id="roomPassword"
              name="roomPassword"
              className="bg-licorice border border-ivory rounded-lg text-sm block w-full p-2.5 placeholder-ivory text-ivory"
              placeholder="Enter room password"
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 w-fit font-semibold rounded-lg bg-transparent text-ivory border border-ivory "
          >
            Enter room
          </button>
          {err && <p>{err}</p>}
        </form>
      </div>
    </Layout>
  );
}
