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
import { formattedDate } from "../../../utils/formattedDate.ts";
import { getPositionEmoji } from "../../../utils/getPositionEmoji.ts";

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
        <h2 className="font-bold text-2xl mb-1">{room.name}</h2>
        <time
          className="font-light text-xs text-stone-400"
          dateTime={createdAt.toString()}
        >
          Created at {formattedDate(createdAt)}
        </time>
        {!!users.length && (
          <div className=" flex flex-col justify-center border border-stone-600 shadow-lg bg-stone-900 rounded-lg px-6 py-3 my-3">
            <h3 className="my-2 font-bold text-xl">Ranking</h3>
            <ul className="divide-y divide-stone-700">
              {users.map((user: any, index: number) => {
                return (
                  <li>
                    <a
                      className="flex justify-between items-center py-2"
                      href={`/room/${props.params.roomId}/${user.id}`}
                    >
                      <span>{getPositionEmoji(index)} {user.name}</span>{" "}
                      <span className="font-semibold">
                        {Math.round(user.elo_rating)}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <div className="flex gap-6 justify-end">
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
            <div className="my-3">
              <div className="flex justify-between items-baseline">
                <h2 className="font-semibold text-lg">Latest matches</h2>
                <a
                  href={`/room/${props.params.roomId}/matches`}
                  className="text-md text-trinidad-400"
                >
                  View all matches
                </a>
              </div>
              <div className="flex flex-col justify-center ">
                {(props.data.matches as Matches).map((m) => {
                  return <MatchCard match={m} />;
                })}
              </div>
            </div>
          )}
        <div className="flex justify-center">
          <LinkButton
            href={`/corporations`}
          >
            See corporation stats
          </LinkButton>
        </div>
      </div>
    </Layout>
  );
}
