import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import Layout from "../../../components/Layout.tsx";
import { State } from "../../_middleware.ts";
import { createMatch, getOneRoom, getUsersInRoom } from "../../../utils/db.ts";

export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    const rooms = await getOneRoom(ctx.state.supabaseClient, ctx.params.roomId);
    const users = await getUsersInRoom(
      ctx.state.supabaseClient,
      ctx.params.roomId,
    );
    ctx.state.rooms = rooms;
    ctx.state.users = users;
    return ctx.render({ ...ctx.state });
  },
  async POST(req, ctx) {
    const rooms = await getOneRoom(ctx.state.supabaseClient, ctx.params.roomId);
    const users = await getUsersInRoom(
      ctx.state.supabaseClient,
      ctx.params.roomId,
    );
    ctx.state.rooms = rooms;
    ctx.state.users = users;

    const form = await req.formData();
    await createMatch(ctx.state.supabaseClient, ctx.params.roomId, form, users);

    const headers = new Headers();
    headers.set("location", `/room/${ctx.params.roomId}`);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
export default function NewMatchPage(props: PageProps) {
  return (
    <Layout isLoggedIn={props.data.token}>
      <div>New match!</div>
      <form method="post" class="flex flex-col gap-6">
        {props.data.users.map(
          (
            user: {
              id: string;
              created_at: string;
              name: string;
              elo_rating: number;
              room_id: string;
            },
          ) => {
            return (
              <div>
                <input
                  name="userIds"
                  value={user.id}
                  type={"text"}
                  class={"hidden"}
                />
                <label class="flex gap-6 ">
                  Points for: {user.name}
                  <input
                    name={`points`}
                    class="border-solid border-2 border-zinc-500"
                    type="number"
                  />
                </label>
              </div>
            );
          },
        )}
        <button type="submit">SUBMIT!!</button>
      </form>
    </Layout>
  );
}
