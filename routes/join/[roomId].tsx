import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import Layout from "../../components/Layout.tsx";
import { State } from "../_middleware.ts";
import * as bcrypt from "$bcrypt";
export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    let { data: rooms, error } = await ctx.state.supabaseClient
      .from("rooms")
      .select("*")
      .eq("id", ctx.params.roomId);
    ctx.state.rooms = rooms;
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
    let { data: rooms, error } = await ctx.state.supabaseClient
      .from("rooms")
      .select("*")
      .eq("id", ctx.params.roomId);

    const result = await bcrypt.compare(
      password,
      rooms[0].hashed_password,
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

export default function JoinRoomPage(props: PageProps) {
  const err = props.url.searchParams.get("error");

  return (
    <Layout isLoggedIn={props.data.token}>
      <div className="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
        <p>JOIN ROOM</p>
        <form method="post">
          <input
            type="password"
            id="roomPassword"
            name="roomPassword"
            placeholder="Enter room password"
          />
          <button type="submit" className="my-4">Enter rooom</button>
          <p>{err}</p>
        </form>
      </div>
    </Layout>
  );
}
