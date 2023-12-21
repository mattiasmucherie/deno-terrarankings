import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import Layout from "../../../components/Layout.tsx";
import { State } from "../../_middleware.ts";
import {
  fetchMatchDetails,
  getRoomWithUsers,
  Matches,
} from "../../../utils/db.ts";
import { LinkButton } from "../../../components/LinkButton.tsx";

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
          <LinkButton
            href={`/room/${props.params.roomId}/new-player`}
          >
            New Player
          </LinkButton>
          <LinkButton
            href={`/room/${props.params.roomId}/new-match`}
          >
            New Match
          </LinkButton>
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
                          <div class="flex flex-no-wrap gap-2 items-baseline">
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
                                  &#9650; {eloDiffColor}
                                </span>
                              )
                              : (
                                <span className="font-semibold text-red-500 col-start-4 justify-self-end">
                                  &#9660; {eloDiffColor}
                                </span>
                              )}
                            <span class="font-normal text-xs text-zinc-400">
                              {mp.points} VP
                            </span>
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
