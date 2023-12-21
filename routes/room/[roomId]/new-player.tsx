import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import Layout from "../../../components/Layout.tsx";
import { State } from "../../_middleware.ts";

export const handler: Handlers<any, State> = {
  GET(_req, ctx) {
    return ctx.render({ ...ctx.state });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const playerName = form.get("playerName") as string;

    const { error } = await ctx.state.supabaseClient
      .from("users")
      .insert([
        {
          name: playerName,
          room_id: ctx.params.roomId,
        },
      ]);

    const headers = new Headers();
    let redirect = `/room/${ctx.params.roomId}`;
    if (error) {
      redirect =
        `/room/${ctx.params.roomId}/new-player?error=could not create new player`;
    }
    headers.set("location", redirect);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default function NewPlayerPage(props: PageProps) {
  return (
    <Layout isLoggedIn={props.data.token}>
      <span>NEW PLAYER</span>
      <form method="post">
        <input type="name" name="playerName" />
        <button type="submit">CREATE NEW PLAYER</button>
      </form>
    </Layout>
  );
}
