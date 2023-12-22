import { Match } from "../utils/db.ts";

export const MatchCard = ({ match }: { match: Match }) => {
  return (
    <div class="border border-zinc-700 rounded-lg p-4 my-2 flex flex-col ">
      <time
        class="text-xs font-medium px-2.5 py-0.5 rounded bg-amber-900 text-amber-300 w-fit mb-4 self-start"
        dateTime={new Date(match.created_at).toString()}
      >
        {new Date(match.created_at).toLocaleDateString()}
      </time>
      {match.match_participants.map((mp, index) => {
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
};
