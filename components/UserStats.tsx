import { getFavoriteCorporation } from "@/utils/getFavoriteCorporation.ts";
import { getEloChangeInLastMatches } from "@/utils/getEloChangeInLastMatches.ts";
import { getBestCorporation } from "@/utils/getBestCorporation.ts";
import { LatestMatches, RivalStat } from "@/utils/types/types.ts";
import { calculateUserWinRate } from "@/utils/calculateUserWinRate.ts";

type UserStatsProps = {
  usersLatestMatches: LatestMatches[];
  rival: RivalStat;
};

export const UserStats = ({ usersLatestMatches, rival }: UserStatsProps) => {
  const [favCorp, favCorpNum] = getFavoriteCorporation(usersLatestMatches);
  const eloChange = getEloChangeInLastMatches(usersLatestMatches);
  const [worstCorp, worstCorpElo] = getFavoriteCorporation(usersLatestMatches);
  const [bestCorp, bestCorpElo] = getBestCorporation(usersLatestMatches);
  const winRate = calculateUserWinRate(usersLatestMatches);
  const user = usersLatestMatches[0].users;
  const numberOfGames = usersLatestMatches.length;
  return (
    <>
      <h2 className="text-3xl font-bold font-sansman mb-1">{user?.name}</h2>
      <div className="flex gap-2 items-baseline mb-2">
        <span className="text-xl font-semibold font-sansman">
          {user && Math.round(user.elo_rating)}
        </span>
        <span className="text-sm text-stone-400 font-sansman">
          {eloChange > 0
            ? <span className="text-emerald-500">&#9650;{eloChange}</span>
            : <span className="text-red-500">&#9660;{eloChange}</span>}{" "}
          on last four games
        </span>
      </div>
      <div className="text-sm font-light">
        <span className="font-bold">Most played:</span> {favCorp} ({favCorpNum})
      </div>
      <div className="text-sm font-light">
        <span className="font-bold">Total Matches:</span> {numberOfGames}
      </div>
      <div className="text-sm font-light">
        <span className="font-bold">Main rival:</span> {rival.rival_name}{" "}
        ({rival.games_played})
      </div>
      {bestCorpElo > 0 && (
        <div className="text-sm font-light">
          <span className="font-bold">Best:</span> {bestCorp} {bestCorpElo}
        </div>
      )}
      {worstCorpElo < 0 && (
        <div className="text-sm font-light">
          <span className="font-bold">Worst:</span> {worstCorp} {worstCorpElo}
        </div>
      )}
      <div className="text-sm font-light">
        <span className="font-bold">Win Rate:</span> {winRate}
      </div>
    </>
  );
};
