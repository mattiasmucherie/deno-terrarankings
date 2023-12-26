import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import Layout from "../../../components/Layout.tsx";
import { State } from "../../_middleware.ts";
import { getUserLatestMatches, UserMatchData } from "../../../utils/db.ts";
import { formattedDateShort } from "../../../utils/formattedDate.ts";
import { getFavoriteCorporation } from "../../../utils/getFavoriteCorporation.ts";
import { getEloChangeInLastMatches } from "../../../utils/getEloChangeInLastMatches.ts";
import { getWorstCorporation } from "../../../utils/getWorstCorporation.ts";
import { getBestCorporation } from "../../../utils/getBestCorporation.ts";
import { calculateUserWinRate } from "../../../utils/calculateUserWinRate.ts";

type UserPageProps = {
  usersLatestMatches: UserMatchData;
};
export const handler: Handlers<UserPageProps, State> = {
  async GET(_req, ctx) {
    const usersLatestMatches = await getUserLatestMatches(
      ctx.state.supabaseClient,
      ctx.params.userId,
    );
    return ctx.render({ ...ctx.state, usersLatestMatches });
  },
};
export default function UserPage(props: PageProps<UserPageProps, State>) {
  const usersLatestMatches = props.data.usersLatestMatches;
  const [favCorp, favCorpNum] = getFavoriteCorporation(usersLatestMatches);
  const eloChange = getEloChangeInLastMatches(usersLatestMatches);
  const [worstCorp, worstCorpElo] = getWorstCorporation(usersLatestMatches);
  const [bestCorp, bestCorpElo] = getBestCorporation(usersLatestMatches);
  const winRate = calculateUserWinRate(usersLatestMatches);
  const user = usersLatestMatches[0].users;
  return (
    <Layout isLoggedIn={!!props.state.token}>
      <div>
        <h2 className="text-2xl font-bold">
          {user.name}
        </h2>
        <div className="flex gap-2 items-baseline mb-2">
          <span className="text-xl font-semibold">
            {Math.round(user.elo_rating)}
          </span>
          <span className="text-sm text-stone-400">
            {eloChange > 0
              ? <span className="text-emerald-500">&#9650; {eloChange}</span>
              : <span className="text-red-500">&#9660; {eloChange}</span>}{" "}
            on last four games
          </span>
        </div>
        <div className="text-sm font-light">
          <span className="font-bold">Favourite Corp:</span> {favCorp}{" "}
          ({favCorpNum})
        </div>
        {bestCorpElo > 0 && (
          <div className="text-sm font-light">
            <span className="font-bold">Best Corp:</span> {bestCorp}{" "}
            {bestCorpElo}
          </div>
        )}
        {worstCorpElo < 0 && (
          <div className="text-sm font-light">
            <span className="font-bold">Worst Corp:</span> {worstCorp}{" "}
            {worstCorpElo}
          </div>
        )}
        <div className="text-sm font-light">
          <span className="font-bold">Win Rate:</span> {winRate}
        </div>
      </div>
      <div className="overflow-x-scroll">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-stone-300 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider ">
                #
              </th>
              <th className="px-5 py-3 border-b-2 border-stone-300 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider ">
                VP
              </th>
              <th className="px-5 py-3 border-b-2 border-stone-300 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider ">
                Elo Change
              </th>
              <th className="px-5 py-3 border-b-2 border-stone-300 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider ">
                Corporation
              </th>
              <th className="px-5 py-3 border-b-2 border-stone-300 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider ">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {usersLatestMatches.map((m) => (
              <tr className="bg-stone-800 border-b border-stone-700">
                <td className="px-5 py-2 border-b border-stone-700 text-sm text-white">
                  {m.standing}
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
                  {m.corporations.name}
                </td>
                <td className="px-5 py-2 border-b border-stone-700 text-sm text-white">
                  <time dateTime={m.matches.created_at}>
                    {formattedDateShort(new Date(m.matches.created_at))}
                  </time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}