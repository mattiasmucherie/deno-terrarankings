import { getPositionEmoji } from "@/utils/getPositionEmoji.ts";
import { formattedDateShort } from "@/utils/formattedDate.ts";
import { LatestMatches, Maps } from "@/utils/types/types.ts";

type UserMatchTableProps = {
  usersLatestMatches: LatestMatches[];
  lang?: string;
  maps: Maps[];
};

export const UserMatchTable = (
  { usersLatestMatches, lang, maps }: UserMatchTableProps,
) => {
  return (
    <table className="min-w-full leading-normal">
      <thead className="font-sansman bg-alizarin-crimson-900 text-mercury-100 uppercase text-xs font-semibold">
        <tr>
          <th className="px-3 py-3 border-b-2 border-mercury-100 text-left  tracking-wider ">
            #
          </th>
          <th className="px-3 py-3 border-b-2 border-mercury-100 text-left  tracking-wider ">
            VP
          </th>
          <th className="px-5 py-3 border-b-2 border-mercury-100 text-left tracking-wider ">
            Elo&#9650;&#9660;
          </th>
          <th className="px-5 py-3 border-b-2 border-mercury-100 text-left tracking-wider truncate max-w-36 ">
            Corporation
          </th>
          <th className="px-5 py-3 border-b-2 border-mercury-100 text-left tracking-wider">
            Map
          </th>
          <th className="px-5 py-3 border-b-2 border-mercury-100 text-left tracking-wider ">
            Date
          </th>
        </tr>
      </thead>
      <tbody>
        {usersLatestMatches.map((m) => (
          <tr className=" border-b border-mercury-700">
            <td className="px-3 py-2 border-b border-mercury-700 text-sm text-white text-center">
              {getPositionEmoji(m.standing - 1, true)}
            </td>
            <td className="px-3 py-2 border-b border-mercury-700 text-sm text-white">
              {m.points}
            </td>
            {m.new_elo - m.old_elo > 0
              ? (
                <td className="px-5 py-2 border-b border-mercury-700 text-sm text-emerald-500">
                  &#9650; {Math.round(m.new_elo - m.old_elo)}
                </td>
              )
              : (
                <td className="px-5 py-2 border-b border-mercury-700 text-sm text-red-500">
                  &#9660; {Math.round(m.new_elo - m.old_elo)}
                </td>
              )}

            <td className="px-5 py-2 border-b border-mercury-700 text-sm text-white   font-sansman">
              <div className="w-28 truncate">{m.corporations?.name}</div>
            </td>
            <td className="px-5 py-2 border-b border-mercury-700 text-sm text-white">
              {m.matches?.maps?.name && (
                <div
                  className="text-xs font-medium px-2.5 py-0.5 rounded bg-mercury-700 text-mercury-100 w-fit self-start font-sansman"
                  style={{
                    backgroundColor: maps.find((map) =>
                      map.name === m.matches?.maps?.name
                    )
                      ?.color,
                  }}
                >
                  {m.matches.maps.name}
                </div>
              )}
            </td>
            <td className="px-5 py-2 border-b border-mercury-700 text-sm text-white">
              <time dateTime={m.matches?.created_at}>
                {formattedDateShort(
                  new Date(m.matches?.created_at || ""),
                  lang,
                )}
              </time>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
