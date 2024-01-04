import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { State } from "@/routes/_middleware.ts";
import {
  createMatch,
  getCorporations,
  getMaps,
  getRoomWithUsers,
} from "@/utils/db.ts";
import { Corporation, Maps, RoomWithUsers } from "@/utils/types/types.ts";

interface NewMatchProps {
  roomWithUsers: RoomWithUsers;
  corps: Corporation[];
  maps: Maps[];
}
export const handler: Handlers<NewMatchProps, State> = {
  async GET(_req, ctx) {
    const roomWithUsers = await getRoomWithUsers(
      ctx.state.supabaseClient,
      ctx.params.roomId,
    );
    const corps = await getCorporations(ctx.state.supabaseClient);
    const maps = await getMaps(ctx.state.supabaseClient);

    return ctx.render({ ...ctx.state, roomWithUsers, corps, maps });
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
      <h2 className="text-xl font-bold mb-5 font-sansman">New match</h2>
      <form
        method="post"
        className="flex flex-col  shadow-lg bg-gradient-to-br from-rust-900 via-bunker-950 to-bunker-950 rounded p-2"
      >
        <div className="flex flex-col gap-2 divide-y divide-concrete-500">
          {props.data.roomWithUsers.users.map(
            (user) => {
              return (
                <div className="py-3 flex flex-col gap-2 rounded p-2">
                  <input
                    name="userIds"
                    value={user.id}
                    type={"text"}
                    className={"hidden"}
                  />
                  <span className="font-bold text-xl font-sansman">
                    {user.name}
                  </span>
                  <div className="flex justify-between">
                    <label className="flex justify-between items-center">
                      <span className="sr-only">
                        Corporation
                      </span>
                      <select
                        name="corp"
                        className="bg-bunker-950 border border-bunker-900 rounded p-1 w-40 text-ellipsis text-sm"
                      >
                        <option value="">{"Select Corporation"}</option>
                        {props.data.corps.map((c) => {
                          return <option value={c.id}>{c.name}</option>;
                        })}
                      </select>
                    </label>
                    <label className="flex gap-2 justify-between items-center border border-bunker-900 rounded ">
                      <span className="bg-bunker-900 p-1">VP</span>
                      <input
                        name={`points`}
                        className="bg-bunker-950 p-1 rounded"
                        pattern="\d+"
                        required
                        type="number"
                        min="0"
                        max="250"
                      />
                    </label>
                  </div>
                </div>
              );
            },
          )}
          <label className="p-2 py-5 flex justify-end">
            <span className="sr-only">Choose a map</span>
            <select
              name="map"
              className="bg-bunker-950 border border-bunker-900 rounded p-1 "
              required
            >
              <option value="">{"Select map"}</option>
              {props.data.maps.map((m) => {
                return (
                  <option className="bg-green-500" value={m.id}>
                    {m.name}
                  </option>
                );
              })}
            </select>
          </label>
        </div>

        <div className="flex justify-center divide-none">
          <button
            type="submit"
            className=" my-2 px-6 py-2 w-fit font-semibold rounded bg-transparent text-concrete-100 border-2 border-concrete-100 hover:bg-concrete-800 focus:bg-concrete-800"
          >
            Create match
          </button>
        </div>
      </form>
      {err && <span className="text-red-500">Error: {err}</span>}
    </>
  );
}
