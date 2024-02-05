import { formattedDate } from "../utils/formattedDate.ts";
import { getPositionEmoji } from "../utils/getPositionEmoji.ts";
import { MatchDetails, MatchParticipant } from "../utils/types/types.ts";

const ParticipantRow = (
  { participant, index }: { participant: MatchParticipant; index: number },
) => {
  const eloDiff = participant.new_elo - participant.old_elo;
  const eloDiffColor = eloDiff > 0 ? "text-emerald-500" : "text-red-500";
  const eloDiffSymbol = eloDiff > 0 ? "▲" : "▼";

  return (
    <div className="flex flex-no-wrap gap-2 items-baseline">
      <span className="shrink-0">{getPositionEmoji(index)}</span>
      <div className="grow flex flex-col">
        <span className="font-semibold col-span-2">
          {participant.user?.name}
        </span>
        <span className="col-span-3 col-start-2 row-start-2 font-light text-xs text-mercury-300">
          {participant.corporation?.name ?? "Unknown Corporation"}
        </span>
      </div>
      <span
        className={`font-semibold ${eloDiffColor} col-start-4 justify-self-end shrink-0`}
      >
        {eloDiffSymbol} {Math.abs(Math.round(eloDiff))}
      </span>
      <span className="font-normal text-xs text-mercury-300 shrink-0">
        {participant.points} VP
      </span>
    </div>
  );
};

export const MatchCard = ({
  match,
  lang,
}: {
  match: MatchDetails;
  lang?: string;
}) => {
  return (
    <div className="border border-alizarin-crimson-950 shadow-lg bg-gradient-to-br from-alizarin-crimson-900 via-cod-gray-950 to-cod-gray-950 rounded-xl p-4 my-2 flex flex-col">
      <div className="flex justify-between">
        <time
          className="text-xs font-medium px-2.5 py-0.5 rounded bg-alizarin-crimson-700 text-mercury-100 w-fit mb-4 self-start"
          dateTime={new Date(match.created_at).toISOString()}
        >
          {formattedDate(new Date(match.created_at), lang)}
        </time>
        {match.maps?.name && (
          <p
            className="text-xs font-medium px-2.5 py-0.5 rounded text-mercury-100 w-fit mb-4 self-start font-sansman"
            style={{ backgroundColor: match.maps.color ?? "inherit" }}
          >
            {match.maps.name}
          </p>
        )}
      </div>
      {match.match_participants.map((mp, index) => (
        <ParticipantRow
          participant={mp}
          index={index}
        />
      ))}
    </div>
  );
};
