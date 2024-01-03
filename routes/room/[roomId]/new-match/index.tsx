import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { State } from "@/routes/_middleware.ts";
import { createMatch, getCorporations, getRoomWithUsers } from "@/utils/db.ts";
import { Corporation, RoomWithUsers } from "@/utils/types/types.ts";

interface NewMatchProps {
  roomWithUsers: RoomWithUsers;
  corps: Corporation[];
}
export const handler: Handlers<NewMatchProps, State> = {
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
export default function NewMatchPage(props: PageProps<NewMatchProps, State>) {
  const err = props.url.searchParams.get("error");
  return (
    <>
      <h2 className="text-xl font-bold mb-5">New match!</h2>
      <form
        method="post"
        className="flex flex-col"
      >
        <div className="divide-y divide-stone-500">
          {props.data.roomWithUsers.users.map(
            (user) => {
              return (
                <div className="py-3 flex flex-col gap-2">
                  <input
                    name="userIds"
                    value={user.id}
                    type={"text"}
                    className={"hidden"}
                  />
                  <label className="flex gap-2 justify-between ">
                    <span className="font-bold">{user.name}</span>
                    <div className="flex gap-2">
                      <input
                        name={`points`}
                        className="border-2 border-stone-500 bg-stone-800 border-none rounded p-1"
                        pattern="[0-9]*"
                        type="number"
                        min="0"
                        max="250"
                      />
                      <span>VP</span>
                    </div>
                  </label>
                  <label className="flex justify-between">
                    <span className="font-bold">Corporation</span>
                    <select
                      name="corp"
                      className="border-2 border-stone-500 bg-stone-800 border-none rounded p-1"
                    >
                      <option value="">{" "}</option>
                      {props.data.corps.map((c) => {
                        return <option value={c.id}>{c.name}</option>;
                      })}
                    </select>
                  </label>
                </div>
              );
            },
          )}
        </div>
        <div className="flex justify-center divide-none">
          <button
            type="submit"
            className=" my-2 px-6 py-2 w-fit font-semibold rounded-lg bg-transparent text-stone-100 border-2 border-stone-100 hover:bg-stone-800 focus:bg-stone-800"
          >
            Create match
          </button>
        </div>
      </form>
      {err && <span>{err}</span>}
    </>
  );
}
