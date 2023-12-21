import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import Layout from "../../../components/Layout.tsx";
import { State } from "../../_middleware.ts";
import {
  fetchMatchDetails,
  getRoomWithUsers,
  Matches,
} from "../../../utils/db.ts";

export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    const matches = await fetchMatchDetails(ctx.state.supabaseClient);
    const roomWithUsers = await getRoomWithUsers(
      ctx.state.supabaseClient,
      ctx.params.roomId,
    );
    return ctx.render({ ...ctx.state, matches, roomWithUsers });
  },
};

export default function RoomPage(props: PageProps) {
  const room = props.data.roomWithUsers;
  const createdAt = new Date(room.created_at);
  const users = room.users;
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
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-red-500 to-amber-400 group-hover:from-red-500 group-hover:to-amber-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-800"
            href={`/room/${props.params.roomId}/new-player`}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-zinc-900 rounded-md group-hover:bg-opacity-0">
              New Player
            </span>
          </a>
          <a
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-amber-500 to-red-400 group-hover:from-amber-500 group-hover:to-red-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-amber-800"
            href={`/room/${props.params.roomId}/new-match`}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-zinc-900 rounded-md group-hover:bg-opacity-0">
              New Match
            </span>
          </a>
        </div>
        {!!props.data.matches.length &&
          (
            <div class="my-3">
              <h2 class="font-semibold text-lg">Matches</h2>
              <div class="flex flex-col justify-center ">
                {(props.data.matches as Matches).map((m) => {
                  return (
                    <div class="border border-zinc-700 rounded-lg p-4 my-2 flex flex-col ">
                      <time
                        class="text-xs font-medium px-2.5 py-0.5 rounded bg-amber-900 text-amber-300 w-fit mb-4 self-start"
                        dateTime={new Date(m.created_at).toString()}
                      >
                        {new Date(m.created_at).toLocaleDateString()}
                      </time>
                      {m.match_participants.map((mp, index) => {
                        const eloDiffColor = Math.round(
                          mp.new_elo - mp.old_elo,
                        );
                        return (
                          <div class="flex flex-no-wrap gap-2">
                            <span class="shrink">
                              {index + 1}.
                            </span>
                            <div class="grow flex flex-col">
                              <span class="font-semibold col-span-2">
                                {mp.user.name}
                              </span>
                              <span className="col-span-3 col-start-2 row-start-2 font-light text-xs text-zinc-400">
                                {mp.corporation.name}
                              </span>
                            </div>
                            {eloDiffColor > 0
                              ? (
                                <span class="font-semibold text-emerald-500 col-start-4 justify-self-end">
                                  {eloDiffColor}
                                </span>
                              )
                              : (
                                <span className="font-semibold text-red-500 col-start-4 justify-self-end">
                                  {eloDiffColor}
                                </span>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    </Layout>
  );
}
