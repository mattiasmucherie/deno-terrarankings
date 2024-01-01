import { formattedDate } from "../utils/formattedDate.ts";
import { getPositionEmoji } from "../utils/getPositionEmoji.ts";
import { MatchDetails } from "../utils/types/types.ts";

export const MatchCard = ({ match }: { match: MatchDetails }) => {
  return (
    <div className="border border-carnation-950 shadow-lg bg-gradient-to-br from-carnation-900 via-black-pearl-950 to-black-pearl-950 rounded p-4 my-2 flex flex-col ">
      <time
        className="text-xs font-medium px-2.5 py-0.5 rounded bg-carnation-700 text-fantasy-100 w-fit mb-4 self-start"
        dateTime={new Date(match.created_at).toString()}
      >
        {formattedDate(new Date(match.created_at))}
      </time>
      {match.match_participants.map((mp, index) => {
        const eloDiffColor = Math.round(
          mp.new_elo - mp.old_elo,
        );
        return (
          <div className="flex flex-no-wrap gap-2 items-baseline">
            <span className="shrink-0">
              {getPositionEmoji(index)}
            </span>
            <div className="grow flex flex-col">
              <span className="font-semibold col-span-2">
                {mp.user.name}
              </span>
              <span className="col-span-3 col-start-2 row-start-2 font-light text-xs text-stone-400">
                {mp.corporation.name}
              </span>
            </div>
            {mp.new_elo - mp.old_elo > 0
              ? (
                <span className="font-semibold text-emerald-500 col-start-4 justify-self-end shrink-0">
                  &#9650; {eloDiffColor}
                </span>
              )
              : (
                <span className="font-semibold text-red-500 col-start-4 justify-self-end shrink-0">
                  &#9660; {eloDiffColor}
                </span>
              )}
            <span className="font-normal text-xs text-stone-400 shrink-0">
              {mp.points} VP
            </span>
          </div>
        );
      })}
    </div>
  );
};
