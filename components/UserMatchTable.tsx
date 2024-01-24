import { getPositionEmoji } from "../utils/getPositionEmoji.ts";
import { formattedDateShort } from "../utils/formattedDate.ts";
import { LatestMatches, Maps } from "../utils/types/types.ts";

type UserMatchTableProps = {
  usersLatestMatches: LatestMatches[];
  lang?: string;
  maps: Maps[];
};

const TableRow = (
  { match, lang, maps }: { match: LatestMatches; lang?: string; maps: Maps[] },
) => {
  const eloChange = Math.round(match.new_elo - match.old_elo);
  const eloChangeClass = eloChange > 0 ? "text-emerald-500" : "text-red-500";
  const mapColor = maps.find((map) => map.name === match.matches?.maps?.name)
    ?.color;

  return (
    <tr className="border-b border-mercury-700">
      <td className="px-3 py-2 border-b border-mercury-700 text-sm text-white text-center">
        {getPositionEmoji(match.standing - 1, true)}
      </td>
      <td className="px-3 py-2 border-b border-mercury-700 text-sm text-white">
        {match.points}
      </td>
      <td
        className={`px-5 py-2 border-b border-mercury-700 text-sm ${eloChangeClass}`}
      >
        {eloChange > 0 ? `▲` : `▼`} {Math.abs(eloChange)}
      </td>
      <td className="px-5 py-2 border-b border-mercury-700 text-sm text-white font-sansman">
        <div className="w-28 truncate">{match.corporations?.name}</div>
      </td>
      <td className="px-5 py-2 border-b border-mercury-700 text-sm text-white">
        {match.matches?.maps?.name && (
          <div
            className="text-xs font-medium px-2.5 py-0.5 rounded bg-mercury-700 text-mercury-100 w-fit self-start font-sansman"
            style={{ backgroundColor: mapColor }}
          >
            {match.matches.maps.name}
          </div>
        )}
      </td>
      <td className="px-5 py-2 border-b border-mercury-700 text-sm text-white">
        <time dateTime={match.matches?.created_at}>
          {formattedDateShort(new Date(match.matches?.created_at || ""), lang)}
        </time>
      </td>
    </tr>
  );
};

export const UserMatchTable = (
  { usersLatestMatches, lang, maps }: UserMatchTableProps,
) => {
  if (usersLatestMatches.length === 0) return <p>No match data available.</p>;

  return (
    <table className="min-w-full leading-normal">
      <thead className="font-sansman bg-alizarin-crimson-900 text-mercury-100 uppercase text-xs font-semibold">
        <tr>
          <th className="px-3 py-3 border-b-2 border-mercury-100 text-left tracking-wider">
            #
          </th>
          <th className="px-3 py-3 border-b-2 border-mercury-100 text-left tracking-wider">
            VP
          </th>
          <th className="px-5 py-3 border-b-2 border-mercury-100 text-left tracking-wider">
            Elo&#9650;&#9660;
          </th>
          <th className="px-5 py-3 border-b-2 border-mercury-100 text-left tracking-wider truncate max-w-36">
            Corporation
          </th>
          <th className="px-5 py-3 border-b-2 border-mercury-100 text-left tracking-wider">
            Map
          </th>
          <th className="px-5 py-3 border-b-2 border-mercury-100 text-left tracking-wider">
            Date
          </th>
        </tr>
      </thead>
      <tbody>
        {usersLatestMatches.map((match) => (
          <TableRow match={match} lang={lang} maps={maps} />
        ))}
      </tbody>
    </table>
  );
};
