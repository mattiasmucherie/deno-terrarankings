import { LatestMatches } from "./types/types.ts";

export function getEloChangeInLastMatches(
  matchData: LatestMatches[],
  numberOfMatches = 4,
): number {
  const recentMatches = matchData.slice(0, numberOfMatches);

  if (recentMatches.length === 0) {
    return 0;
  }

  const startElo = recentMatches[recentMatches.length - 1].old_elo;
  const endElo = recentMatches[0].new_elo;

  return Math.round(endElo - startElo);
}
