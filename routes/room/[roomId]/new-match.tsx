import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import Layout from "../../../components/Layout.tsx";
import { State } from "../../_middleware.ts";
import {
  createMatch,
  getCorporations,
  getRoomWithUsers,
} from "../../../utils/db.ts";

export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    const roomWithUsers = await getRoomWithUsers(
      ctx.state.supabaseClient,
      ctx.params.roomId,
    );
    const corps = await getCorporations(ctx.state.supabaseClient);

    return ctx.render({ ...ctx.state, roomWithUsers, corps });
  },
  async POST(req, ctx) {
    const roomsWithUser = await getRoomWithUsers(
      ctx.state.supabaseClient,
      ctx.params.roomId,
    );
    const form = await req.formData();
    try {
      await createMatch(
        ctx.state.supabaseClient,
        ctx.params.roomId,
        form,
        roomsWithUser.users,
      );
    } catch (err) {
      const headers = new Headers();
      headers.set(
        "location",
        `/room/${ctx.params.roomId}/new-match?error=${err.message}`,
      );
      return new Response(null, {
        status: 303,
        headers,
      });
    }

    const headers = new Headers();
    headers.set("location", `/room/${ctx.params.roomId}`);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
export default function NewMatchPage(props: PageProps) {
  const err = props.url.searchParams.get("error");
  return (
    <Layout isLoggedIn={props.data.token}>
      <h2 class="text-xl font-bold mb-5">New match!</h2>
      <form
        method="post"
        class="flex flex-col"
      >
        <div class="divide-y divide-zinc-500">
          {props.data.roomWithUsers.users.map(
            (user: {
              id: string;
              created_at: string;
              name: string;
              elo_rating: number;
              room_id: string;
            }) => {
              return (
                <div class="py-3 flex flex-col gap-2">
                  <input
                    name="userIds"
                    value={user.id}
                    type={"text"}
                    class={"hidden"}
                  />
                  <label class="flex gap-2 justify-between ">
                    <span class="font-bold">{user.name}</span>
                    <div class="flex gap-2">
                      <input
                        name={`points`}
                        class="border-solid border-2 border-zinc-500 bg-zinc-800 border-none rounded p-1"
                        pattern="[0-9]*"
                        type="number"
                        min="0"
                        max="300"
                      />
                      <span>VP</span>
                    </div>
                  </label>
                  <label class="flex justify-between">
                    <span class="font-bold">Corporation</span>
                    <select
                      name="corp"
                      class="border-solid border-2 border-zinc-500 bg-zinc-800 border-none rounded p-1"
                    >
                      <option value="">Please choose a corp</option>
                      {props.data.corps.map((c: any) => {
                        return <option value={c.id}>{c.name}</option>;
                      })}
                    </select>
                  </label>
                </div>
              );
            },
          )}
        </div>
        <div class="flex justify-center divide-none">
          <button
            type="submit"
            className=" my-2 px-6 py-2 w-fit font-semibold rounded-lg bg-transparent text-zinc-100 border-2 border-zinc-100 hover:bg-zinc-800 focus:bg-zinc-800"
          >
            Create match
          </button>
        </div>
      </form>
      {err && <span>{err}</span>}
    </Layout>
  );
}
