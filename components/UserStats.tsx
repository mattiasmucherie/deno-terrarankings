import { getFavoriteCorporation } from "@/utils/getFavoriteCorporation.ts";
import { getEloChangeInLastMatches } from "@/utils/getEloChangeInLastMatches.ts";
import { getBestCorporation } from "@/utils/getBestCorporation.ts";
import { LatestMatches, RivalStat } from "@/utils/types/types.ts";
import { calculateUserWinRate } from "@/utils/calculateUserWinRate.ts";
import { getWorstCorporation } from "@/utils/getWorstCorporation.ts";
import { ComponentChildren } from "preact";

type UserStatsProps = {
  usersLatestMatches: LatestMatches[];
  rival: RivalStat;
};

const StatCard = ({ children }: { children: ComponentChildren }) => {
  return (
    <div className="text-sm font-light p-2 border rounded border-stone-600 flex flex-col items-center justify-center text-center">
      {children}
    </div>
  );
};
export const UserStats = ({ usersLatestMatches, rival }: UserStatsProps) => {
  const [favCorp, favCorpNum] = getFavoriteCorporation(usersLatestMatches);
  const eloChange = getEloChangeInLastMatches(usersLatestMatches);
  const [worstCorp, worstCorpElo] = getWorstCorporation(usersLatestMatches);
  const [bestCorp, bestCorpElo] = getBestCorporation(usersLatestMatches);
  const winRate = calculateUserWinRate(usersLatestMatches);
  const user = usersLatestMatches[0].users;
  const numberOfGames = usersLatestMatches.length;

  return (
    <>
      <h2 className="text-4xl font-bold font-sansman">{user?.name}</h2>
      <div className="flex gap-2 items-baseline">
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
        <StatCard>
          <div className="text-stone-400 text-xs font-bold">Most played</div>
          <div className="font-extrabold text-lg">{favCorp}</div>
          <div className="text-xs font-thin">({favCorpNum} times)</div>
        </StatCard>
        <StatCard>
          <div className="text-stone-400 text-xs font-bold">Total matches</div>
          <div className="font-bold text-lg">{numberOfGames}</div>
          <div className="text-xs font-thin">({winRate} win rate)</div>
        </StatCard>
        {bestCorpElo > 0 && (
          <StatCard>
            <div className="font-bold text-stone-400 text-xs">
              Best corporation
            </div>
            <div className="font-bold text-lg">{bestCorp}</div>
            <div className="text-xs font-thin">
              <span>Total elo gained{" "}</span>
              <span className="text-emerald-500">&#9650; {bestCorpElo}</span>
            </div>
          </StatCard>
        )}
        {worstCorpElo < 0 && (
          <StatCard>
            <div className="font-bold text-stone-400 text-xs">
              Worst corporation
            </div>
            <div className="font-bold text-lg">{worstCorp}</div>
            <div className="text-xs font-thin">
              <span>Total elo lost{" "}</span>
              <span className="text-red-500">&#9660; {worstCorpElo}</span>
            </div>
          </StatCard>
        )}
        <StatCard>
          <span className="font-bold text-stone-400 text-xs">Main rival:</span>
          <div className="font-extrabold text-lg">{rival.rival_name}</div>
          <div className="text-xs font-thin">
            ({rival.games_played} matches against them)
          </div>
        </StatCard>
      </div>
    </>
  );
};
