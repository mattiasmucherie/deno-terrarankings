import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import Layout from "../../../components/Layout.tsx";
import { State } from "../../_middleware.ts";
import {
  fetchMatchDetails,
  getRoomWithUsers,
  Matches,
} from "../../../utils/db.ts";
import { LinkButton } from "../../../components/LinkButton.tsx";
import { MatchCard } from "../../../components/MatchCard.tsx";

export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    const matches = await fetchMatchDetails(
      ctx.state.supabaseClient,
      ctx.params.roomId,
    );
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
        <h2 class="font-bold text-2xl mb-1">{room.name}</h2>
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
              <div class="flex justify-between items-baseline">
                <h2 class="font-semibold text-lg">Three latest Matches</h2>
                <a
                  href={`/room/${props.params.roomId}/matches`}
                  class="text-md text-orange-400"
                >
                  View all matches
                </a>
              </div>
              <div class="flex flex-col justify-center ">
                {(props.data.matches as Matches).map((m) => {
                  return <MatchCard match={m} />;
                })}
              </div>
            </div>
          )}
      </div>
    </Layout>
  );
}
