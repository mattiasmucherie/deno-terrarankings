import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import Layout from "../../../components/Layout.tsx";
import { State } from "../../_middleware.ts";
import {
  fetchMatchDetails,
  getOneRoom,
  getUsersInRoom,
  Matches,
} from "../../../utils/db.ts";

export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    const rooms = await getOneRoom(
      ctx.state.supabaseClient,
      ctx.params.roomId,
    );
    ctx.state.rooms = rooms;
    const data = await getUsersInRoom(
      ctx.state.supabaseClient,
      ctx.params.roomId,
    );
    ctx.state.users = data;
    const matches = await fetchMatchDetails(ctx.state.supabaseClient);
    ctx.state.matches = matches;
    return ctx.render({ ...ctx.state });
  },
};

export default function RoomPage(props: PageProps) {
  const room = props.data.rooms[0];
  const createdAt = new Date(room.created_at);
  const users = props.data.users;
  return (
    <Layout isLoggedIn={props.data.token}>
      <div className="mx-auto flex max-w-screen-md flex-col justify-center">
        <h2 class="font-bold text-2xl">{room.name}</h2>
        <time
          class="font-light text-xs text-zinc-400"
          dateTime={createdAt.toString()}
        >
          Created at {createdAt.toLocaleDateString()}
        </time>
        <ul class="divide-y divide-zinc-700 flex flex-col justify-center border border-zinc-700 rounded-lg p-6 my-3">
          <h3 className="my-2 font-semibold text-lg">Ranking</h3>
          {users.map((user: any) => {
            return (
              <li class="flex justify-between items-center py-3">
                <span>{user.name}</span>{" "}
                <span class="font-semibold">{Math.round(user.elo_rating)}</span>
              </li>
            );
          })}
        </ul>
        <div class="flex gap-6 justify-end">
          <a
            className=" text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:ring-red-700 font-medium focus:outline-none rounded-md text-sm px-5 py-2.5 flex justify-center align-center"
            href={`/room/${props.params.roomId}/new-player`}
          >
            New Player
          </a>
          <a
            className=" text-white bg-amber-800 hover:bg-amber-900 focus:ring-4 focus:ring-amber-700 font-medium focus:outline-none rounded-md text-sm px-5 py-2.5 flex justify-center align-center"
            href={`/room/${props.params.roomId}/new-match`}
          >
            New Match
          </a>
        </div>
        {!!props.data.matches.length &&
          (
            <div class="my-3">
              <h2 class="font-semibold text-lg">Matches</h2>
              <ul class="flex flex-col justify-center ">
                {(props.data.matches as Matches).map((m) => {
                  return (
                    <li class="border border-zinc-700 rounded-lg p-6 my-3 flex flex-col gap-2 ">
                      <span class="font-light text-xs text-zinc-400">
                        Played{" "}
                        <time dateTime={new Date(m.created_at).toString()}>
                          {new Date(m.created_at).toLocaleDateString()}
                        </time>
                      </span>
                      {m.match_participants.map((mp) => {
                        const eloDiffColor = Math.round(
                          mp.new_elo - mp.old_elo,
                        );
                        return (
                          <div class="flex justify-between">
                            <span class="font-semibold">{mp.user.name}</span>
                            <span>{mp.corporation.name}</span>
                            {eloDiffColor > 0
                              ? (
                                <span class="font-semibold text-emerald-500">
                                  {eloDiffColor}
                                </span>
                              )
                              : (
                                <span className="font-semibold text-red-500">
                                  {eloDiffColor}
                                </span>
                              )}
                          </div>
                        );
                      })}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
      </div>
    </Layout>
  );
}
