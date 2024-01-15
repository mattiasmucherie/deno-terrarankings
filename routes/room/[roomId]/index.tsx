import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { State } from "@/routes/_middleware.ts";
import { fetchMatchDetails, getRoomWithUsers } from "@/utils/db.ts";
import { LinkButton } from "@/components/LinkButton.tsx";
import { MatchCard } from "@/components/MatchCard.tsx";
import { formattedDate } from "@/utils/formattedDate.ts";
import { MatchDetails, RoomWithUsers } from "@/utils/types/types.ts";
import RankingChart from "@/islands/RankingChart.tsx";

const NUMBER_OF_MATCHES = 30;

interface RoomPageProps {
  matches: MatchDetails[];
  roomWithUsers: RoomWithUsers;
  lang?: string;
}
export const handler: Handlers<RoomPageProps, State> = {
  async GET(req, ctx) {
    const matches = await fetchMatchDetails(
      ctx.state.supabaseClient,
      ctx.params.roomId,
      NUMBER_OF_MATCHES,
    );
    const roomWithUsers = await getRoomWithUsers(
      ctx.state.supabaseClient,
      ctx.params.roomId,
    );
    const lang = req.headers.get("Accept-Language")?.split(",")[0];
    return ctx.render({ ...ctx.state, matches, roomWithUsers, lang });
  },
};

export default function RoomPage(props: PageProps<RoomPageProps, State>) {
  const room = props.data.roomWithUsers;
  const createdAt = new Date(room.created_at);
  const users = room.users;

  return (
    <div className="mx-auto flex max-w-screen-md flex-col justify-center">
      <h2 className="font-bold text-2xl mb-1 font-sansman">{room.name}</h2>
      <time
        className="font-light text-xs text-mercury-400"
        dateTime={createdAt.toString()}
      >
        Created at {formattedDate(createdAt, props.data.lang)}
      </time>
      {!!users.length && (
        <ul className="flex flex-col justify-center text-wheatfield-100 gap-1 my-5">
          {users.map((user, index) => {
            return (
              <li>
                <a
                  className="flex justify-between items-center gap-2"
                  href={`/room/${props.params.roomId}/${user.id}`}
                >
                  <div className="flex gap-2 items-center flex-grow">
                    <span className="text-lg font-bold basis-6">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </span>
                    <span className="text-cod-gray-950 bg-wheatfield-100 px-3 py-0.5 rounded-full flex-grow font-bold flex justify-between">
                      <span>{user.name}</span> <span>&#10140;</span>
                    </span>
                  </div>
                  <span className="font-bold basis-10">
                    {Math.round(user.elo_rating)}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex gap-6 justify-end">
        <LinkButton
          href={`/room/${props.params.roomId}/new-player`}
        >
          New Player
        </LinkButton>
        <LinkButton
          href={`/room/${props.params.roomId}/new-match`}
          variant="secondary"
        >
          New Match
        </LinkButton>
      </div>
      {!!props.data.matches.length &&
        (
          <div className="my-3">
            <div className="flex justify-between items-baseline">
              <h2 className="font-semibold text-lg font-sansman">
                Latest matches
              </h2>
              <a
                href={`/room/${props.params.roomId}/matches`}
                className="text-md text-mercury-100"
              >
                View all matches
              </a>
            </div>
            <div className="flex flex-col justify-center">
              {props.data.matches.toSpliced(3).map((m) => (
                <MatchCard match={m} lang={props.data.lang} />
              ))}
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
      <div>
        {props.data.matches.length > 0 &&
          (
            <>
              <div className="my-4">
                <h2 className="font-semibold text-lg font-sansman">
                  Ranking Chart
                </h2>
                <p className="font-light text-xs text-mercury-400">
                  Max {NUMBER_OF_MATCHES} latest games
                </p>
              </div>

              <RankingChart
                matches={props.data.matches.toReversed()}
              />
            </>
          )}
      </div>
    </div>
  );
}
