import { getFavoriteCorporation } from "@/utils/getFavoriteCorporation.ts";
import { getEloChangeInLastMatches } from "@/utils/getEloChangeInLastMatches.ts";
import { getBestCorporation } from "@/utils/getBestCorporation.ts";
import { LatestMatches, Maps, RivalStat } from "@/utils/types/types.ts";
import { calculateUserWinRate } from "@/utils/calculateUserWinRate.ts";
import { getWorstCorporation } from "@/utils/getWorstCorporation.ts";
import { type ComponentChildren } from "preact";
import { getFavoriteMap } from "@/utils/getFavoriteMap.ts";

type UserStatsProps = {
  usersLatestMatches: LatestMatches[];
  rival: RivalStat;
  maps: Maps[];
};

const StatCard = ({ children }: { children: ComponentChildren }) => {
  return (
    <div className="text-sm font-light p-2 border rounded border-concrete-600 flex flex-col items-center justify-center text-center">
      {children}
    </div>
  );
};
export const UserStats = (
  { usersLatestMatches, rival, maps }: UserStatsProps,
) => {
  const [favCorp, favCorpNum] = getFavoriteCorporation(usersLatestMatches);
  const eloChange = getEloChangeInLastMatches(usersLatestMatches);
  const [worstCorp, worstCorpElo] = getWorstCorporation(usersLatestMatches);
  const [bestCorp, bestCorpElo] = getBestCorporation(usersLatestMatches);
  const [favoriteMap, mapCount] = getFavoriteMap(usersLatestMatches);
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
        <span className="text-sm text-concrete-400 font-sansman">
          {eloChange > 0
            ? <span className="text-emerald-500">&#9650;{eloChange}</span>
            : <span className="text-red-500">&#9660;{eloChange}</span>}{" "}
          on last four games
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
        <StatCard>
          <div className="text-concrete-400 text-xs font-bold">Most played</div>
          <div className="font-extrabold text-lg font-sansman">{favCorp}</div>
          <div className="text-xs font-extralight">({favCorpNum} times)</div>
        </StatCard>
        <StatCard>
          <div className="text-concrete-400 text-xs font-bold">
            Total matches
          </div>
          <div className="font-bold text-lg font-sansman">{numberOfGames}</div>
          <div className="text-xs font-extralight">({winRate} win rate)</div>
        </StatCard>
        {bestCorpElo > 0 && (
          <StatCard>
            <div className="font-bold text-concrete-400 text-xs">
              Best corporation
            </div>
            <div className="font-bold text-lg font-sansman">{bestCorp}</div>
            <div className="text-xs font-extralight">
              <span>Total elo gained{" "}</span>
              <span className="text-emerald-500">&#9650; {bestCorpElo}</span>
            </div>
          </StatCard>
        )}
        {worstCorpElo < 0 && (
          <StatCard>
            <div className="font-bold text-concrete-400 text-xs">
              Worst corporation
            </div>
            <div className="font-bold text-lg font-sansman">{worstCorp}</div>
            <div className="text-xs font-extralight">
              <span>Total elo lost{" "}</span>
              <span className="text-red-500">&#9660; {worstCorpElo}</span>
            </div>
          </StatCard>
        )}
        <StatCard>
          <div className="font-bold text-concrete-400 text-xs">Main rival</div>
          <div className="font-extrabold text-lg font-sansman">
            {rival.rival_name}
          </div>
          <div className="text-xs font-extralight">
            ({rival.games_played} matches against them)
          </div>
        </StatCard>
        {mapCount > 0 && (
          <StatCard>
            <div className="font-bold text-concrete-400 text-xs">
              Most played map
            </div>
            <div
              className="text-md font-medium px-2.5 py-0.5 rounded bg-concrete-700 text-concrete-100 w-fit my-1 font-sansman"
              style={{
                backgroundColor: maps.find((m) => m.name === favoriteMap)
                  ?.color,
              }}
            >
              {favoriteMap}
            </div>
            <div className="text-xs font-extralight">
              (Played it {mapCount} times)
            </div>
          </StatCard>
        )}
      </div>
    </>
  );
};
