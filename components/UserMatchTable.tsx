import { getPositionEmoji } from "@/utils/getPositionEmoji.ts";
import { formattedDateShort } from "@/utils/formattedDate.ts";
import { LatestMatches } from "@/utils/types/types.ts";

type UserMatchTableProps = {
  usersLatestMatches: LatestMatches[];
  lang?: string;
};

export const UserMatchTable = (
  { usersLatestMatches, lang }: UserMatchTableProps,
) => {
  return (
    <table className="min-w-full leading-normal">
      <thead className="font-sansman bg-carnation-900 text-stone-300 uppercase text-xs font-semibold">
        <tr>
          <th className="px-5 py-3 border-b-2 border-stone-300 text-left  tracking-wider ">
            #
          </th>
          <th className="px-5 py-3 border-b-2 border-stone-300 text-left  tracking-wider ">
            VP
          </th>
          <th className="px-5 py-3 border-b-2 border-stone-300 text-left  tracking-wider ">
            Elo Change
          </th>
          <th className="px-5 py-3 border-b-2 border-stone-300 text-left tracking-wider ">
            Corporation
          </th>
          <th className="px-5 py-3 border-b-2 border-stone-300 text-left tracking-wider ">
            Date
          </th>
        </tr>
      </thead>
      <tbody>
        {usersLatestMatches.map((m) => (
          <tr className="bg-stone-800 border-b border-stone-700">
            <td className="px-5 py-2 border-b border-stone-700 text-sm text-white">
              {getPositionEmoji(m.standing - 1, true)}
            </td>
            <td className="px-5 py-2 border-b border-stone-700 text-sm text-white">
              {m.points}
            </td>
            {m.new_elo - m.old_elo > 0
              ? (
                <td className="px-5 py-2 border-b border-stone-700 text-sm text-emerald-500">
                  &#9650; {Math.round(m.new_elo - m.old_elo)}
                </td>
              )
              : (
                <td className="px-5 py-2 border-b border-stone-700 text-sm text-red-500">
                  &#9660; {Math.round(m.new_elo - m.old_elo)}
                </td>
              )}

            <td className="px-5 py-2 border-b border-stone-700 text-sm text-white truncate max-w-36">
              {m.corporations?.name}
            </td>
            <td className="px-5 py-2 border-b border-stone-700 text-sm text-white">
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
